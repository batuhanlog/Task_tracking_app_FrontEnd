import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import TaskFilter from '../components/TaskFilter';
import Button from '../components/ui/Button';
import { Plus, ListChecks, User as UserIcon, Star } from 'lucide-react';

const TasksPage: React.FC = () => {
  const context = useTaskContext();

  if (!context) {
      return <p className="text-center text-gray-500 py-10">Görev context yükleniyor...</p>;
  }

  const { tasks, userTasks, dailyTasks, isLoading, error, refetchTasks } = context;
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'daily'>('all');

  const toggleForm = () => setShowForm(!showForm);

  const safeTasks = tasks || [];
  const safeUserTasks = userTasks || [];
  const safeDailyTasks = dailyTasks || [];

  const tasksToDisplay =
      activeTab === 'my' ? safeUserTasks :
      activeTab === 'daily' ? safeDailyTasks :
      safeTasks;

  const currentTitle =
      activeTab === 'my' ? "Görevlerim" :
      activeTab === 'daily' ? "Günlük Görevlerim" :
      "Tüm Görevler";

  return (
    <div className="py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Görev Yönetimi</h1>
        <Button variant="primary" onClick={toggleForm} className="flex items-center">
          <Plus size={18} className="mr-1" /> {showForm ? 'Formu Gizle' : 'Yeni Görev'}
        </Button>
      </div>

      {showForm && (<div className="mb-6"><TaskForm onClose={() => setShowForm(false)} /></div>)}

      <TaskFilter />

      {error && ( <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded"> Hata: {error} <Button variant="outline" size="sm" onClick={refetchTasks} className="ml-4">Tekrar Dene</Button> </div> )}

      <div className="flex border-b mb-6">
        <button
          className={`py-3 px-4 border-b-2 font-medium text-sm flex items-center ${ activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('all')}
        >
          <ListChecks size={18} className="mr-2" /> Tüm Görevler ({safeTasks.length})
        </button>
        <button
          className={`py-3 px-4 border-b-2 font-medium text-sm flex items-center ${ activeTab === 'my' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('my')}
        >
          <UserIcon size={18} className="mr-2" /> Görevlerim ({safeUserTasks.length})
        </button>
        <button
          className={`py-3 px-4 border-b-2 font-medium text-sm flex items-center ${ activeTab === 'daily' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          onClick={() => setActiveTab('daily')}
        >
          <Star size={18} className="mr-2" /> Günlük Görevler ({safeDailyTasks.length})
        </button>
      </div>

        {isLoading && <p className="text-center text-gray-500 py-4">Görevler yükleniyor...</p>}
        {!isLoading && !error && <TaskList tasks={tasksToDisplay} title={currentTitle} />}
        {!isLoading && !error && tasksToDisplay.length === 0 && (
             <p className="text-gray-500 italic p-4 text-center">
                 {activeTab === 'my' ? 'Size atanmış görev bulunamadı.' :
                  activeTab === 'daily' ? 'Günlük görev listeniz boş.' :
                  'Gösterilecek görev bulunamadı.'}
             </p>
        )}
    </div>
  );
};

export default TasksPage;