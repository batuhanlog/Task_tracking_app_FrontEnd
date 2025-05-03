// src/components/TaskFilter.tsx
import React from 'react';
import { TaskStatus } from '../types';
import { useTaskContext } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import Select, { SelectOption } from './ui/Select';
import Card from './ui/Card';
import { Filter, X } from 'lucide-react';

const TaskFilter: React.FC = () => {
  const { filterOptions, setFilterOptions } = useTaskContext();
  const { userProjects, allUsers } = useAuth();

  const handleProjectChange = (value: string) => {
    setFilterOptions(currentFilters => ({ ...currentFilters, projectId: value ? Number(value) : null }));
  };
  const handleStatusChange = (value: string) => {
    setFilterOptions(currentFilters => ({ ...currentFilters, status: value || null }));
  };
  const handleUserIdChange = (value: string) => {
    setFilterOptions(currentFilters => ({ ...currentFilters, userId: value ? Number(value) : null }));
  };
  const handleDueDateStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions(currentFilters => ({ ...currentFilters, dueDateStart: e.target.value || null }));
  };
  const handleDueDateEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions(currentFilters => ({ ...currentFilters, dueDateEnd: e.target.value || null }));
  };
  const clearFilters = () => {
    setFilterOptions({ projectId: null, status: null, userId: null, dueDateStart: null, dueDateEnd: null });
  };

  const hasActiveFilters =
    filterOptions.projectId !== null ||
    filterOptions.status !== null ||
    filterOptions.userId !== null ||
    filterOptions.dueDateStart !== null ||
    filterOptions.dueDateEnd !== null;

  const statusOptions: SelectOption[] = Object.keys(TaskStatus)
      .filter((key) => isNaN(Number(key)))
      .map((statusKey) => {
          const statusValue = TaskStatus[statusKey as keyof typeof TaskStatus];
          return { value: statusValue, label: statusValue };
       });

  const userOptions: SelectOption[] = [
        { value: '', label: 'Tüm Kullanıcılar' },
        ...(allUsers || []).map(user => ({ value: user.id.toString(), label: user.name }))
   ];
   const projectOptions: SelectOption[] = [
        { value: '', label: 'Tüm Projeler' },
        ...(userProjects || []).map((project) => ({ value: project.id.toString(), label: project.name }))
   ];

  return (
    <Card className="mb-6">
      <div className="flex items-center mb-3"><Filter size={18} className="mr-2 text-gray-600" /><h2 className="text-lg font-semibold">Filtrele</h2></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div><Select label="Proje" options={projectOptions} value={filterOptions.projectId?.toString() || ''} onChange={handleProjectChange}/></div>
        <div><Select label="Durum" options={[ { value: '', label: 'Tüm Durumlar' }, ...statusOptions]} value={filterOptions.status || ''} onChange={handleStatusChange}/></div>
        <div><Select label="Atanan Kullanıcı" options={userOptions} value={filterOptions.userId?.toString() || ''} onChange={handleUserIdChange}/></div>
        <div><label htmlFor="dueDateStart" className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi (Başlangıç)</label><input id="dueDateStart" type="date" value={filterOptions.dueDateStart || ''} onChange={handleDueDateStartChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/></div>
        <div><label htmlFor="dueDateEnd" className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi (Bitiş)</label><input id="dueDateEnd" type="date" value={filterOptions.dueDateEnd || ''} onChange={handleDueDateEndChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/></div>
      </div>
      {hasActiveFilters && (<div className="mt-4 flex justify-end"><Button variant="outline" size="sm" onClick={clearFilters} className="flex items-center"><X size={16} className="mr-1" /> Filtreleri Temizle</Button></div>)}
    </Card>
  );
};

export default TaskFilter;