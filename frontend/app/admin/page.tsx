"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface IUser {
  id: number;
  email: string;
  username: string;
  role: string;
  actualUsername: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<IUser | null>(null);
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("USER");
  const [actualUsername, setActualUsername] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/user/get-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data.user);
      console.log(response.data.user);
      console.log(user);
      
      localStorage.setItem('organizationId', response.data.user.organization);
      const allUsers = await axios.get(`http://localhost:8080/user/get-org-profiles/${response.data.user.organization}`, {
        headers: {Authorization: `Bearer ${token}`},
      });

      setUsers(allUsers.data.ourUsersList);
      console.log(allUsers.data);

    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const newUser = { email, username, role, actualUsername };
      await axios.post("http://localhost:8080/user/create", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      setEmail("");
      setUsername("");
      setRole("USER");
      setActualUsername("");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleEditUser = (user: IUser) => {
    setIsEditing(true);
    setSelectedUser(user);
    setEmail(user.email);
    setUsername(user.username);
    setRole(user.role);
    setActualUsername(user.actualUsername);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem("token");
      const updatedUser = {
        ...selectedUser,
        email,
        username,
        role,
        actualUsername,
      };
      await axios.put(`http://localhost:8080/user/${selectedUser.id}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditing(false);
      setSelectedUser(null);
      setEmail("");
      setUsername("");
      setRole("USER");
      setActualUsername("");
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {/* Add User Form */}
      <div className="bg-white shadow p-4 mb-6 rounded">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit User" : "Add New User"}</h2>
        <div className="flex gap-4 mb-2">
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium">Email</label>
            <input
              type="text"
              className="border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium">Username</label>
            <input
              type="text"
              className="border p-2 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-4 mb-2">
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium">Role</label>
            <select
              className="border p-2 rounded"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-sm font-medium">Actual Name</label>
            <input
              type="text"
              className="border p-2 rounded"
              value={actualUsername}
              onChange={(e) => setActualUsername(e.target.value)}
            />
          </div>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 mt-3 rounded"
          onClick={isEditing ? handleUpdateUser : handleAddUser}
        >
          {isEditing ? "Update User" : "Add User"}
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">Existing Users</h2>
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border-b">ID</th>
              <th className="p-2 border-b">Email</th>
              <th className="p-2 border-b">Username</th>
              <th className="p-2 border-b">Role</th>
              <th className="p-2 border-b">Actual Name</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-2 border-b">{user.id}</td>
                <td className="p-2 border-b">{user.email}</td>
                <td className="p-2 border-b">{user.username}</td>
                <td className="p-2 border-b">{user.role}</td>
                <td className="p-2 border-b">{user.actualUsername}</td>
                <td className="p-2 border-b">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 mr-2 rounded"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}