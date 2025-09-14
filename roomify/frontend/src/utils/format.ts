import { Address } from '../types';

export const formatAddress = (address: Address | string | null | undefined): string => {
  if (!address) return 'No address provided';
  if (typeof address === 'string') return address;
  
  const { street, city, state, zipCode, country } = address;
  const parts = [street, city, state, zipCode, country].filter(Boolean);
  return parts.join(', ');
};

export const formatHouseholdMemberName = (member: { user: { firstName?: string; lastName?: string } } | null | undefined): string => {
  if (!member?.user) return 'Unknown User';
  return [member.user.firstName, member.user.lastName].filter(Boolean).join(' ');
};

export const getMemberEmail = (member: { user: { email?: string } } | null | undefined): string => {
  return member?.user?.email || 'No email provided';
};

export const getMemberPhone = (member: { user: { phone?: string } } | null | undefined): string => {
  return member?.user?.phone || 'No phone provided';
};

import { HouseholdMember } from '../types';

export const getMemberJoinDate = (member: HouseholdMember | null | undefined): string => {
  return member?.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'Unknown';
};
