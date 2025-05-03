// src/context/TaskContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance'; // 
import { Task, FilterOptions, CreateTaskPayload, UpdateTaskPayload } from '../types';
import { useAuth } from './AuthContext';

interface TaskContextType {
    tasks: Task[];
    userTasks: Task[];
    dailyTasks: Task[];
    addTask: (newTaskData: CreateTaskPayload) => Promise<boolean>;
    updateTask: (taskId: number, updatedTaskData: UpdateTaskPayload) => Promise<boolean>;
    deleteTask: (taskId: number) => Promise<boolean>;
    addToDaily: (taskId: number) => Promise<boolean>; 
    removeFromDaily: (taskId: number) => Promise<boolean>; 
    filterOptions: FilterOptions;
    setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
    isLoading: boolean;
    error: string | null;
    refetchTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { currentUser, isAuthenticated } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        projectId: null, status: null, userId: null,
        dueDateStart: null, dueDateEnd: null,
        createdDateStart: null, createdDateEnd: null
    });

    const fetchTasks = useCallback(async () => {
        if (!isAuthenticated) { setTasks([]); setIsLoading(false); return; }
        setIsLoading(true); setError(null);
        const params: any = {}; // Partial<FilterOptions> 
        if (filterOptions.projectId) params.projectId = filterOptions.projectId;
        if (filterOptions.userId) params.userId = filterOptions.userId;
        if (filterOptions.status) params.status = filterOptions.status;
        if (filterOptions.dueDateStart) params.dueDateStart = filterOptions.dueDateStart;
        if (filterOptions.dueDateEnd) params.dueDateEnd = filterOptions.dueDateEnd;
        if (filterOptions.createdDateStart) params.createdDateStart = filterOptions.createdDateStart;
        if (filterOptions.createdDateEnd) params.createdDateEnd = filterOptions.createdDateEnd;

        try {
            console.log("Fetching tasks with params:", params); // Log params
            const response = await axiosInstance.get<Task[]>('/tasks', { params });
            console.log("Tasks fetched:", response.data); // Log response
            const tasksWithDaily = response.data.map(task => ({ ...task, isDaily: task.isDaily ?? false }));
            setTasks(tasksWithDaily);
        } catch (err: any) {
            console.error("Failed to fetch tasks:", err);
            if (err.response?.status !== 401) {
                 setError(`Görevler yüklenemedi: ${err.response?.data?.title || err.message}`);
            }
            setTasks([]); 
        } finally { setIsLoading(false); }
    }, [isAuthenticated, filterOptions]); 

    useEffect(() => { fetchTasks(); }, [fetchTasks]); 

    // --- IMPLEMENTED FUNCTIONS ---
    const addTask = async (newTaskData: CreateTaskPayload): Promise<boolean> => {
        setIsLoading(true); setError(null);
        try {
            console.log("Adding task with payload:", newTaskData);
            await axiosInstance.post('/tasks', newTaskData);
            await fetchTasks(); 
            setIsLoading(false);
            return true;
        } catch (err: any) {
            console.error("Failed to add task:", err);
            setError(`Görev eklenemedi: ${err.response?.data?.title || err.message}`);
            setIsLoading(false);
            return false;
        }
    };

    const updateTask = async (taskId: number, updatedTaskData: UpdateTaskPayload): Promise<boolean> => {
        setIsLoading(true); setError(null);
        try {
            console.log(`Updating task ${taskId} with payload:`, updatedTaskData);
            await axiosInstance.put(`/tasks/${taskId}`, updatedTaskData);
            await fetchTasks(); 
            setIsLoading(false);
            return true;
        } catch (err: any) {
            console.error(`Failed to update task ${taskId}:`, err);
            setError(`Görev güncellenemedi: ${err.response?.data?.title || err.message}`);
            setIsLoading(false);
            return false;
        }
    };

    const deleteTask = async (taskId: number): Promise<boolean> => {
        setIsLoading(true); setError(null);
        try {
            console.log(`Deleting task ${taskId}`);
            await axiosInstance.delete(`/tasks/${taskId}`);
            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            setIsLoading(false);
            return true;
        } catch (err: any) {
            console.error(`Failed to delete task ${taskId}:`, err);
            setError(`Görev silinemedi: ${err.response?.data?.title || err.message}`);
            setIsLoading(false);
            return false;
        }
    };

    const addToDaily = async (taskId: number): Promise<boolean> => {
        console.log(`Adding task ${taskId} to daily`);
        return updateTask(taskId, { isDaily: true });
    };

    const removeFromDaily = async (taskId: number): Promise<boolean> => {
        console.log(`Removing task ${taskId} from daily`);
        return updateTask(taskId, { isDaily: false });
    };
    // --- END IMPLEMENTED FUNCTIONS ---


    const userTasks = tasks.filter(task => task.assignedUserId === currentUser?.id);
    // isDaily durumunu kontrol et
    const dailyTasks = tasks.filter(task => task.isDaily === true);

    const value: TaskContextType = {
        tasks, userTasks, dailyTasks, addTask, updateTask, deleteTask,
        addToDaily, removeFromDaily, // Güncellenmiş fonksiyonlar
        filterOptions, setFilterOptions,
        isLoading, error, refetchTasks: fetchTasks
    };

    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = (): TaskContextType => {
    const context = useContext(TaskContext);
    if (context === undefined) { throw new Error('useTaskContext must be used within a TaskProvider'); }
    return context;
};