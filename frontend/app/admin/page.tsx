import React from 'react';

const AdminDashboard: React.FC = () => {
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div>
                <h2>Users Management</h2>
                <button>Add User</button>
                <button>View Users</button>
            </div>
            <div>
                <h2>Settings</h2>
                <button>General Settings</button>
                <button>Security Settings</button>
            </div>
        </div>
    );
};

export default AdminDashboard;