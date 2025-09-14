import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Types for our API responses
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  error?: string;
}

// Token response type
interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Extend Axios types to include our custom config
declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
  }
}

// Custom type for our API requests
type RoomifyApiRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for cookies, authorization headers with TLS
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const typedConfig = config as RoomifyApiRequestConfig;
    // Skip auth header for auth routes or when skipAuthRefresh is true
    if (typedConfig.skipAuthRefresh || typedConfig.url?.includes('/auth/')) {
      return config;
    }
    
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Create new headers with the token
      const headers = new AxiosHeaders(typedConfig.headers);
      headers.set('Authorization', `Bearer ${token}`);
      typedConfig.headers = headers;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Handle successful responses with messages
    if (response.data?.message) {
      toast.success(response.data.message, { autoClose: 3000 });
    }
    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    if (!error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    
    // Handle token refresh on 401 errors
    if (error.response?.status === 401 && !(originalRequest as RoomifyApiRequestConfig)._retry) {
      // Don't retry refresh token for auth routes
      if (originalRequest.url?.includes('/auth/')) {
        return Promise.reject(error);
      }
      
      (originalRequest as RoomifyApiRequestConfig)._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await api.post<TokenResponse>(
            '/auth/refresh',
            { refreshToken },
            { skipAuthRefresh: true } as any // Type assertion to bypass type checking
          );
          
          if (response.data?.accessToken && response.data?.refreshToken) {
            const { accessToken, refreshToken: newRefreshToken } = response.data;
            
            // Store new tokens
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            
            // Update the original request with new token
            const headers = new AxiosHeaders(originalRequest.headers);
            headers.set('Authorization', `Bearer ${accessToken}`);
            originalRequest.headers = headers;
            
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login?session=expired';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message || 
                        error.message || 
                        'An error occurred';
    
    // Don't show error toast for 401 (handled above) or 404 (handled by UI)
    if (error.response?.status !== 401 && error.response?.status !== 404) {
      toast.error(errorMessage, { autoClose: 5000 });
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string; rememberMe?: boolean }) =>
    api.post<{ 
      accessToken: string; 
      refreshToken: string;
      user: any;
    }>('/auth/login', credentials, { skipAuthRefresh: true }),
  
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }) => api.post<{ message: string; userId: string }>('/auth/register', userData, { skipAuthRefresh: true }),
  
  logout: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return api.post<{ message: string }>(
      '/auth/logout', 
      { refreshToken },
      { skipAuthRefresh: true }
    ).finally(() => {
      // Clear tokens regardless of API call success
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    });
  },
  
  refreshToken: (refreshToken: string) =>
    api.post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh', 
      { refreshToken },
      { skipAuthRefresh: true }
    ),
  
  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }, { skipAuthRefresh: true }),
  
  resetPassword: (token: string, newPassword: string) =>
    api.post<{ message: string }>(
      '/auth/reset-password', 
      { token, newPassword },
      { skipAuthRefresh: true }
    ),
  
  verifyEmail: (token: string) =>
    api.post<{ message: string }>(
      '/auth/verify-email', 
      { token },
      { skipAuthRefresh: true }
    )
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

