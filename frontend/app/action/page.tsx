"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskTable from '@/components/custom/task-table';

const PageTemp = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <TaskTable tasks={tasks} />
    </div>
  );
};

export default PageTemp;