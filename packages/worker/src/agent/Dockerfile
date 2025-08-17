FROM python:3.12.1

WORKDIR /app

RUN pip install --no-cache-dir \
    redis \
    bullmq \
    requests \
    python-dotenv \
    watchdog[watchmedo] \
    langchain-openai \
    langgraph \
    openai \
    langchain-core \
    aiohttp

# Create entrypoint script directly in the Dockerfile
RUN echo '#!/bin/bash\n\
    set -e\n\
    echo "Starting entrypoint script"\n\
    # Replace localhost with host.docker.internal in environment variables\n\
    if [[ $SERVER_URL == *"localhost"* ]]; then\n\
    export SERVER_URL="${SERVER_URL/localhost/host.docker.internal}"\n\
    echo "Converted SERVER_URL to $SERVER_URL"\n\
    fi\n\
    \n\
    if [[ $REDIS_HOST == *"localhost"* ]]; then\n\
    export REDIS_HOST="${REDIS_HOST/localhost/host.docker.internal}"\n\
    echo "Converted REDIS_HOST to $REDIS_HOST"\n\
    fi\n\
    \n\
    # Debug output\n\
    echo "Environment variables after processing:"\n\
    echo "SERVER_URL=$SERVER_URL"\n\
    echo "REDIS_HOST=$REDIS_HOST"\n\
    \n\
    # Execute the command passed to the entrypoint\n\
    exec "$@"' > /app/entrypoint.sh \
    && chmod +x /app/entrypoint.sh

# Copy the application files
COPY . /app/

# Use the entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["watchmedo", "auto-restart", "--directory=.", "--pattern=*.py;*.json;*.yaml;*.yml;*.env", "--recursive", "--debug-force-polling", "--debug", "-v", "--", "python", "worker.py"]