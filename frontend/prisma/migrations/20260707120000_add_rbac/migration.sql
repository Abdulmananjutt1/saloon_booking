-- CreateEnum for new UserRoles
CREATE TYPE "UserRole_new" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'DESK_ADMIN', 'OPERATIONAL_ADMIN', 'STYLIST_MANAGER', 'CLIENT');

-- AlterTable User - Add new columns
ALTER TABLE "users" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "users" ADD COLUMN "createdBy" TEXT;

-- Update existing roles and change column type
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE TEXT;
UPDATE "users" SET "role" = 'SUPER_ADMIN' WHERE "role" = 'ADMIN';
UPDATE "users" SET "role" = 'CLIENT' WHERE "role" = 'CLIENT';
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CLIENT'::"UserRole_new";

-- Drop old enum and rename new one
DROP TYPE "UserRole";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";

-- CreateTable Permission
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable UserPermission
CREATE TABLE "user_permissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedBy" TEXT,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable RolePermission
CREATE TABLE "role_permissions" (
    "id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_userId_permissionId_key" ON "user_permissions"("userId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_permissionId_key" ON "role_permissions"("role", "permissionId");

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert default permissions
INSERT INTO "permissions" ("id", "name", "description", "category", "createdAt", "updatedAt") VALUES
-- User Management
('perm_1', 'users.view', 'View users list', 'user_management', NOW(), NOW()),
('perm_2', 'users.create', 'Create new users', 'user_management', NOW(), NOW()),
('perm_3', 'users.edit', 'Edit user details', 'user_management', NOW(), NOW()),
('perm_4', 'users.delete', 'Delete users', 'user_management', NOW(), NOW()),
('perm_5', 'users.manage_roles', 'Manage user roles and permissions', 'user_management', NOW(), NOW()),

-- Bookings
('perm_6', 'bookings.view', 'View bookings', 'bookings', NOW(), NOW()),
('perm_7', 'bookings.create', 'Create bookings', 'bookings', NOW(), NOW()),
('perm_8', 'bookings.edit', 'Edit bookings', 'bookings', NOW(), NOW()),
('perm_9', 'bookings.cancel', 'Cancel bookings', 'bookings', NOW(), NOW()),
('perm_10', 'bookings.confirm', 'Confirm bookings', 'bookings', NOW(), NOW()),

-- Services
('perm_11', 'services.view', 'View services', 'services', NOW(), NOW()),
('perm_12', 'services.create', 'Create services', 'services', NOW(), NOW()),
('perm_13', 'services.edit', 'Edit services', 'services', NOW(), NOW()),
('perm_14', 'services.delete', 'Delete services', 'services', NOW(), NOW()),

-- Stylists
('perm_15', 'stylists.view', 'View stylists', 'stylists', NOW(), NOW()),
('perm_16', 'stylists.create', 'Create stylists', 'stylists', NOW(), NOW()),
('perm_17', 'stylists.edit', 'Edit stylists', 'stylists', NOW(), NOW()),
('perm_18', 'stylists.delete', 'Delete stylists', 'stylists', NOW(), NOW()),
('perm_19', 'stylists.manage_schedule', 'Manage stylist schedules', 'stylists', NOW(), NOW()),

-- Clients
('perm_20', 'clients.view', 'View clients', 'clients', NOW(), NOW()),
('perm_21', 'clients.create', 'Create clients', 'clients', NOW(), NOW()),
('perm_22', 'clients.edit', 'Edit clients', 'clients', NOW(), NOW()),
('perm_23', 'clients.delete', 'Delete clients', 'clients', NOW(), NOW()),

-- Payroll
('perm_24', 'payroll.view', 'View payroll', 'payroll', NOW(), NOW()),
('perm_25', 'payroll.create', 'Create payroll invoices', 'payroll', NOW(), NOW()),
('perm_26', 'payroll.edit', 'Edit payroll', 'payroll', NOW(), NOW()),
('perm_27', 'payroll.process', 'Process payments', 'payroll', NOW(), NOW()),

-- Analytics
('perm_28', 'analytics.view', 'View analytics', 'analytics', NOW(), NOW()),
('perm_29', 'analytics.export', 'Export reports', 'analytics', NOW(), NOW()),

-- Settings
('perm_30', 'settings.view', 'View settings', 'settings', NOW(), NOW()),
('perm_31', 'settings.edit', 'Edit settings', 'settings', NOW(), NOW()),

-- Chat
('perm_32', 'chat.view', 'View chat messages', 'chat', NOW(), NOW()),
('perm_33', 'chat.send', 'Send chat messages', 'chat', NOW(), NOW()),

-- Notifications
('perm_34', 'notifications.view', 'View notifications', 'notifications', NOW(), NOW()),
('perm_35', 'notifications.send', 'Send notifications', 'notifications', NOW(), NOW());

-- Assign permissions to SUPER_ADMIN (all permissions)
INSERT INTO "role_permissions" ("id", "role", "permissionId", "createdAt")
SELECT 'role_super_' || "id", 'SUPER_ADMIN', "id", NOW() FROM "permissions";

-- Assign permissions to ADMIN (most permissions except user role management)
INSERT INTO "role_permissions" ("id", "role", "permissionId", "createdAt")
SELECT 'role_admin_' || "id", 'ADMIN', "id", NOW() FROM "permissions"
WHERE "name" NOT IN ('users.manage_roles', 'users.delete');

-- Assign permissions to DESK_ADMIN (bookings, clients, basic viewing)
INSERT INTO "role_permissions" ("id", "role", "permissionId", "createdAt")
SELECT 'role_desk_' || "id", 'DESK_ADMIN', "id", NOW() FROM "permissions"
WHERE "name" IN (
  'bookings.view', 'bookings.create', 'bookings.edit', 'bookings.confirm',
  'clients.view', 'clients.create', 'clients.edit',
  'services.view', 'stylists.view',
  'chat.view', 'chat.send', 'notifications.view'
);

-- Assign permissions to OPERATIONAL_ADMIN (operations, no financial)
INSERT INTO "role_permissions" ("id", "role", "permissionId", "createdAt")
SELECT 'role_ops_' || "id", 'OPERATIONAL_ADMIN', "id", NOW() FROM "permissions"
WHERE "name" IN (
  'bookings.view', 'bookings.create', 'bookings.edit', 'bookings.cancel', 'bookings.confirm',
  'clients.view', 'clients.create', 'clients.edit',
  'services.view', 'services.edit',
  'stylists.view', 'stylists.edit', 'stylists.manage_schedule',
  'analytics.view', 'chat.view', 'chat.send',
  'notifications.view', 'notifications.send'
);

-- Assign permissions to STYLIST_MANAGER (stylist and schedule management)
INSERT INTO "role_permissions" ("id", "role", "permissionId", "createdAt")
SELECT 'role_stylist_mgr_' || "id", 'STYLIST_MANAGER', "id", NOW() FROM "permissions"
WHERE "name" IN (
  'bookings.view', 'bookings.edit',
  'stylists.view', 'stylists.create', 'stylists.edit', 'stylists.manage_schedule',
  'payroll.view', 'services.view',
  'chat.view', 'chat.send', 'notifications.view'
);
