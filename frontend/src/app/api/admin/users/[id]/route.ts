import { NextRequest } from "next/server";
import { UserRole } from "@prisma/client";
import prisma from "@/server/db";
import { hashPassword } from "@/server/lib/hash";
import { getAuthUser, hasPermission, unauthorized, forbidden } from "@/server/middleware/auth";
import { getRoleDisplayName } from "@/lib/rbac";

/**
 * GET /api/admin/users/[id] - Get single user details
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authUser = getAuthUser(req);
  if (!authUser) return unauthorized();

  const hasAccess = await hasPermission(req, 'users.view');
  if (!hasAccess) return forbidden("You don't have permission to view users");

  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        emailVerified: true,
        emailVerifiedAt: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });

    if (!user) {
      return Response.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      user: {
        ...user,
        roleDisplay: getRoleDisplayName(user.role),
        customPermissions: user.permissions.map(up => up.permission)
      }
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users/[id] - Update user
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authUser = getAuthUser(req);
  if (!authUser) return unauthorized();

  const hasAccess = await hasPermission(req, 'users.edit');
  if (!hasAccess) return forbidden("You don't have permission to edit users");

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, phone, password, role, isActive } = body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return Response.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Can't edit your own role or active status
    if (existingUser.id === authUser.userId && (role !== undefined || isActive !== undefined)) {
      return Response.json(
        { success: false, error: "You can't modify your own role or active status" },
        { status: 403 }
      );
    }

    // Only SUPER_ADMIN can modify SUPER_ADMIN users
    if (existingUser.role === UserRole.SUPER_ADMIN && authUser.role !== UserRole.SUPER_ADMIN) {
      return Response.json(
        { success: false, error: 'Only Super Admin can modify Super Admin users' },
        { status: 403 }
      );
    }

    // Only SUPER_ADMIN can assign SUPER_ADMIN role
    if (role === UserRole.SUPER_ADMIN && authUser.role !== UserRole.SUPER_ADMIN) {
      return Response.json(
        { success: false, error: 'Only Super Admin can assign Super Admin role' },
        { status: 403 }
      );
    }

    // Check email uniqueness if changing
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });

      if (emailExists) {
        return Response.json(
          { success: false, error: 'Email already in use' },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    if (password) {
      updateData.passwordHash = hashPassword(password);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        emailVerified: true,
        updatedAt: true
      }
    });

    return Response.json({
      success: true,
      message: 'User updated successfully',
      user: {
        ...updatedUser,
        roleDisplay: getRoleDisplayName(updatedUser.role)
      }
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id] - Delete user
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authUser = getAuthUser(req);
  if (!authUser) return unauthorized();

  const hasAccess = await hasPermission(req, 'users.delete');
  if (!hasAccess) return forbidden("You don't have permission to delete users");

  try {
    const { id } = await params;

    // Can't delete yourself
    if (id === authUser.userId) {
      return Response.json(
        { success: false, error: "You can't delete your own account" },
        { status: 403 }
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

    // Only SUPER_ADMIN can delete SUPER_ADMIN users
    if (user.role === UserRole.SUPER_ADMIN && authUser.role !== UserRole.SUPER_ADMIN) {
      return Response.json(
        { success: false, error: 'Only Super Admin can delete Super Admin users' },
        { status: 403 }
      );
    }

    await prisma.user.delete({
      where: { id }
    });

    return Response.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
