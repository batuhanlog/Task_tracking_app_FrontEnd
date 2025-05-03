import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, CreateTaskPayload, UpdateTaskPayload } from '../types';
import { useTaskContext } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import Select, { SelectOption } from './ui/Select';
import Card from './ui/Card';

interface TaskFormProps {
  taskToEdit?: Task;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ taskToEdit, onClose }) => {
  const { addTask, updateTask, isLoading, error: contextError, refetchTasks } = useTaskContext(); // refetchTasks eklendi
  const { currentUser, userProjects, allUsers } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<number | string>('');
  const [status, setStatus] = useState<string>(TaskStatus.Pending);
  const [dueDate, setDueDate] = useState('');
  const [assignedUserId, setAssignedUserId] = useState<number | string>('');
  const [isDaily, setIsDaily] = useState<boolean>(false); // isDaily state'i eklendi
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!userProjects || userProjects.length === 0 || !allUsers || allUsers.length === 0) return;

    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setProjectId(taskToEdit.projectId);
      setStatus(taskToEdit.status);
  
      setDueDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '');
      setAssignedUserId(taskToEdit.assignedUserId);
      setIsDaily(taskToEdit.isDaily ?? false); 
    } else {
      setTitle('');
      setDescription(null);
      setProjectId(userProjects[0]?.id || ''); 
      setStatus(TaskStatus.Pending);
      setDueDate(new Date().toISOString().split('T')[0]); 
      setAssignedUserId(currentUser?.id || ''); 
      setIsDaily(false); 
    }
    setLocalError(null);
  }, [taskToEdit, currentUser?.id, userProjects, allUsers]); 

  
 
  const getIsoDateTime = (dateString: string): string | null => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      
      return `${dateString}T00:00:00Z`;
    } catch (e) {
      console.error("Invalid date string:", dateString);
      return null;
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Temel Doğrulamalar
    if (!title.trim() || !projectId || !assignedUserId || !dueDate || !status) {
      setLocalError('Lütfen tüm zorunlu (*) alanları doldurun.');
      return;
    }

    const isoDueDate = getIsoDateTime(dueDate);
    if (!isoDueDate) {
      setLocalError('Geçersiz bitiş tarihi formatı.');
      return;
    }

    let success = false;
    if (taskToEdit) {
      // --- Güncelleme Payload'ı ---
      const payload: UpdateTaskPayload = {
        title: title.trim(),
        description: description || null, 
        dueDate: isoDueDate,
        status: status,
        assignedUserId: Number(assignedUserId),
        projectId: projectId ? Number(projectId) : undefined, 
        isDaily: isDaily, 
      };
      console.log("Updating task with payload:", payload); // Log payload
      success = await updateTask(taskToEdit.id, payload);
    } else {
      // --- Oluşturma Payload'ı ---
      const payload: CreateTaskPayload = {
        title: title.trim(),
        description: description || null,
        dueDate: isoDueDate,
        projectId: Number(projectId),
        assignedUserId: Number(assignedUserId),
        status: status,
        isDaily: isDaily, // isDaily eklendi
      };
      console.log("Creating task with payload:", payload); // Log payload
      success = await addTask(payload);
    }

    if (success) {
      
      onClose(); 
    } else {
      
      setLocalError(contextError || "İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };


 
  if (!userProjects || userProjects.length === 0 || !allUsers || allUsers.length === 0) {
    return <p className="text-center py-4 text-gray-500">Form için gerekli veriler yükleniyor...</p>;
  }
  if(isLoading && !taskToEdit){ 
     return <p className="text-center py-4 text-gray-500">İşlem yapılıyor...</p>;
  }


  // Select Options
  const statusOptions: SelectOption[] = Object.values(TaskStatus).map(s => ({ value: s, label: s }));
  const userOptions: SelectOption[] = [
    { value: '', label: 'Kullanıcı Seçin...' },
    ...(allUsers || []).map(u => ({ value: u.id.toString(), label: u.name }))
  ];
  const projectOptions: SelectOption[] = [
    { value: '', label: 'Proje Seçin...' },
    ...(userProjects || []).map(p => ({ value: p.id.toString(), label: p.name }))
  ];

  return (
    <Card padding="lg">
      <h2 className="text-xl font-bold mb-6">{taskToEdit ? 'Görevi Düzenle' : 'Yeni Görev Ekle'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Başlık */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Başlık *</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
        </div>

        {/* Açıklama */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
          <textarea id="description" value={description ?? ''} onChange={(e) => setDescription(e.target.value)} rows={3} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>

        {/* Proje ve Durum */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select label="Proje *" options={projectOptions} value={projectId.toString()} onChange={(v) => setProjectId(v ? Number(v) : '')} required />
          </div>
          <div>
            <Select label="Durum *" options={statusOptions} value={status} onChange={(v) => setStatus(v)} required />
          </div>
        </div>

        {/* Bitiş Tarihi ve Atanan Kişi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi *</label>
            <input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
          </div>
          <div>
            <Select label="Atanan Kişi *" options={userOptions} value={assignedUserId.toString()} onChange={(v) => setAssignedUserId(v ? Number(v) : '')} required />
          </div>
        </div>

        {/* Günlük Görev Checkbox */}
        <div className="mt-4">
            {}
             <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={isDaily}
                    onChange={(e) => setIsDaily(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="text-sm text-gray-700">Günlük görev listesine ekle</span>
            </label>
        </div>


        {/* Hata Mesajı */}
        {(localError || contextError) && (
          <p className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
            {localError || contextError}
          </p>
        )}

        {/* Butonlar */}
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>İptal</Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Kaydediliyor...' : (taskToEdit ? 'Görevi Güncelle' : 'Görev Oluştur')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TaskForm;