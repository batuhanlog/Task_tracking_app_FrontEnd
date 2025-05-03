import React, { useState } from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

interface TaskListProps {
  tasks: Task[];
  title: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, title }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };
  
  const handleCloseForm = () => {
    setEditingTask(null);
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{title} ({tasks.length})</h2>
      
      {editingTask && (
        <div className="mb-6">
          <TaskForm 
            taskToEdit={editingTask} 
            onClose={handleCloseForm} 
          />
        </div>
      )}
      
      {tasks.length === 0 ? (
        <p className="text-gray-500 italic p-4 text-center">No tasks available</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onEdit={handleEdit} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;