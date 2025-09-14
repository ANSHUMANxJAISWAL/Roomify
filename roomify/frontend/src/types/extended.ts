import { User, Household, HouseholdMember, Reminder, Address, HouseholdMemberStatus } from './index';

// Extended User type with additional properties
export interface ExtendedUser extends Omit<User, 'email'> {
  bio?: string;
  phone?: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Extended HouseholdMember type with additional properties
export interface ExtendedHouseholdMember extends Omit<HouseholdMember, 'user' | 'role' | 'status' | 'joinedAt'> {
  user: ExtendedUser;
  role: 'ADMIN' | 'MEMBER' | 'GUEST';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | HouseholdMemberStatus;
  joinedAt: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
}

// Extended Household type with additional properties
export interface ExtendedHousehold extends Omit<Household, 'members' | 'address' | 'rules'> {
  members: ExtendedHouseholdMember[];
  rules: string[];
  address?: string | Address;
  name: string;
  description?: string;
}

// Extended Reminder type with dueTime
export interface ExtendedReminder extends Reminder {
  dueTime: string;
}
