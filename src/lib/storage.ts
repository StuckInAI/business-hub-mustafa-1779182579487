const STORAGE_KEY = 'ats_app_data';

export function loadData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return (parsed[key] !== undefined ? parsed[key] : fallback) as T;
  } catch {
    return fallback;
  }
}

export function saveData<T>(key: string, value: T): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[key] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // ignore
  }
}
