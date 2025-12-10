const isBrowser = typeof window !== 'undefined';
const currentProtocol = isBrowser ? window.location.protocol : 'http:';
const currentHost = isBrowser ? window.location.host : 'localhost:5000';

export const API_URL = import.meta.env.VITE_API_URL || `${currentProtocol}//${currentHost}/api`;

const desiredWsProtocol = currentProtocol === 'https:' ? 'wss:' : 'ws:';
const envWs = import.meta.env.VITE_WS_URL;
let computedWs = `${desiredWsProtocol}//${currentHost}`;
if (envWs) {
  try {
    const url = new URL(envWs, `${currentProtocol}//${currentHost}`);
    url.protocol = desiredWsProtocol; // enforce secure WS on https pages
    computedWs = url.toString();
  } catch {
    computedWs = envWs.replace(/^ws:/, desiredWsProtocol).replace(/^http:/, desiredWsProtocol);
  }
}
export const WS_URL = computedWs;
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
