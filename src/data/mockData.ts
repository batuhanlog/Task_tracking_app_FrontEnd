import { Customer, Project, User, Task, TaskStatus } from '../types'; // ProjectUser kaldırıldı

export const customers: Customer[] = [
  { id: 1, name: "ASELSAN" },
  { id: 2, name: "AYDINLI" }
];

export const projects: Project[] = [
  { id: 1, name: "ASELSAN - Crm Projesi", customerId: 1, createdAt: new Date().toISOString(), customerName: "ASELSAN", taskCount: 0 },
  { id: 2, name: "AYDINLI - Crm Projesi", customerId: 2, createdAt: new Date().toISOString(), customerName: "AYDINLI", taskCount: 0 }
];


export const users: User[] = [
  { id: 1, name: "Ali Yılmaz", email: "ali.yilmaz@example.com" },
  { id: 2, name: "Ayşe Demir", email: "ayse.demir@example.com" }
];


export const projectUsers = [
  { projectId: 1, userId: 1 },
  { projectId: 1, userId: 2 },
  { projectId: 2, userId: 1 }
];

export const tasks: Task[] = [
  {
    id: 1, title: "Login Ekranı Tasarımı", description: "CRM projesi için login ekranı tasarlanacak.",
    dueDate: "2025-05-10T00:00:00Z", status: TaskStatus.InProgress, createdAt: "2025-05-03T01:53:23Z", updatedAt: null,
    projectId: 1, projectName: "ASELSAN - Crm Projesi", assignedUserId: 1, assignedUserName: "Ali Yılmaz",
    createdByUserId: 2, createdByUserName: "Ayşe Demir", isDaily: false
  },
  {
    id: 2, title: "Müşteri Listesi Filtreleme", description: "Liste filtrelenecek.",
    dueDate: "2025-05-19T00:00:00Z", status: TaskStatus.Completed, createdAt: "2025-04-30T02:26:04Z", updatedAt: "2025-05-03T04:49:02Z",
    projectId: 1, projectName: "ASELSAN - Crm Projesi", assignedUserId: 2, assignedUserName: "Ayşe Demir",
    createdByUserId: 1, createdByUserName: "Ali Yılmaz", isDaily: true
  },
  {
    id: 3, title: "Teklif Modülü Bug Fix", description: "KDV hesaplama hatası düzeltilecek.",
    dueDate: "2025-05-15T00:00:00Z", status: TaskStatus.Pending, createdAt: "2025-04-30T02:26:16Z", updatedAt: null,
    projectId: 2, projectName: "AYDINLI - Crm Projesi", assignedUserId: 1, assignedUserName: "Ali Yılmaz",
    createdByUserId: 1, createdByUserName: "Ali Yılmaz", isDaily: false
  }
];