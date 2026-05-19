/**
 * Shared activity log utility — persists to localStorage.
 * Each entry: { id, title, type, meta, time, href }
 */

const STORAGE_KEY = 'nexusai_activity';
const MAX_ITEMS = 20;

export function getActivity() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addActivity(entry) {
  const existing = getActivity();
  const newEntry = {
    id: Math.random().toString(36).substr(2, 9),
    ...entry,
    time: new Date().toISOString(),
  };
  const updated = [newEntry, ...existing].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function formatRelativeTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}
