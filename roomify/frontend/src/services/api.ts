import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await api.post('/auth/refresh', null, {
            params: { refreshToken }
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string; rememberMe?: boolean }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }) => api.post('/auth/register', userData),
  
  logout: (refreshToken: string) =>
    api.post('/auth/logout', null, { params: { refreshToken } }),
  
  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', null, { params: { refreshToken } }),
};

// User API
export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  getUserById: (id: string) => api.get(`/users/${id}`),
  updateUser: (id: string, userData: any) => api.put(`/users/${id}`, userData),
  getAllUsers: () => api.get('/users'),
  updateProfile: (userData: any) => api.put('/users/profile', userData),
  changePassword: (currentPassword: string, newPassword: string) => 
    api.post('/users/change-password', { currentPassword, newPassword }),
};

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

