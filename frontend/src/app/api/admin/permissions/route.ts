import { NextRequest } from "next/server";
import prisma from "@/server/db";
import { getAuthUser, hasPermission, unauthorized, forbidden } from "@/server/middleware/auth";
import { getAllPermissions } from "@/lib/rbac";

/**
 * GET /api/admin/permissions - Get all permissions
 */
export async function GET(req: NextRequest) {
  const authUser = getAuthUser(req);
  if (!authUser) return unauthorized();

  const hasAccess = await hasPermission(req, 'users.manage_roles');
  if (!hasAccess) return forbidden("You don't have permission to view permissions");

  try {
    const permissions = await getAllPermissions();

    return Response.json({
      success: true,
      permissions
    });
  } catch (error: any) {
    console.error('Error fetching permissions:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to fetch permissions' },
      { status: 500 }
    );
  }
}
