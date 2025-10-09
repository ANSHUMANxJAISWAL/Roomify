import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Types for our API responses
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  error?: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Handle successful responses with messages
    if (response.data?.message) {
      toast.success(response.data.message, { autoClose: 3000 });
    }
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    const errorMessage = error.response?.data?.error ||
                        error.response?.data?.message ||
                        error.message ||
                        'An error occurred';

    // Don't show error toast for 404 (handled by UI)
    if (error.response?.status !== 404) {
      toast.error(errorMessage, { autoClose: 5000 });
    }

    return Promise.reject(error);
  }
);

// Dashboard API
export const dashboardAPI = {
  getDashboardStats: () => api.get('/dashboard/stats'),
  getExpenses: (params: any) => api.get('/expenses', { params }),
  getChores: (params: any) => api.get('/chores', { params }),
  getReminders: (params: any) => api.get('/reminders', { params }),
  getNotifications: () => api.get('/notifications'),
  getHouseholds: () => api.get('/households'),
};

// Chore API
export const choreAPI = {
  createChore: (choreData: any) => api.post('/chores', choreData),
  getChoreById: (id: string) => api.get(`/chores/${id}`),
  getChoresByHousehold: (householdId: string) => api.get(`/chores/household/${householdId}`),
  getChoresByUser: (userId: string) => api.get(`/chores/user/${userId}`),
  updateChore: (id: string, choreData: any) => api.put(`/chores/${id}`, choreData),
  deleteChore: (id: string) => api.delete(`/chores/${id}`),
  assignChore: (choreId: string, userId: string) => api.post(`/chores/${choreId}/assign/${userId}`),
  completeChore: (id: string) => api.post(`/chores/${id}/complete`),
  updateChoreStatus: (id: string, status: string) => api.patch(`/chores/${id}/status`, { status }),
};

// Expense API
export const expenseAPI = {
  createExpense: (expenseData: any) => api.post('/expenses', expenseData),
  getExpenseById: (id: string) => api.get(`/expenses/${id}`),
  getExpensesByHousehold: (householdId: string) => api.get(`/expenses/household/${householdId}`),
  getExpensesByUser: (userId: string) => api.get(`/expenses/user/${userId}`),
  updateExpense: (id: string, expenseData: any) => api.put(`/expenses/${id}`, expenseData),
  deleteExpense: (id: string) => api.delete(`/expenses/${id}`),
  markAsPaid: (expenseId: string, paidById: string) => api.post(`/expenses/${expenseId}/mark-paid/${paidById}`),
  updateExpenseStatus: (id: string, status: string) => api.patch(`/expenses/${id}/status`, { status }),
};

// Reminder API
export const reminderAPI = {
  createReminder: (reminderData: any) => api.post('/reminders', reminderData),
  getReminderById: (id: string) => api.get(`/reminders/${id}`),
  getRemindersByHousehold: (householdId: string) => api.get(`/reminders/household/${householdId}`),
  getRemindersByUser: (userId: string) => api.get(`/reminders/user/${userId}`),
  updateReminder: (id: string, reminderData: any) => api.put(`/reminders/${id}`, reminderData),
  deleteReminder: (id: string) => api.delete(`/reminders/${id}`),
  markAsCompleted: (id: string) => api.post(`/reminders/${id}/complete`),
  updateReminderStatus: (id: string, status: string) => api.patch(`/reminders/${id}/status`, { status }),
};

// Household API
export const householdAPI = {
  createHousehold: (householdData: any) => api.post('/households', householdData),
  getHouseholdById: (id: string) => api.get(`/households/${id}`),
  updateHousehold: (id: string, householdData: any) => api.put(`/households/${id}`, householdData),
  deleteHousehold: (id: string) => api.delete(`/households/${id}`),
  addMember: (householdId: string, memberData: any) => api.post(`/households/${householdId}/members`, memberData),
  removeMember: (householdId: string, memberId: string) => api.delete(`/households/${householdId}/members/${memberId}`),
};

// Notification API
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  deleteNotification: (id: string) => api.delete(`/notifications/${id}`),
};

export default api;

