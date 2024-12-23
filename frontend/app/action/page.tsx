"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskTable from '@/components/custom/task-table';
import TaskCreateForm from "@/components/ui/task-create-form";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";

const Page = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  interface Task {
    id: string;
    title: string;
    description: string;
    createdById: string;
    assignedToId: string;
    reporteeId: string;
    [key: string]: unknown; 
  }

  const [createdTasks, setCreatedTasks] = useState<Task[]>([]);
  const [reportingTasks, setReportingTasks] = useState<Task[]>([]);
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
        
        const userId = Number(localStorage.getItem("userid"));
        
        const created = tasks.filter((task: { createdById: { toString: () => string | null; }; }) => task.createdById === userId);
        const reporting = tasks.filter((task: { reporteeId: { toString: () => string | null; }; }) => task.reporteeId === userId);

        // Fetch usernames for created tasks
        const createdTasksWithUsernames = await Promise.all(created.map(async (task) => {
          const assignedToResponse = await axios.get(`http://localhost:8080/user/get-profile/${task.assignedToId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const assignedToName = assignedToResponse.data.actualUsername;
          return { ...task, assignedToName };
        }));

        // Fetch usernames for reporting tasks
        const reportingTasksWithUsernames = await Promise.all(reporting.map(async (task) => {
          const createdByResponse = await axios.get(`http://localhost:8080/user/get-profile/${task.createdById}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const createdByName = createdByResponse.data.actualUsername;
          return { ...task, createdByName };
        }));

        setCreatedTasks(createdTasksWithUsernames);
        setReportingTasks(reportingTasksWithUsernames);

        console.log(createdTasksWithUsernames, reportingTasksWithUsernames)
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [userId]); // Only depend on userId

  const handleSaveTask = async (newTask: Task) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:8080/tasks', newTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const savedTask = response.data;
      
      // Fetch the username for the assignedToId
      const assignedToResponse = await axios.get(`http://localhost:8080/user/get-profile/${savedTask.assignedToId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const assignedToName = assignedToResponse.data.actualUsername;

      // Update the createdTasks state with the new task
      setCreatedTasks((prevTasks) => [...prevTasks, { ...savedTask, assignedToName }]);
      onOpenChange()
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };
  return (
      <div className="p-5">
        <div className="mt-5 flex flex-row justify-between">
          <h1 className="text-2xl font-bold">My Actions</h1>
          <Button className="font-semibold"onPress={onOpen} color="secondary">+ Create Task</Button>
        </div>
        <div className="mt-5">
          <h2 className="text-xl font-semibold pb-2">Assigned To</h2>
          <TaskTable tasks={createdTasks} table={"createdTask"} />
        </div>
        <div className="mt-5">
          <h2 className="text-xl font-semibold pb-2">Reporting</h2>
          <TaskTable tasks={reportingTasks} table={"reportingTask"} />
        </div>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                <ModalBody>
                  <TaskCreateForm onSave={(newTask: Task) => handleSaveTask(newTask)} onCancel={onOpenChange} />
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
  );
};

export default Page;