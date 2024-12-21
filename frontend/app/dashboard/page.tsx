"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import KanbanBoard from '@/components/custom/kanban-board';


export default function Home() {
  const [fetched, setFetched] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/user/get-profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log(result);
        setData(result);

        localStorage.setItem('userid', result.user.id);
        localStorage.setItem('organizationId', result.user.organization);
        
        if(result && result.user.role == "ADMIN"){
          router.push("/admin")
        }


      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!fetched) {
      setFetched(true);
    }
  }, [fetched]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.toString()}</p>;

  return (
    <div >
      <h1 className="text-2xl font-bold">My Tasks</h1>
        <KanbanBoard />
    </div>
  );
}