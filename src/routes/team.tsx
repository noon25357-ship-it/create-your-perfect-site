import { createFileRoute } from "@tanstack/react-router";
import AppShell, { Card, Badge } from "@/components/app/AppShell";
import { useAuth, addUser, ALL_PERMISSIONS, logout, type Role } from "@/lib/auth-store";
import { useState } from "react";
import { toast } from "sonner";
import { UserPlus, Shield, LogOut, Mail, Crown } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/team")({
  head: () => ({ meta: [{ title: "Team & Settings — مسار" }] }),
  component: TeamPage,
});

function TeamPage() {
  const { user, users } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("Agent");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    addUser({
      name,
      email,
      password,
      role,
      permissions: role === "Agent" ? ["inbox", "crm"] : ALL_PERMISSIONS,
    });
    toast.success(`تمت إضافة ${name} بصلاحية ${role}`);
    setName(""); setEmail(""); setPassword(""); setRole("Agent");
  };

  return (
    <AppShell
      title="Team Members & Settings"
      subtitle="إدارة المستخدمين والصلاحيات"
      actions={
        user ? (
          <button
            onClick={() => { logout(); toast.success("تم تسجيل الخروج"); navigate({ to: "/login" }); }}
            className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs flex items-center gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" /> خروج
          </button>
        ) : null
      }
    >
      {user && (
        <Card className="mb-6 border-[#25D366]/20 bg-gradient-to-br from-[#25D366]/[0.04] to-transparent">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#25D366] text-black flex items-center justify-center font-bold">
              {user.name.slice(0, 1)}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold flex items-center gap-2">
                {user.name}
                {user.role === "Super Admin" && <Crown className="h-3.5 w-3.5 text-amber-400" />}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1"><Mail className="h-3 w-3" />{user.email}</div>
            </div>
            <Badge tone="green">{user.role}</Badge>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-[#25D366]" />
            <h3 className="text-sm font-semibold">Team Members ({users.length})</h3>
          </div>
          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="rounded-xl border border-white/5 bg-white/[0.03] p-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#25D366] to-emerald-700 flex items-center justify-center text-xs font-bold text-black">
                  {u.name.slice(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium flex items-center gap-2">
                    {u.name}
                    {u.role === "Super Admin" && <Crown className="h-3 w-3 text-amber-400" />}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{u.email}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge tone={u.role === "Super Admin" ? "green" : u.role === "Admin" ? "blue" : "default"}>{u.role}</Badge>
                  <span className="text-[10px] text-slate-500">{u.permissions.length} صلاحية</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="h-4 w-4 text-[#25D366]" />
            <h3 className="text-sm font-semibold">إضافة عضو</h3>
          </div>
          <form onSubmit={handleAdd} className="space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم" className="w-full rounded-lg bg-[#0a0d12] border border-white/10 px-3 py-2 text-sm outline-none" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد" className="w-full rounded-lg bg-[#0a0d12] border border-white/10 px-3 py-2 text-sm outline-none" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" className="w-full rounded-lg bg-[#0a0d12] border border-white/10 px-3 py-2 text-sm outline-none" />
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="w-full rounded-lg bg-[#0a0d12] border border-white/10 px-3 py-2 text-sm outline-none">
              <option>Agent</option>
              <option>Admin</option>
              <option>Super Admin</option>
            </select>
            <button type="submit" className="w-full rounded-lg bg-[#25D366] text-black font-semibold py-2 text-sm">إضافة</button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
