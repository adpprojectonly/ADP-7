"use client";
import './globals.css';
import { NextUIProvider } from '@nextui-org/react';
import Sidebar from '@/components/custom/Sidebar';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="dark">
        <NextUIProvider>
          <AuthProvider>
            <MainLayout>{children}</MainLayout>
          </AuthProvider>
        </NextUIProvider>
      </body>
    </html>
  );
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const shouldShowSidebar = isAuthenticated && role !== 'ADMIN';

  return (
    <div className="flex">
      {shouldShowSidebar && <Sidebar />}
      <div className="flex-grow p-5">
        {children}
      </div>
    </div>
  );
};

export default Layout;