import os
import asyncio
import signal
import logging
import requests # type: ignore
from bullmq import Worker, Job # type: ignore   
from internet_search_agent import InternetSearchAgent

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define job status constants to match the TypeScript enum
class JobStatus:
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

# Create a single instance of the agent to be reused
search_agent = InternetSearchAgent()

def update_job_status(job_id: str, status: str, result=None, error=None):
    """Update job status in the server."""
    server_url = os.getenv("SERVER_URL")
    if not server_url:
        logger.error("SERVER_URL environment variable is not set")
        return

    try:
        url = f"{server_url}/redis.updateJob"
        payload = {
            "jobId": job_id,
            "status": status,
        }
        if result:
            payload["result"] = result
        if error:
            payload["error"] = str(error)

        logger.info(f"Updating job {job_id} status to {status}")
        logger.info(f"Payload: {payload}")

        response = requests.post(url, json=payload)
        if response.status_code != 200:
            logger.error(f"Failed to update job status: {response.text}")
        else:
            logger.info(f"Successfully updated job {job_id} status to {status}")
    except Exception as e:
        logger.error(f"Error updating job status: {str(e)}")

async def process(job: Job, job_token):
    """Process a job from the queue using the internet search agent."""
    try:
        job_id = job.data.get('jobId')
        if not job_id:
            logger.error("No jobId provided in job data")
            return {
                "error": "No jobId provided in job data",
                "status": "error"
            }

        logger.info(f"Starting to process job {job_id}")

        # Update status to processing
        update_job_status(job_id, JobStatus.PROCESSING)

        query = job.data.get('query')
        if not query:
            error = {"message": "No query provided in job data", "type": "VALIDATION_ERROR"}
            update_job_status(job_id, JobStatus.FAILED, error=error)
            return {
                "error": "No query provided in job data",
                "status": "error"
            }

        # Perform the search using our agent
        logger.info(f"Job {job_id}: Executing search for query: {query}")
        result = search_agent.search(query)
        logger.info(f"Job {job_id}: Search completed")

        # Extract the final message content
        final_message = result['result']['messages'][-1].content
        logger.info(f"Job {job_id}: Final response: {final_message[:100]}...")  # Log first 100 chars

        # Update status to completed with result
        update_job_status(
            job_id,
            JobStatus.COMPLETED,
            result=final_message
        )

        return {
            "query": query,
            "response": final_message,
            "status": "success"
        }

    except Exception as e:
        logger.error(f"Job {job_id}: Error during processing: {str(e)}")
        # Update status to failed with error
        if job_id:
            update_job_status(
                job_id,
                JobStatus.FAILED,
                error={"message": str(e), "type": type(e).__name__}
            )
        return {
            "error": str(e),
            "error_type": type(e).__name__,
            "status": "error"
        }

async def main():
    logger.info("Starting worker service")
    logger.info("Listening on queue: ai_agents_queue")

    # Configure Redis connection
    password = os.getenv("REDIS_PASSWORD")
    host = os.getenv("REDIS_HOST")
    port = os.getenv("REDIS_PORT")

    # Format the connection string based on whether a password is provided
        

    if password:
        connection = f"redis://:{password}@{host}:{port}"
    else:
        connection = f"redis://{host}:{port}"

    if host == "host.docker.internal":
        connection = f"redis://{host}:{port}"

    logger.info(f"Connecting to Redis at: {connection}")

    # Configure worker with concurrency settings
    worker = Worker(
        "ai_agents_queue",
        process,
        {
            "connection": connection,
            "lockDuration": 180000,
            "concurrency": 1,  # Process one job at a time
            "limiter": {
                "max": 1,
                "duration": 1000
            }
        }
    )
    logger.info("Worker initialized with concurrency settings")

    # Create an event to handle shutdown
    shutdown_event = asyncio.Event()

    def handle_shutdown(signum, frame):
        logger.info("Received shutdown signal, cleaning up...")
        asyncio.create_task(worker.close())
        shutdown_event.set()

    # Register signal handlers
    signal.signal(signal.SIGINT, handle_shutdown)
    signal.signal(signal.SIGTERM, handle_shutdown)
    logger.info("Signal handlers registered for SIGINT and SIGTERM")

    # Wait for shutdown signal
    await shutdown_event.wait()
    logger.info("Worker shut down successfully.")

if __name__ == "__main__":
    logger.info('Environment Variables:')
    logger.info(f"REDIS_HOST: {os.getenv('REDIS_HOST')}")
    logger.info(f"REDIS_PASSWORD: {os.getenv('REDIS_PASSWORD')}")
    logger.info(f"REDIS_PORT: {os.getenv('REDIS_PORT')}")
    logger.info(f"SERVER_URL: {os.getenv('SERVER_URL')}")

    asyncio.run(main())