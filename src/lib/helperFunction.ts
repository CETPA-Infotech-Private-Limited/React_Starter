export const setSessionItem = (key: string, value: any) => {
  const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
  sessionStorage.setItem(key, valueToStore);
};

export const findEmployeeDetails = (employees: any, empCode: string) => {
  const employee = employees.find((emp) => emp?.empCode === empCode);
  if (employee) {
    return {
      employee,
    };
  } else {
    return null;
  }
};

export function getObjectFromSessionStorage(key) {
  const item = sessionStorage.getItem(key);
  if (item) {
    try {
      return JSON.parse(item);
    } catch (e) {
      console.error('Error parsing JSON from sessionStorage:', e);
      return null;
    }
  }
  return null;
}

export function clearAllStorage(): void {
  localStorage.clear();
  sessionStorage.clear();
  const cookies: string[] = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name] = cookie.split('=');
    document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}
