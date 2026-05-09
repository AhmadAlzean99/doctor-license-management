export type Role = 'admin' | 'editor' | 'viewer';

export const DEFAULT_ROLE: Role = 'admin';

export const roleLabel: Record<Role, string> = {
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
};

export const roleDescription: Record<Role, string> = {
  admin: 'Full access',
  editor: 'Add and edit only',
  viewer: 'Read-only',
};

export interface Permissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canChangeStatus: boolean;
}

export const rolePermissions: Record<Role, Permissions> = {
  admin: {
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canChangeStatus: true,
  },
  editor: {
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canChangeStatus: false,
  },
  viewer: {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canChangeStatus: false,
  },
};

export function isRole(value: unknown): value is Role {
  return value === 'admin' || value === 'editor' || value === 'viewer';
}
