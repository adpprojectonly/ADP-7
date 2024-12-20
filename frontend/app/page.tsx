"use client";
import { useAuth } from '@/context/auth-context';

const Home = () => {
  const { login, logout, isAuthenticated, role } = useAuth();

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Home Page</h1>
      {!isAuthenticated ? (
        <div>
          <button onClick={() => login('user')} className="px-4 py-2 bg-blue-500 text-white rounded">Login as User</button>
          <button onClick={() => login('admin')} className="px-4 py-2 bg-blue-500 text-white rounded ml-2">Login as Admin</button>
        </div>
      ) : (
        <div>
          <p>Welcome, {role}</p>
          <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
        </div>
      )}
    </div>
  );
};

export default Home;