export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
export const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE || '/curbadmin0270';

export const SKILL_CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Tools',
  'Soft Skills'
];

export const SERVICE_ICONS = [
  'code',
  'palette',
  'smartphone',
  'server',
  'database',
  'cloud',
  'shield',
  'zap',
  'globe',
  'cpu'
];

export const BLOG_STATUSES = {
  DRAFT: 'draft',
  PUBLISHED: 'published'
};

export const MESSAGE_STATUS = {
  UNREAD: 'unread',
  READ: 'read'
};