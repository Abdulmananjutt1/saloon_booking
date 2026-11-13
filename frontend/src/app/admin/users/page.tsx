"use client";

import { useState, useEffect } from "react";
import { UserRole } from "@prisma/client";
import { Plus, Edit2, Trash2, Shield, Search, Filter, Download, User, Mail, Phone, Calendar } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  roleDisplay: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  customPermissions: any[];
}

// Skeleton Loader Component
function TableSkeleton() {
  return (
    <div style={{ padding: "20px" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: "1px solid var(--border-light)" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.05)", animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ flex: 1 }}>
            <div style={{ width: "30%", height: 14, borderRadius: 4, background: "rgba(255,255,255,0.05)", marginBottom: 8, animation: "pulse 1.5s ease-in-out infinite" }} />
            <div style={{ width: "50%", height: 12, borderRadius: 4, background: "rgba(255,255,255,0.03)", animation: "pulse 1.5s ease-in-out infinite" }} />
          </div>
          <div style={{ width: 100, height: 24, borderRadius: 6, background: "rgba(255,255,255,0.05)", animation: "pulse 1.5s ease-in-out infinite" }} />
        </div>
      ))}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    isActive: boolean;
  }>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: UserRole.DESK_ADMIN,
    isActive: true
  });

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, search]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (roleFilter !== "ALL") params.append("role", roleFilter);
      if (search) params.append("search", search);

      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        alert("User created successfully!");
        setShowCreateModal(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          role: UserRole.DESK_ADMIN,
          isActive: true
        });
        fetchUsers();
      } else {
        alert(data.error || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        alert("User updated successfully!");
        setShowEditModal(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        alert(data.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        alert("User deleted successfully!");
        fetchUsers();
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: "",
      role: user.role,
      isActive: user.isActive
    });
    setShowEditModal(true);
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return { background: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" };
      case UserRole.ADMIN:
        return { background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)" };
      case UserRole.OPERATIONAL_ADMIN:
        return { background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" };
      case UserRole.STYLIST_MANAGER:
        return { background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" };
      case UserRole.DESK_ADMIN:
        return { background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)" };
      default:
        return { background: "rgba(107,114,128,0.1)", color: "#6b7280", border: "1px solid rgba(107,114,128,0.2)" };
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 4, fontFamily: "var(--font-display), Georgia, serif" }}>
            User Management
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Manage system users and their roles</p>
        </div>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, overflow: "hidden" }}>
          <TableSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 4, fontFamily: "var(--font-display), Georgia, serif" }}>
            User Management
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{users.length} system users</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "10px 18px", borderRadius: 11,
            background: "var(--bg-card)", border: "1px solid var(--border-light)",
            color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer"
          }}>
            <Download style={{ width: 14, height: 14 }} /> Export
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "10px 20px", borderRadius: 11,
              background: "var(--grad-gold-btn)", border: "none",
              color: "#0d0c0a", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(201,151,59,0.3)"
            }}
          >
            <Plus style={{ width: 14, height: 14 }} /> Create User
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 16, padding: "16px 20px", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "var(--gold)", opacity: 0.7 }} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "10px 14px 10px 38px",
                background: "var(--bg-primary)", border: "1px solid var(--border-light)",
                borderRadius: 10, color: "var(--text-primary)", fontSize: "0.8rem",
                outline: "none", transition: "all 0.2s"
              }}
            />
          </div>
          <div style={{ position: "relative" }}>
            <Filter style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "var(--gold)", opacity: 0.7 }} />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                width: "100%", padding: "10px 14px 10px 38px",
                background: "var(--bg-primary)", border: "1px solid var(--border-light)",
                borderRadius: 10, color: "var(--text-primary)", fontSize: "0.8rem",
                outline: "none", cursor: "pointer", appearance: "none"
              }}
            >
              <option value="ALL">All Roles</option>
              <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.OPERATIONAL_ADMIN}>Operations Admin</option>
              <option value={UserRole.STYLIST_MANAGER}>Stylist Manager</option>
              <option value={UserRole.DESK_ADMIN}>Desk Admin</option>
              <option value={UserRole.CLIENT}>Client</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 20, overflow: "hidden" }}>
        {users.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
            No users found
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                  {[
                    { label: "User", icon: User },
                    { label: "Contact", icon: Mail },
                    { label: "Role", icon: Shield },
                    { label: "Status", icon: null },
                    { label: "Created", icon: Calendar },
                    { label: "Actions", icon: null },
                  ].map(({ label, icon: Icon }) => (
                    <th key={label} style={{ padding: "14px 20px", textAlign: "left", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        {Icon && <Icon style={{ width: 11, height: 11, color: "var(--gold)", opacity: 0.7 }} />}
                        <span style={{ fontSize: "0.64rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)" }}>{label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: "1px solid var(--border-light)", transition: "background 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    {/* User */}
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: "50%",
                          background: "var(--grad-gold-btn)", display: "flex",
                          alignItems: "center", justifyContent: "center",
                          fontSize: "0.9rem", fontWeight: 800, color: "#0d0c0a"
                        }}>
                          {user.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>
                            {user.name}
                          </div>
                          {user.emailVerified && (
                            <div style={{ fontSize: "0.68rem", color: "var(--color-success)", display: "flex", alignItems: "center", gap: 3 }}>
                              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--color-success)" }} />
                              Verified
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", marginBottom: 3 }}>{user.email}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{user.phone}</div>
                    </td>

                    {/* Role */}
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "4px 10px", borderRadius: 8, fontSize: "0.7rem", fontWeight: 700,
                        ...getRoleBadgeStyle(user.role)
                      }}>
                        {user.roleDisplay}
                      </span>
                      {user.customPermissions.length > 0 && (
                        <div style={{ fontSize: "0.66rem", color: "var(--text-muted)", marginTop: 4 }}>
                          +{user.customPermissions.length} custom
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "4px 10px", borderRadius: 8, fontSize: "0.7rem", fontWeight: 700,
                        background: user.isActive ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                        color: user.isActive ? "#10b981" : "#ef4444",
                        border: `1px solid ${user.isActive ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: user.isActive ? "#10b981" : "#ef4444" }} />
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Created */}
                    <td style={{ padding: "16px 20px", fontSize: "0.76rem", color: "var(--text-muted)" }}>
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => { setSelectedUser(user); setShowPermissionsModal(true); }}
                          style={{
                            padding: "6px 8px", borderRadius: 8,
                            background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)",
                            color: "#a855f7", cursor: "pointer", display: "flex", alignItems: "center"
                          }}
                          title="Manage Permissions"
                        >
                          <Shield size={14} />
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          style={{
                            padding: "6px 8px", borderRadius: 8,
                            background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                            color: "#3b82f6", cursor: "pointer", display: "flex", alignItems: "center"
                          }}
                          title="Edit User"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          style={{
                            padding: "6px 8px", borderRadius: 8,
                            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                            color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center"
                          }}
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: "rgba(13,12,10,0.75)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24
        }}>
          <div style={{
            background: "var(--bg-card)", borderRadius: 20,
            border: "1px solid var(--border-light)", padding: 32,
            maxWidth: 480, width: "100%", maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)"
          }}>
            <h2 style={{
              fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)",
              marginBottom: 8, fontFamily: "var(--font-display), Georgia, serif"
            }}>
              Create New User
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 24 }}>
              Add a new system user with specific role and permissions
            </p>
            
            <form onSubmit={handleCreate}>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{
                    display: "block", fontSize: "0.75rem", fontWeight: 600,
                    color: "var(--text-secondary)", marginBottom: 8, textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: "100%", padding: "12px 16px", fontSize: "0.82rem",
                      background: "var(--bg-primary)", border: "1px solid var(--border-light)",
                      borderRadius: 10, color: "var(--text-primary)", outline: "none"
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: "block", fontSize: "0.75rem", fontWeight: 600,
                    color: "var(--text-secondary)", marginBottom: 8, textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: "100%", padding: "12px 16px", fontSize: "0.82rem",
                      background: "var(--bg-primary)", border: "1px solid var(--border-light)",
                      borderRadius: 10, color: "var(--text-primary)", outline: "none"
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: "block", fontSize: "0.75rem", fontWeight: 600,
                    color: "var(--text-secondary)", marginBottom: 8, textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: "100%", padding: "12px 16px", fontSize: "0.82rem",
                      background: "var(--bg-primary)", border: "1px solid var(--border-light)",
                      borderRadius: 10, color: "var(--text-primary)", outline: "none"
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: "block", fontSize: "0.75rem", fontWeight: 600,
                    color: "var(--text-secondary)", marginBottom: 8, textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{
                      width: "100%", padding: "12px 16px", fontSize: "0.82rem",
                      background: "var(--bg-primary)", border: "1px solid var(--border-light)",
                      borderRadius: 10, color: "var(--text-primary)", outline: "none"
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: "block", fontSize: "0.75rem", fontWeight: 600,
                    color: "var(--text-secondary)", marginBottom: 8, textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    Role
                  </label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    style={{
                      width: "100%", padding: "12px 16px", fontSize: "0.82rem",
                      background: "var(--bg-primary)", border: "1px solid var(--border-light)",
                      borderRadius: 10, color: "var(--text-primary)", outline: "none",
                      cursor: "pointer", appearance: "none"
                    }}
                  >
                    <option value={UserRole.DESK_ADMIN}>Desk Admin</option>
                    <option value={UserRole.OPERATIONAL_ADMIN}>Operations Admin</option>
                    <option value={UserRole.STYLIST_MANAGER}>Stylist Manager</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                    <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                  </select>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ width: 18, height: 18, cursor: "pointer" }}
                  />
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                    Active user account
                  </label>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: 1, padding: "12px", borderRadius: 11,
                    background: "var(--bg-primary)", border: "1px solid var(--border-light)",
                    color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1, padding: "12px", borderRadius: 11,
                    background: "var(--grad-gold-btn)", border: "none",
                    color: "#0d0c0a", fontSize: "0.82rem", fontWeight: 700,
                    cursor: "pointer", boxShadow: "0 4px 16px rgba(201,151,59,0.3)"
                  }}
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: "rgba(13,12,10,0.75)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24
        }}>
          <div style={{
            background: "var(--bg-card)", borderRadius: 20,
            border: "1px solid var(--border-light)", padding: 32,
            maxWidth: 480, width: "100%", maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)"
          }}>
            <h2 style={{
              fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)",
              marginBottom: 8, fontFamily: "var(--font-display), Georgia, serif"
            }}>
              Edit User
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 24 }}>
              Update user information and permissions
            </p>
            
            <form onSubmit={handleUpdate}>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{
                    display: "block", fontSize: "0.75rem", fontWeight: 600,
                    color: "var(--text-secondary)", marginBottom: 8, textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: "100%", padding: "12px 16px", fontSize: "0.82rem",
                      background: "var(--bg-primary)", border: "1px solid var(--border-light)",
                      borderRadius: 10, color: "var(--text-primary)", outline: "none"
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: "block", fontSize: "0.75rem", fontWeight: 600,
                    color: "var(--text-secondary)", marginBottom: 8, textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: "100%", padding: "12px 16px", fontSize: "0.82rem",
                      background: "var(--bg-primary)", border: "1px solid var(--border-light)",
                      borderRadius: 10, color: "var(--text-primary)", outline: "none"
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: "block", fontSize: "0.75rem", fontWeight: 600,
                    color: "var(--text-secondary)", marginBottom: 8, textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: "100%", padding: "12px 16px", fontSize: "0.82rem",
                      background: "var(--bg-primary)", border: "1px solid var(--border-light)",
                      borderRadius: 10, color: "var(--text-primary)", outline: "none"
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: "block", fontSize: "0.75rem", fontWeight: 600,
                    color: "var(--text-secondary)", marginBottom: 8, textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    New Password <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>(leave blank to keep current)</span>
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{
                      width: "100%", padding: "12px 16px", fontSize: "0.82rem",
                      background: "var(--bg-primary)", border: "1px solid var(--border-light)",
                      borderRadius: 10, color: "var(--text-primary)", outline: "none"
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: "block", fontSize: "0.75rem", fontWeight: 600,
                    color: "var(--text-secondary)", marginBottom: 8, textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    Role
                  </label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    style={{
                      width: "100%", padding: "12px 16px", fontSize: "0.82rem",
                      background: "var(--bg-primary)", border: "1px solid var(--border-light)",
                      borderRadius: 10, color: "var(--text-primary)", outline: "none",
                      cursor: "pointer", appearance: "none"
                    }}
                  >
                    <option value={UserRole.DESK_ADMIN}>Desk Admin</option>
                    <option value={UserRole.OPERATIONAL_ADMIN}>Operations Admin</option>
                    <option value={UserRole.STYLIST_MANAGER}>Stylist Manager</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                    <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                  </select>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ width: 18, height: 18, cursor: "pointer" }}
                  />
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                    Active user account
                  </label>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                  }}
                  style={{
                    flex: 1, padding: "12px", borderRadius: 11,
                    background: "var(--bg-primary)", border: "1px solid var(--border-light)",
                    color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1, padding: "12px", borderRadius: 11,
                    background: "var(--grad-gold-btn)", border: "none",
                    color: "#0d0c0a", fontSize: "0.82rem", fontWeight: 700,
                    cursor: "pointer", boxShadow: "0 4px 16px rgba(201,151,59,0.3)"
                  }}
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedUser && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: "rgba(13,12,10,0.75)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24
        }}>
          <div style={{
            background: "var(--bg-card)", borderRadius: 20,
            border: "1px solid var(--border-light)", padding: 32,
            maxWidth: 720, width: "100%", maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)"
          }}>
            <h2 style={{
              fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)",
              marginBottom: 8, fontFamily: "var(--font-display), Georgia, serif"
            }}>
              Manage Permissions
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 6 }}>
              User: <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{selectedUser.name}</span>
            </p>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 24 }}>
              Role: <span style={{ color: "var(--gold)", fontWeight: 700 }}>{selectedUser.roleDisplay}</span>
            </p>
            
            <div style={{
              padding: "48px", textAlign: "center",
              background: "var(--bg-primary)", borderRadius: 16,
              border: "1px solid var(--border-light)"
            }}>
              <Shield style={{ width: 48, height: 48, color: "var(--gold)", margin: "0 auto 16px", opacity: 0.5 }} />
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Permission management UI will be implemented here
              </p>
            </div>
            
            <button
              onClick={() => {
                setShowPermissionsModal(false);
                setSelectedUser(null);
              }}
              style={{
                width: "100%", marginTop: 24, padding: "12px", borderRadius: 11,
                background: "var(--bg-primary)", border: "1px solid var(--border-light)",
                color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
