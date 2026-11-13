// ─────────────────────────────────────────────────────────
//  Session helpers — single place for localStorage auth logic
//  Used by: login page, register page, dashboard, admin layout
// ─────────────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "SUPER_ADMIN" | "ADMIN" | "DESK_ADMIN" | "OPERATIONAL_ADMIN" | "STYLIST_MANAGER" | "CLIENT" | "admin" | "client";
}

export function saveSession(user: SessionUser, token: string): void {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
}

export function getSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function clearSession(): void {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

/**
 * Check if user has any admin role
 */
export function isAdmin(user: SessionUser | null): boolean {
  if (!user) return false;
  const role = user.role.toUpperCase();
  return role === "SUPER_ADMIN" || 
         role === "ADMIN" || 
         role === "DESK_ADMIN" || 
         role === "OPERATIONAL_ADMIN" || 
         role === "STYLIST_MANAGER";
}

/**
 * Check if role string is an admin role (works with string input)
 */
export function isAdminRole(role: string | undefined | null): boolean {
  if (!role) return false;
  const roleUpper = role.toUpperCase();
  return roleUpper === "SUPER_ADMIN" || 
         roleUpper === "ADMIN" || 
         roleUpper === "DESK_ADMIN" || 
         roleUpper === "OPERATIONAL_ADMIN" || 
         roleUpper === "STYLIST_MANAGER" ||
         role === "admin"; // for backward compatibility
}

/** Read a one-time toast from sessionStorage (set before redirect) */
export function popSessionToast(): { type: string; title: string; message: string } | null {
  try {
    const raw = sessionStorage.getItem("toast");
    if (!raw) return null;
    sessionStorage.removeItem("toast");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Queue a toast to be shown after the next page load */
export function pushSessionToast(type: string, title: string, message: string): void {
  sessionStorage.setItem("toast", JSON.stringify({ type, title, message }));
}
