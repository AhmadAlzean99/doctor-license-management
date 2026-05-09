'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DEFAULT_ROLE, isRole, rolePermissions, type Permissions, type Role } from '@/lib/role';

const STORAGE_KEY = 'doclicense.role';

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
  permissions: Permissions;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(DEFAULT_ROLE);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isRole(stored)) {
        setRoleState(stored);
      }
    } catch {
      // localStorage unavailable — keep default
    }
  }, []);

  function setRole(newRole: Role) {
    setRoleState(newRole);
    try {
      localStorage.setItem(STORAGE_KEY, newRole);
    } catch {
      // localStorage unavailable — role persists in memory only
    }
  }

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        permissions: rolePermissions[role],
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
}

export function usePermissions(): Permissions {
  return useRole().permissions;
}
