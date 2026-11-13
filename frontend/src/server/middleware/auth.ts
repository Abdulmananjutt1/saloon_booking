// ─────────────────────────────────────────────────────────
//  Auth middleware helpers for Next.js API routes with RBAC
// ─────────────────────────────────────────────────────────

import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { JWT_SECRET } from "../lib/config";
import { getUserPermissions, hasRoleLevel } from "@/lib/rbac";

export interface AuthUser {
  userId: string;
  role: UserRole;
}

/**
 * Extracts and verifies the JWT from the Authorization header.
 * Returns the decoded user payload or null if invalid/missing.
 */
export function getAuthUser(req: NextRequest): AuthUser | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Returns true if the user is authenticated.
 */
export function isAuthenticated(req: NextRequest): boolean {
  return getAuthUser(req) !== null;
}

/**
 * Returns true if the user is an admin (any admin role).
 */
export function isAdmin(req: NextRequest): boolean {
  const user = getAuthUser(req);
  if (!user) return false;
  
  return hasRoleLevel(user.role, UserRole.DESK_ADMIN);
}

/**
 * Returns true if the user is a super admin.
 */
export function isSuperAdmin(req: NextRequest): boolean {
  const user = getAuthUser(req);
  return user?.role === UserRole.SUPER_ADMIN;
}

/**
 * Check if user has a specific permission
 */
export async function hasPermission(req: NextRequest, permissionName: string): Promise<boolean> {
  const user = getAuthUser(req);
  if (!user) return false;

  const permissions = await getUserPermissions(user.userId);
  return permissions.includes(permissionName);
}

/**
 * Check if user has any of the specified permissions
 */
export async function hasAnyPermission(req: NextRequest, permissionNames: string[]): Promise<boolean> {
  const user = getAuthUser(req);
  if (!user) return false;

  const permissions = await getUserPermissions(user.userId);
  return permissionNames.some(perm => permissions.includes(perm));
}

/**
 * Check if user has all of the specified permissions
 */
export async function hasAllPermissions(req: NextRequest, permissionNames: string[]): Promise<boolean> {
  const user = getAuthUser(req);
  if (!user) return false;

  const permissions = await getUserPermissions(user.userId);
  return permissionNames.every(perm => permissions.includes(perm));
}

/**
 * Check if user has minimum role level
 */
export function hasMinRole(req: NextRequest, minRole: UserRole): boolean {
  const user = getAuthUser(req);
  if (!user) return false;

  return hasRoleLevel(user.role, minRole);
}

/**
 * Creates a 401 Unauthorized response.
 */
export function unauthorized(message = "Unauthorized. Token missing or invalid.") {
  return Response.json({ success: false, error: message }, { status: 401 });
}

/**
 * Creates a 403 Forbidden response.
 */
export function forbidden(message = "Forbidden. You don't have permission to access this resource.") {
  return Response.json({ success: false, error: message }, { status: 403 });
}
