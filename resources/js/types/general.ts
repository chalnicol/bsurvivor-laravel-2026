import { UserBase } from './auth';

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  total: number;
  to: number;
  per_page: number;
  path: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: Meta;
}

export interface NavItem {
  id: number;
  href: string;
  label: string;
  icon?: string;
}

export interface Tab<T> {
  // id: number;
  label: string;
  value: T;
}

export type FriendStatus = 'pending' | 'accepted' | 'blocked' | 'none';

export interface Friend {
  id: number;
  user_id: number;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  status: FriendStatus;
}

export type NotificationType = 'verification' | 'order';

export interface Notification {
  id: string;
  title: number;
  message: string;
  isRead: boolean;
  url: string;
  date: string;
  type: NotificationType;
  sender: UserBase;
}

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

export interface OptionDetails {
  // id: number;
  label: string;
  callback: () => void;
}

export type ToastType = 'success' | 'error' | 'status';
