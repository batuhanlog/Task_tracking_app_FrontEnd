export interface User { id: number; name: string; email: string; }
export interface Customer { id: number; name: string; }
export interface Project { id: number; name: string; createdAt: string; customerId: number; customerName: string; }


export interface Project {
  id: number;
  name: string;
  createdAt: string;
  customerId: number;
  customerName: string;
  taskCount: number; // EKLENDİ
}

export enum TaskStatus {
  Pending = "Pending",
  InProgress = "InProgress",
  Completed = "Completed"
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  dueDate: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  projectId: number;
  projectName: string;
  assignedUserId: number;
  assignedUserName: string;
  createdByUserId: number;
  createdByUserName: string;
  isDaily: boolean; 
}

export interface FilterOptions {
  projectId: number | null;
  status: string | null;
  userId: number | null;
  dueDateStart: string | null;
  dueDateEnd: string | null;
  createdDateStart?: string | null;
  createdDateEnd?: string | null;
}

export interface CreateTaskPayload {
    title: string;
    description: string | null;
    dueDate: string;
    projectId: number;
    assignedUserId: number;
    status: string;
    isDaily: boolean;
   
}


export interface UpdateTaskPayload {
    title?: string | null;
    description?: string | null;
    dueDate?: string | null;
    status?: string | null;
    assignedUserId?: number | null;
    projectId?: number | null;
    isDaily?: boolean | null;
}


export interface CreateCustomerPayload { name: string; }
export interface CreateProjectPayload { name: string; customerId: number; }
export interface CreateUserPayload { name: string; email: string; }