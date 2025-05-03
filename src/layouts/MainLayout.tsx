import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';

const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="bg-white mt-12 py-6 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Görev Takip &copy; {new Date().getFullYear()} - Proje bazlı görev yönetimi
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;