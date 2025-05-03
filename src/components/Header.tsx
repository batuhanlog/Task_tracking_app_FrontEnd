import React from 'react';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import { CheckCircle, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">Görev Takip</h1>
          </div>
          
          {currentUser && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Hoş geldin, <span className="font-medium">{currentUser.name}</span>
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={logout}
                className="flex items-center"
              >
                <LogOut size={16} className="mr-1" />
                Çıkış Yap
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;