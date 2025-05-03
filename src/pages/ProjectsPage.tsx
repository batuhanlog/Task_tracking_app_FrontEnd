import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTaskContext } from '../context/TaskContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FolderOpen, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectsPage: React.FC = () => {
  const { userProjects, isLoading: authLoading, error: authError } = useAuth();
  const taskContext = useTaskContext();
  const setFilterOptions = taskContext?.setFilterOptions;
  const tasksError = taskContext?.error;

  const handleSelectProject = (projectId: number) => {
    if (setFilterOptions) {
        setFilterOptions({ projectId: projectId, status: null, userId: null, dueDateStart: null, dueDateEnd: null });
    } else { console.error("setFilterOptions not available"); }
  };

  if (authLoading) {
      return <p className="text-center text-gray-500 py-10">Projeler yükleniyor...</p>;
  }

  const displayError = authError || tasksError;
  if (displayError) {
       return <p className="text-center text-red-500 py-10">Veriler yüklenirken hata oluştu: {displayError}</p>;
  }

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projeler</h1>
        <Link to="/tasks"><Button variant="primary" className="flex items-center"><Plus size={18} className="mr-1" /> Yeni Görev</Button></Link>
      </div>

      {userProjects && userProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start">
                <div className="mr-4 p-2 bg-blue-100 rounded-lg"><FolderOpen className="h-6 w-6 text-blue-600" /></div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">{project.name}</h2>
                  <p className="text-sm text-gray-500 mb-1">Müşteri: {project.customerName || 'Bilinmiyor'}</p>
                  <p className="text-sm text-gray-500 mb-4">{project.taskCount} görev</p>
                  <Link to="/tasks">
                    <Button variant="outline" size="sm" onClick={() => handleSelectProject(project.id)}>Görevleri Görüntüle</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10"><p className="text-gray-500">Gösterilecek proje bulunamadı.</p></div>
      )}
    </div>
  );
};

export default ProjectsPage;