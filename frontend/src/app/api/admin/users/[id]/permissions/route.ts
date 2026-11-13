import { NextRequest } from "next/server";
import { UserRole } from "@prisma/client";
import prisma from "@/server/db";
import { getAuthUser, hasPermission, unauthorized, forbidden } from "@/server/middleware/auth";
import { grantPermission, revokePermission, getUserPermissions } from "@/lib/rbac";

/**
 * GET /api/admin/users/[id]/permissions - Get user's permissions
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authUser = getAuthUser(req);
  if (!authUser) return unauthorized();

  const hasAccess = await hasPermission(req, 'users.manage_roles');
  if (!hasAccess) return forbidden("You don't have permission to view user permissions");

  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true }
    });

    if (!user) {
      return Response.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const permissions = await getUserPermissions(id);

    // Get role-based permissions
    const rolePermissions = await prisma.rolePermission.findMany({
      where: { role: user.role },
      include: { permission: true }
    });

    // Get custom permissions
    const customPermissions = await prisma.userPermission.findMany({
      where: { userId: id },
      include: { permission: true }
    });

    return Response.json({
      success: true,
      allPermissions: permissions,
      rolePermissions: rolePermissions.map(rp => rp.permission.name),
      customPermissions: customPermissions.map(up => ({
        ...up.permission,
        grantedAt: up.grantedAt,
        grantedBy: up.grantedBy
      }))
    });
  } catch (error: any) {
    console.error('Error fetching user permissions:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to fetch permissions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users/[id]/permissions - Grant custom permission to user
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authUser = getAuthUser(req);
  if (!authUser) return unauthorized();

  const hasAccess = await hasPermission(req, 'users.manage_roles');
  if (!hasAccess) return forbidden("You don't have permission to manage user permissions");

  try {
    const { id } = await params;
    const body = await req.json();
    const { permissionName } = body;

    if (!permissionName) {
      return Response.json(
        { success: false, error: 'Permission name is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return Response.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Only SUPER_ADMIN can modify SUPER_ADMIN users
    if (user.role === UserRole.SUPER_ADMIN && authUser.role !== UserRole.SUPER_ADMIN) {
      return Response.json(
        { success: false, error: 'Only Super Admin can modify Super Admin permissions' },
        { status: 403 }
      );
    }

    await grantPermission(id, permissionName, authUser.userId);

    return Response.json({
      success: true,
      message: 'Permission granted successfully'
    });
  } catch (error: any) {
    console.error('Error granting permission:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to grant permission' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]/permissions - Revoke custom permission from user
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authUser = getAuthUser(req);
  if (!authUser) return unauthorized();

  const hasAccess = await hasPermission(req, 'users.manage_roles');
  if (!hasAccess) return forbidden("You don't have permission to manage user permissions");

  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const permissionName = searchParams.get('permission');

    if (!permissionName) {
      return Response.json(
        { success: false, error: 'Permission name is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return Response.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Only SUPER_ADMIN can modify SUPER_ADMIN users
    if (user.role === UserRole.SUPER_ADMIN && authUser.role !== UserRole.SUPER_ADMIN) {
      return Response.json(
        { success: false, error: 'Only Super Admin can modify Super Admin permissions' },
        { status: 403 }
      );
    }

    await revokePermission(id, permissionName);

    return Response.json({
      success: true,
      message: 'Permission revoked successfully'
    });
  } catch (error: any) {
    console.error('Error revoking permission:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to revoke permission' },
      { status: 500 }
    );
  }
}
