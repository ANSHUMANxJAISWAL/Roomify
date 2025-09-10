// User related types
export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  phone?: string
  dateOfBirth?: string
  roles: UserRole[]
  status: UserStatus
  emailVerified: boolean
  phoneVerified: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  HOUSEHOLD_ADMIN = 'HOUSEHOLD_ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  LOCKED = 'LOCKED',
  EXPIRED = 'EXPIRED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION'
}

// Household related types
export interface Household {
  id: string
  name: string
  description?: string
  address: Address
  inviteCode: string
  maxMembers: number
  status: HouseholdStatus
  createdAt: string
  updatedAt: string
  members: HouseholdMember[]
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface HouseholdMember {
  id: string
  user: User
  role: HouseholdMemberRole
  joinedAt: string
  status: HouseholdMemberStatus
}

export enum HouseholdMemberRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST'
}

export enum HouseholdMemberStatus {
  ACTIVE = 'ACTIVE',
  INVITED = 'INVITED',
  LEFT = 'LEFT',
  REMOVED = 'REMOVED'
}

export enum HouseholdStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  ARCHIVED = 'ARCHIVED'
}

// Expense related types
export interface Expense {
  id: string
  title: string
  description?: string
  amount: number
  currency: string
  date: string
  category: ExpenseCategory
  status: ExpenseStatus
  paidBy: User
  household: Household
  receiptUrl?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  splits: ExpenseSplit[]
}

export interface ExpenseSplit {
  id: string
  user: User
  amount: number
  percentage: number
  status: ExpenseSplitStatus
}

export enum ExpenseCategory {
  FOOD = 'FOOD',
  UTILITIES = 'UTILITIES',
  RENT = 'RENT',
  INTERNET = 'INTERNET',
  ELECTRICITY = 'ELECTRICITY',
  WATER = 'WATER',
  GAS = 'GAS',
  CLEANING = 'CLEANING',
  MAINTENANCE = 'MAINTENANCE',
  ENTERTAINMENT = 'ENTERTAINMENT',
  TRANSPORTATION = 'TRANSPORTATION',
  OTHER = 'OTHER'
}

export enum ExpenseStatus {
  PENDING = 'PENDING',
  SETTLED = 'SETTLED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED'
}

export enum ExpenseSplitStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE'
}

// Chore related types
export interface Chore {
  id: string
  title: string
  description?: string
  assignedTo: User
  dueDate: string
  status: ChoreStatus
  priority: ChorePriority
  frequency: ChoreFrequency
  household: Household
  tags: string[]
  createdAt: string
  updatedAt: string
  completedAt?: string
  assignedBy: User
}

export enum ChoreStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  POSTPONED = 'POSTPONED',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE'
}

export enum ChorePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum ChoreFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  ONE_TIME = 'ONE_TIME'
}

// Reminder related types
export interface Reminder {
  id: string
  title: string
  description?: string
  type: ReminderType
  dueDate: string
  priority: ReminderPriority
  status: ReminderStatus
  assignedTo: User
  amount?: number
  category?: ExpenseCategory
  recurrence?: ReminderRecurrence
  tone: ReminderTone
  isAI: boolean
  user: User
  household?: Household
  tags: string[]
  createdAt: string
  updatedAt: string
}

export enum ReminderType {
  EXPENSE = 'EXPENSE',
  CHORE = 'CHORE',
  BILL = 'BILL',
  APPOINTMENT = 'APPOINTMENT',
  CUSTOM = 'CUSTOM',
  HOUSEHOLD = 'HOUSEHOLD',
  PERSONAL = 'PERSONAL'
}

export enum ReminderPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum ReminderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  DISMISSED = 'DISMISSED',
  SNOOZED = 'SNOOZED',
  OVERDUE = 'OVERDUE'
}

export enum ReminderTone {
  FRIENDLY = 'FRIENDLY',
  PROFESSIONAL = 'PROFESSIONAL',
  CASUAL = 'CASUAL',
  URGENT = 'URGENT'
}

export interface ReminderRecurrence {
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  interval: number
  endDate?: string
  maxOccurrences?: number
}

// Notification related types
export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  readAt?: string
  actionUrl?: string
  user: User
  household?: Household
  createdAt: string
}

export enum NotificationType {
  EXPENSE_ADDED = 'EXPENSE_ADDED',
  EXPENSE_SETTLED = 'EXPENSE_SETTLED',
  CHORE_ASSIGNED = 'CHORE_ASSIGNED',
  CHORE_COMPLETED = 'CHORE_COMPLETED',
  REMINDER_DUE = 'REMINDER_DUE',
  HOUSEHOLD_INVITE = 'HOUSEHOLD_INVITE',
  PAYMENT_DUE = 'PAYMENT_DUE',
  SYSTEM_UPDATE = 'SYSTEM_UPDATE'
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

// Form types
export interface LoginForm {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  acceptTerms: boolean
}

export interface ExpenseForm {
  title: string
  description?: string
  amount: number
  currency: string
  date: string
  category: ExpenseCategory
  paidBy: string
  householdId: string
  tags: string[]
  splits: ExpenseSplitForm[]
}

export interface ExpenseSplitForm {
  userId: string
  amount: number
  percentage: number
}

export interface ChoreForm {
  title: string
  description?: string
  assignedTo: string
  dueDate: string
  priority: ChorePriority
  frequency: ChoreFrequency
  householdId: string
  tags: string[]
}

export interface ReminderForm {
  title: string
  description?: string
  type: ReminderType
  dueDate: string
  priority: ReminderPriority
  assignedTo: string
  amount?: number
  category?: ExpenseCategory
  recurrence?: ReminderRecurrence
  tone: ReminderTone
  householdId?: string
  tags: string[]
}

// Dashboard types
export interface DashboardStats {
  totalExpenses: number
  totalChores: number
  totalReminders: number
  pendingPayments: number
  overdueChores: number
  upcomingReminders: number
}

export interface ExpenseAnalytics {
  monthlyTotal: number
  categoryBreakdown: CategoryBreakdown[]
  roommateContributions: RoommateContribution[]
}

export interface CategoryBreakdown {
  category: ExpenseCategory
  amount: number
  percentage: number
  count: number
}

export interface RoommateContribution {
  user: User
  totalPaid: number
  totalOwed: number
  balance: number
}

export interface ChoreAnalytics {
  completionRate: number
  overdueCount: number
  priorityDistribution: PriorityDistribution[]
  roommatePerformance: RoommatePerformance[]
}

export interface PriorityDistribution {
  priority: ChorePriority
  count: number
  percentage: number
}

export interface RoommatePerformance {
  user: User
  completedCount: number
  overdueCount: number
  completionRate: number
}

