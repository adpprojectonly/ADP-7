"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminTable from "@/components/custom/admin-table";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

interface IUser {
  id: number;
  email: string;
  username: string;
  role: string;
  actualUsername: string;
  password?: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(null);
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  // Form states
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("USER");
  const [actualUsername, setActualUsername] = useState("");
  const [password, setPassword] = useState("");

  // Fetch all users
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/user/get-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response.data.user);
      
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

  // Open modal for adding user
  const handleAddUser = () => {
    clearForm();
    setModalType("add");
    onOpen();
  };

  // Open modal for editing user
  const handleEditUser = (user: IUser) => {
    setSelectedUser(user);
    setEmail(user.email);
    setUsername(user.username);
    setRole(user.role);
    setActualUsername(user.actualUsername);
    setPassword("");
    setModalType("edit");
    onOpen();
  };

  // Open modal for deleting user
  const handleDeleteUser = (userId: number) => {
    setSelectedUser(users.find((user) => user.id === userId) || null);
    setModalType("delete");
    onOpen();
  };

  // Add new user
  const submitAddUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const organizationId = localStorage.getItem("organizationId");
      const newUser: IUser = {
        id: 0,
        email,
        username: actualUsername,
        role,
        actualUsername,
        password,
      };
      await axios.post("http://localhost:8080/auth/register", { ...newUser, organizationId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAllUsers();
      onOpenChange();
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  // Update user
  const submitEditUser = async () => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem("token");
      const updatedUser: IUser = {
        ...selectedUser,
        email,
        username,
        role,
        actualUsername,
      };
      await axios.put(
        `http://localhost:8080/admin/update/${selectedUser.id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchAllUsers();
      onOpenChange();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Delete user
  const submitDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/admin/delete/${selectedUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAllUsers();
      onOpenChange();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Clear form states
  const clearForm = () => {
    setSelectedUser(null);
    setEmail("");
    setUsername("");
    setRole("USER");
    setActualUsername("");
    setPassword("");
  };

  const renderModalBody = () => {
    if (modalType === "delete") {
      return (
        <>
          <ModalHeader>Delete User</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete user: {selectedUser?.username}?</p>
          </ModalBody>
          <ModalFooter>
            <Button color="default" onPress={onOpenChange}>
              Cancel
            </Button>
            <Button color="danger" onPress={submitDeleteUser}>
              Delete
            </Button>
          </ModalFooter>
        </>
      );
    }

    return (
      <>
        <ModalHeader>{modalType === "add" ? "Add User" : "Edit User"}</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm mb-1 block">Email</label>
              <input
                className="border p-2 rounded w-full"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* <div>
              <label className="text-sm mb-1 block">Username</label>
              <input
                className="border p-2 rounded w-full"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div> */}
            <div>
              <label className="text-sm mb-1 block">Role</label>
              <select
                className="border p-2 rounded w-full"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div>
              <label className="text-sm mb-1 block">Actual Name</label>
              <input
                className="border p-2 rounded w-full"
                type="text"
                value={actualUsername}
                onChange={(e) => setActualUsername(e.target.value)}
              />
            </div>
            {modalType === "add" && (
              <div>
                <label className="text-sm mb-1 block">Password</label>
                <input
                  className="border p-2 rounded w-full"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="default" onPress={onOpenChange}>
            Cancel
          </Button>
          <Button
            color="secondary"
            onPress={modalType === "add" ? submitAddUser : submitEditUser}
          >
            {modalType === "add" ? "Add" : "Update"}
          </Button>
        </ModalFooter>
      </>
    );
  };

  return (
    <div className="p-5 min-h-screen bg-inheirt">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <Button color="secondary" onPress={handleAddUser}>
          + Add User
        </Button>
      </div>

      <div className="rounded shadow p-4">
        <AdminTable users={users} onEditUser={handleEditUser} onDeleteUser={handleDeleteUser} />
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="z-[999]">
        <ModalContent>{renderModalBody()}</ModalContent>
      </Modal>
    </div>
  );
}