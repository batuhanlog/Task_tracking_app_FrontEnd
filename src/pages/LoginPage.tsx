import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { users } from '../data/mockData'; 
import { CheckCircle, Plus } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const handleLogin = () => {
    if (selectedUser !== null) {
      login(selectedUser);
    }
  };

  return (
    // === Karanlık mod'a vakit kalırsa yapılacak ===
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          {}
          <CheckCircle className="h-12 w-12 text-blue-600" />
        </div>
        {/* Başlık ve paragraf renkleri düzeltildi */}
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Görev Takip
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Proje bazlı kişisel görev takip uygulaması
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        {}
        <Card className="px-4 py-8 sm:px-10">
          <div className="space-y-6">
            <div>
              {}
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Kullanıcı Seçin
              </label>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedUser === user.id
                        ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg'
                        : 'border-gray-300 hover:bg-gray-50 hover:scale-105'
                    }`}
                    onClick={() => setSelectedUser(user.id)}
                  >
                    <img
                      src={user.id === 1
                        ? "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
                        : "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"}
                      alt={user.name}
                      
                      className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-white shadow-md"
                    />
                    {}
                    <div className="font-medium text-gray-900 text-center">{user.name}</div>
                  </div>
                ))}
                {}
                <div className="flex flex-col items-center p-4 border border-dashed rounded-lg opacity-50 cursor-not-allowed border-gray-300">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-3 border-2 border-white shadow-md">
                    <Plus size={40} className="text-gray-400" />
                  </div>
                  <div className="font-medium text-gray-400 text-center">Kullanıcı Ekle</div>
                </div>
              </div>
            </div>

            <div>
              <Button
                variant="primary"
                fullWidth
                onClick={handleLogin}
                disabled={selectedUser === null || isLoading}
                className="mt-6"
              >
                {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </Button>
            </div>

            {}
            <div className="text-sm text-center text-gray-600">
              <p>Devam etmek için bir kullanıcı seçin.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
    // ===========================================
  );
};

export default LoginPage;