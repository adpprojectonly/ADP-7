import React, { useState, useEffect } from 'react';
import { Button, Input, Textarea, Select, SelectItem } from '@nextui-org/react';
import axios from 'axios';

const TaskEditForm = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [assignedToId, setAssignedToId] = useState(task.assignedToId);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const organizationId = localStorage.getItem('organizationId');
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/user/get-org-profiles/${organizationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.statusCode === 200) {
          setUsers(response.data.ourUsersList);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSave = async () => {
    const updatedTask = {
      ...task,
      title,
      description,
      status,
      assignedToId,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:8080/tasks/${updatedTask.id}`, updatedTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Call the onSave callback if provided
        if (onSave) {
          onSave(updatedTask);
        }
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
    console.log(updatedTask);
  };

  return (
    <div>
      <div className="mb-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
        />
      </div>
      <div className="mb-4">
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          required
        />
      </div>
      <div className="mb-4">
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          fullWidth
          required
        >
          <SelectItem key="TO_DO" value="TO_DO">To Do</SelectItem>
          <SelectItem key="IN_PROGRESS" value="IN_PROGRESS">In Progress</SelectItem>
          <SelectItem key="COMPLETED" value="COMPLETED">Completed</SelectItem>
        </Select>
      </div>
      <div className="mb-4">
        <Select
          label="Assigned To"
          value={assignedToId}
          onChange={(e) => setAssignedToId(e.target.value)}
          fullWidth
          required
        >
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.actualUsername}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button auto flat color="error" onPress={onCancel}>
          Cancel
        </Button>
        <Button auto onPress={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default TaskEditForm;