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
export const extractUniqueUnits = (employees) => {
  // Create a Map to track unique units by unitId
  const uniqueUnitsMap = new Map();

  // Process each employee
  employees.forEach((employee) => {
    // Only add if both unitId and unitName exist
    if (employee.unitId && employee.unitName) {
      uniqueUnitsMap.set(employee.unitId, {
        unitId: employee.unitId,
        unitName: employee.unitName?.trim(),
      });
    }
  });

  // Convert Map values to array
  return Array.from(uniqueUnitsMap.values());
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
    document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

export const formatRupees = (amount: number | null | undefined): string => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '-';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};
