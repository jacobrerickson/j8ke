"use client";

import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

interface Task {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

// JSONPlaceholder API interfaces
interface JSONPlaceholderUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

interface JSONPlaceholderTodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface UserDashboardProps {
  initialUsers: User[];
}

// Not typed
const UserDashboard = ({ initialUsers }: UserDashboardProps) => {
  const [users, setUsers] = useState<User[]>(initialUsers || []);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // didn't clean up interval in useEffect cleanup unmount
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Refreshing user data...');
      fetchUsers();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // no deps array
  useEffect(() => {
    if (selectedUser) {
      fetchUserTasks(selectedUser.id);
    }
  }, [selectedUser]);

  // no finally block?
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const userData = await response.json();
      // Transform the data to match our User interface
      const transformedUsers = userData.map((user: JSONPlaceholderUser) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: Math.random() > 0.5 // Random active status for demo
      }));
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
    setIsLoading(false);
  };

  // no loading
  const fetchUserTasks = async (userId: number) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/todos`);
      const taskData = await response.json();
      // Transform todos to match our Task interface
      const transformedTasks = taskData.map((todo: JSONPlaceholderTodo) => ({
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        userId: todo.userId
      }));
      setTasks(transformedTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  // selecting user instead of userId?
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const handleTaskToggle = (taskId: number) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        task.completed = !task.completed;
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim() && selectedUser) {
      const newTask: Task = {
        id: Date.now(),
        title: newTaskTitle,
        completed: false,
        userId: selectedUser.id
      };
      tasks.push(newTask);
      setTasks(tasks);
      setNewTaskTitle('');
    }
  };

  const handleUserStatusToggle = (userId: number) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        user.isActive = !user.isActive;
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // missing key prop on list 
  const renderUserList = () => {
    return filteredUsers.map(user => (
      <div 
        className={`user-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
        onClick={() => handleUserSelect(user)}
        key={user.id}
      >
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <button 
          onClick={() => handleUserStatusToggle(user.id)}
          className={user.isActive ? 'active' : 'inactive'}
        >
          {user.isActive ? 'Active' : 'Inactive'}
        </button>
      </div>
    ));
  };

  // missing key prop
  const renderTaskList = () => {
    if (!selectedUser) return <p>Select a user to view their tasks</p>;
    
    return tasks.map(task => (
      <div className="task-item" key={task.id}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => handleTaskToggle(task.id)}
        />
        <span className={task.completed ? 'completed' : ''}>{task.title}</span>
      </div>
    ));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>
      
      <div className="search-section">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="dashboard-content">
        <div className="users-section">
          <h2>Users ({filteredUsers.length})</h2>
          <div className="user-list">
            {renderUserList()}
          </div>
        </div>

        <div className="tasks-section">
          <h2>Tasks for {selectedUser?.name || 'No user selected'}</h2>
          
          {selectedUser && (
            <div className="add-task">
              <input
                type="text"
                placeholder="New task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <button onClick={handleAddTask}>Add Task</button>
            </div>
          )}
          
          <div className="task-list">
            {renderTaskList()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
