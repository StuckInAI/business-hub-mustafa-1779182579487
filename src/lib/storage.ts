const STORAGE_KEY = 'ats_app_state';

export function loadState<T>(defaultValue: T): T {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return defaultValue;
    return JSON.parse(serialized) as T;
  } catch {
    return defaultValue;
  }
}

export function saveState<T>(state: T): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // ignore
  }
}
