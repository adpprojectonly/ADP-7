"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {useAuth} from '@/context/auth-context';
import { useEffect, useState } from 'react';
import axios from 'axios';


export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('organizationId');
    localStorage.removeItem('userid');
    logout();
  }

  
  const [organizationName, setOrganizationName] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userid');
    const token = localStorage.getItem('token');
    if (userId && token) {
      axios.get(`http://localhost:8080/organizations/${localStorage.getItem('organizationId')}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => setOrganizationName(response.data.name))
      .catch(error => console.error('Error fetching organization ID:', error));
    }
  }, []);

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold">{organizationName}</div>
      <nav className="flex flex-col p-4 space-y-2">
        <Link href="/dashboard" legacyBehavior>
          <a className={`p-2 rounded ${pathname === '/dashboard' ? 'bg-gray-700' : ''}`}>My Tasks</a>
        </Link>
        <Link href="/action" legacyBehavior>
          <a className={`p-2 rounded ${pathname === '/action' ? 'bg-gray-700' : ''}`}>Action</a>
        </Link>
        <Link href="/profile" legacyBehavior>
          <a className={`p-2 rounded ${pathname === '/profile' ? 'bg-gray-700' : ''}`}>Profile</a>
        </Link>

        <Link href="/">
          <button 
            onClick={handleLogOut} 
            className="p-2 rounded flex items-center space-x-2 hover:bg-gray-700"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M3 4a1 1 0 011-1h6a1 1 0 110 2H5v10h5a1 1 0 110 2H4a1 1 0 01-1-1V4zm10.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L14.586 13H9a1 1 0 110-2h5.586l-1.293-1.293a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
            <span>Logout</span>
          </button>
        </Link>
        
      </nav>
    </div>
  );
};
