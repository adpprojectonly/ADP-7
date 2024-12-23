import React, { useState, useEffect } from 'react';
import { Button, Input, Textarea, Select, SelectItem } from '@nextui-org/react';
import axios from 'axios';

const TaskCreateForm = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('TO_DO');
  const [assignedToId, setAssignedToId] = useState('');
  const [reporteeId, setReporteeId] = useState('');
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
    const newTask = {
      title,
      description,
      status,
      assignedToId,
      createdById: localStorage.getItem('userid'),
      reporteeId,
      organizationId: localStorage.getItem('organizationId'),
      attachedDocument: null,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      originalValues: {},
    };

    try {
      if (onSave) {
        onSave(newTask);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
    console.log(newTask);
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
      <div className="mb-4">
        <Select
          label="Reporting To"
          value={reporteeId}
          onChange={(e) => setReporteeId(e.target.value)}
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

export default TaskCreateForm;