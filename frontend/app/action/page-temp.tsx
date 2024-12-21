"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AssignedTasks() {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [reportingTasks, setReportingTasks] = useState([]);
  const userId = localStorage.getItem('userid');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const tasks = response.data;
        const assigned = tasks.filter(task => task.createdById.toString() === userId);
        const reporting = tasks.filter(task => task.reporteeId.toString() === userId);

        setAssignedTasks(assigned);
        setReportingTasks(reporting);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [userId]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">My Actions</h1>
      <div className="mt-5">
        <h2 className="text-xl font-semibold">Assigned Tasks</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Task Title</th>
              <th className="py-2">Status</th>
              <th className="py-2">Assigned To</th>
              <th className="py-2">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {assignedTasks.map(task => (
              <tr key={task.id}>
                <td className="py-2">{task.id}</td>
                <td className="py-2">{task.title}</td>
                <td className="py-2">{task.status}</td>
                <td className="py-2">{task.assignedToId}</td>
                <td className="py-2">{task.updatedAt ? new Date(task.updatedAt).toLocaleString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5">
        <h2 className="text-xl font-semibold">Tasks Reporting to Me</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Task Title</th>
              <th className="py-2">Status</th>
              <th className="py-2">Assigned By</th>
              <th className="py-2">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {reportingTasks.map(task => (
              <tr key={task.id}>
                <td className="py-2">{task.id}</td>
                <td className="py-2">{task.title}</td>
                <td className="py-2">{task.status}</td>
                <td className="py-2">{task.createdById}</td>
                <td className="py-2">{task.updatedAt ? new Date(task.updatedAt).toLocaleString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}