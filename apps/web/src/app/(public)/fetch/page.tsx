"use client";

import { useEffect, useState } from "react";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const URL = "https://jsonplaceholder.typicode.com/todos";
const PAGE_LIMIT = 5;

export default function FetchPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async (page: number) => {
    try {
      const data = await fetch(`${URL}?_page=${page}&_limit=${PAGE_LIMIT}`);
      const parsedData = await data.json();
      if (page === 1) {
        setTodos(parsedData);
      } else {
        setTodos((prev) => [...prev, ...parsedData])
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchTodos(nextPage);
  }

  useEffect(() => {
    fetchTodos(1);
  }, []);


  return (
    <div className="tw-min-h-screen tw-bg-gray-50 dark:tw-bg-gray-900 tw-py-12">
      <div className="tw-container tw-mx-auto tw-px-4">
      <h1 className="tw-text-4xl tw-font-bold tw-text-gray-900 dark:tw-text-gray-100 tw-mb-4">Fetch Page</h1>
      <button onClick={loadMore} className="tw-bg-slate-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-text-sm tw-mb-8">Load More</button>
      {loading ? 
      <p className="tw-text-gray-600 dark:tw-text-gray-400">Loading...</p> : 
      <ul className="tw-list-disc tw-list-inside tw-space-y-1 tw-text-sm tw-text-gray-600 dark:tw-text-gray-300">
        {todos.map((todo) => {
            return <li key={todo.id}>{todo.title} --  {todo.completed ? "done" : "not done"}</li>
        })}
        </ul>
        }
      </div>
    </div>
  );
}
