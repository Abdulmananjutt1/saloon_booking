import { UserRole } from '@prisma/client';
import prisma from '@/server/db';

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface UserWithPermissions {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
}

/**
 * Get all permissions for a user (role-based + custom permissions)
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      permissions: {
        include: {
          permission: true
        }
      }
    }
  });

  if (!user) {
    return [];
  }

  // Get role-based permissions
  const rolePermissions = await prisma.rolePermission.findMany({
    where: { role: user.role },
    include: { permission: true }
  });

  const rolePerms = rolePermissions.map(rp => rp.permission.name);
  
  // Get custom user permissions
  const userPerms = user.permissions.map(up => up.permission.name);

  // Combine and deduplicate
  return [...new Set([...rolePerms, ...userPerms])];
}

/**
 * Check if user has a specific permission
 */
export async function hasPermission(userId: string, permissionName: string): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  return permissions.includes(permissionName);
}

/**
 * Check if user has any of the specified permissions
 */
export async function hasAnyPermission(userId: string, permissionNames: string[]): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  return permissionNames.some(perm => permissions.includes(perm));
}

/**
 * Check if user has all of the specified permissions
 */
export async function hasAllPermissions(userId: string, permissionNames: string[]): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  return permissionNames.every(perm => permissions.includes(perm));
}

/**
 * Get all permissions for a role
 */
export async function getRolePermissions(role: UserRole): Promise<string[]> {
  const rolePermissions = await prisma.rolePermission.findMany({
    where: { role },
    include: { permission: true }
  });

  return rolePermissions.map(rp => rp.permission.name);
}

/**
 * Grant a custom permission to a user
 */
export async function grantPermission(
  userId: string, 
  permissionName: string, 
  grantedBy?: string
): Promise<void> {
  const permission = await prisma.permission.findUnique({
    where: { name: permissionName }
  });

  if (!permission) {
    throw new Error(`Permission ${permissionName} not found`);
  }

  await prisma.userPermission.upsert({
    where: {
      userId_permissionId: {
        userId,
        permissionId: permission.id
      }
    },
    create: {
      userId,
      permissionId: permission.id,
      grantedBy
    },
    update: {}
  });
}

/**
 * Revoke a custom permission from a user
 */
export async function revokePermission(userId: string, permissionName: string): Promise<void> {
  const permission = await prisma.permission.findUnique({
    where: { name: permissionName }
  });

  if (!permission) {
    return;
  }

  await prisma.userPermission.deleteMany({
    where: {
      userId,
      permissionId: permission.id
    }
  });
}

/**
 * Get all available permissions grouped by category
 */
export async function getAllPermissions(): Promise<Record<string, Permission[]>> {
  const permissions = await prisma.permission.findMany({
    orderBy: [{ category: 'asc' }, { name: 'asc' }]
  });

  return permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);
}

/**
 * Role hierarchy for fallback checks
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  SUPER_ADMIN: 5,
  ADMIN: 4,
  OPERATIONAL_ADMIN: 3,
  STYLIST_MANAGER: 2,
  DESK_ADMIN: 1,
  CLIENT: 0
};

/**
 * Check if user role is at least the specified role
 */
export function hasRoleLevel(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Get user role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    DESK_ADMIN: 'Desk Admin',
    OPERATIONAL_ADMIN: 'Operations Admin',
    STYLIST_MANAGER: 'Stylist Manager',
    CLIENT: 'Client'
  };
  return names[role];
}
