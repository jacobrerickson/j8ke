"use client";

import { useEffect, useState } from "react";

export default function FetchPage() {
    const URL = "https://jsonplaceholder.typicode.com/todos/1";
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const data = await fetch(URL);
            const parsedData = await data.json();
            setData(parsedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);


    return (
        <div>
            <h1>Fetch Page</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <p>{JSON.stringify(data)}</p>
            )}
        </div>
    );
}