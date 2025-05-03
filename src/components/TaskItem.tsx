// src/components/TaskItem.tsx
import React from 'react';
import { Task } from '../types';
import { useTaskContext } from '../context/TaskContext';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Card from './ui/Card';
import { Calendar, Clock, Edit, Star, Trash2, User as UserIcon, UserCog } from 'lucide-react';
// react-hot-toast importu kaldırıldı

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  // isLoading state'ini context'ten alıyoruz
  const { deleteTask, isLoading, addToDaily, removeFromDaily } = useTaskContext();

  // --- Yardımcı Fonksiyonlar ---
  const getStatusColor = (status: string): 'warning' | 'primary' | 'success' | 'default' => {
    const lowerStatus = status?.toLowerCase();
    if (lowerStatus === "pending") return 'warning';
    if (lowerStatus === "inprogress") return 'primary';
    if (lowerStatus === "completed") return 'success';
    return 'default'; 
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) { return 'Geçersiz Tarih'; }
      return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return 'Hatalı Tarih';
    }
  };

  const formatDateTime = (dateString: string | null): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
       if (isNaN(date.getTime())) { return 'Geçersiz Tarih'; }
      return date.toLocaleString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
       console.error("Error formatting datetime:", dateString, e);
       return 'Hatalı Tarih';
    }
  };

  const handleDeleteTask = async () => {
    if (isLoading) return;

    if (window.confirm(`'${task.title}' görevini silmek istediğinizden emin misiniz?`)) {
      await deleteTask(task.id);
      console.log(`Delete task ${task.id} attempted.`); 
    }
  };

  const toggleDaily = async () => {
    if (isLoading) return;

    const currentIsDaily = task.isDaily; // Mevcut durumu al
    const action = currentIsDaily ? removeFromDaily : addToDaily; 
    await action(task.id);
    console.log(`Toggle daily for task ${task.id} attempted (currently ${currentIsDaily}).`); // Konsola log
  };

  // --- JSX ---
  return (
    <Card className="mb-4 transition-all hover:shadow-md" padding="lg">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Görev Detayları */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <h3 className="text-lg font-semibold mr-2 truncate" title={task.title}>{task.title}</h3>
            <Badge variant={getStatusColor(task.status)} className="flex-shrink-0">{task.status || 'Durum Yok'}</Badge>
          </div>
          <p className="text-gray-600 mb-3 text-sm break-words">{task.description || 'Açıklama yok'}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-500">
            <div className="flex items-center" title="Oluşturan"><UserCog size={14} className="mr-1.5 flex-shrink-0 text-gray-400" /><span className="truncate">{task.createdByUserName || 'Bilinmiyor'}</span></div>
            <div className="flex items-center" title="Atanan"><UserIcon size={14} className="mr-1.5 flex-shrink-0 text-gray-400" /><span className="truncate">{task.assignedUserName || 'Atanmamış'}</span></div>
            <div className="flex items-center" title="Oluşturulma Tarihi"><Clock size={14} className="mr-1.5 flex-shrink-0 text-gray-400" /><span>{formatDateTime(task.createdAt)}</span></div>
            <div className="flex items-center" title="Bitiş Tarihi"><Calendar size={14} className="mr-1.5 flex-shrink-0 text-gray-400" /><span>{formatDate(task.dueDate)}</span></div>
            {task.updatedAt && (
              <div className="flex items-center col-span-1 sm:col-span-2" title="Son Güncelleme">
                <Edit size={14} className="mr-1.5 flex-shrink-0 text-blue-500"/>
                <span>{formatDateTime(task.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-2 mt-4 md:mt-0 flex-shrink-0">
          {/* Günlük Görev Butonu */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDaily}
            title={task.isDaily ? "Günlük görevlerden çıkar" : "Günlük görevlere ekle"}
            disabled={isLoading} // isLoading durumuna göre disable et
            className="w-full sm:w-auto justify-center flex items-center"
          >
            <Star size={16} className={`transition-colors ${task.isDaily ? "text-amber-500 fill-current" : "text-gray-400 hover:text-amber-400"}`} />
            <span className="sm:hidden ml-2">{task.isDaily ? "Günlükten Çıkar" : "Günlüğe Ekle"}</span>
          </Button>

          {/* Düzenle Butonu */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(task)} // onEdit prop'unu çağır
            title="Görevi düzenle"
            disabled={isLoading}
            className="w-full sm:w-auto justify-center flex items-center"
          >
            <Edit size={16} />
            <span className="sm:hidden ml-2">Düzenle</span>
          </Button>

          {/* Sil Butonu */}
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteTask}
            title="Görevi sil"
            disabled={isLoading}
            className="w-full sm:w-auto justify-center flex items-center"
          >
            <Trash2 size={16} />
            <span className="sm:hidden ml-2">Sil</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskItem;