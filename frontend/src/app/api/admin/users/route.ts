import { NextRequest } from "next/server";
import { UserRole } from "@prisma/client";
import prisma from "@/server/db";
import { hashPassword } from "@/server/lib/hash";
import { getAuthUser, hasPermission, unauthorized, forbidden } from "@/server/middleware/auth";
import { getRoleDisplayName } from "@/lib/rbac";

/**
 * GET /api/admin/users - Get all users (requires users.view permission)
 */
export async function GET(req: NextRequest) {
  const authUser = getAuthUser(req);
  if (!authUser) return unauthorized();

  const hasAccess = await hasPermission(req, 'users.view');
  if (!hasAccess) return forbidden("You don't have permission to view users");

  try {
    const { searchParams } = new URL(req.url);
    const roleParam = searchParams.get('role');
    const search = searchParams.get('search');

    const where: any = {};
    
    if (roleParam && roleParam !== 'ALL') {
      where.role = roleParam as UserRole;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } }
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
        permissions: {
          include: {
            permission: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const usersWithRoleNames = users.map(user => ({
      ...user,
      roleDisplay: getRoleDisplayName(user.role),
      customPermissions: user.permissions.map(up => up.permission)
    }));

    return Response.json({ success: true, users: usersWithRoleNames });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users - Create new user (requires users.create permission)
 */
export async function POST(req: NextRequest) {
  const authUser = getAuthUser(req);
  if (!authUser) return unauthorized();

  const hasAccess = await hasPermission(req, 'users.create');
  if (!hasAccess) return forbidden("You don't have permission to create users");

  try {
    const body = await req.json();
    const { name, email, phone, password, role, isActive = true } = body;

    // Validation
    if (!name || !email || !phone || !password || !role) {
      return Response.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return Response.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      return Response.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Only SUPER_ADMIN can create SUPER_ADMIN users
    if (role === UserRole.SUPER_ADMIN && authUser.role !== UserRole.SUPER_ADMIN) {
      return Response.json(
        { success: false, error: 'Only Super Admin can create Super Admin users' },
        { status: 403 }
      );
    }

    // Hash password
    const passwordHash = hashPassword(password);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role,
        isActive,
        emailVerified: true, // Admin-created users are auto-verified
        emailVerifiedAt: new Date(),
        createdBy: authUser.userId
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true
      }
    });

    return Response.json({
      success: true,
      message: 'User created successfully',
      user: {
        ...newUser,
        roleDisplay: getRoleDisplayName(newUser.role)
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return Response.json(
      { success: false, error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
