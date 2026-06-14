import { createFileRoute, useNavigate } from "@tanstack/react-router";
import AppShell, { Card, Badge } from "@/components/app/AppShell";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shield, LogOut, Mail, Crown, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/team")({
  head: () => ({ meta: [{ title: "Team & Settings — مسار" }] }),
  component: TeamPage,
});

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  job_title: string | null;
  created_at: string;
};

type RoleRow = { user_id: string; role: "super_admin" | "admin" | "agent" };

function TeamPage() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<Record<string, string>>({});
  const [me, setMe] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data: sess } = await supabase.auth.getUser();
    const [{ data: ps }, { data: rs }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    setProfiles((ps as Profile[]) ?? []);
    const rmap: Record<string, string> = {};
    (rs as RoleRow[] | null)?.forEach((r) => { rmap[r.user_id] = r.role; });
    setRoles(rmap);
    if (sess.user) setMe((ps as Profile[] | null)?.find((p) => p.id === sess.user!.id) ?? null);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("تم تسجيل الخروج");
    navigate({ to: "/login" });
  };

  const roleLabel = (r?: string) =>
    r === "super_admin" ? "Super Admin" : r === "admin" ? "Admin" : "Agent";

  return (
    <AppShell
      title="Team Members & Settings"
      subtitle="إدارة المستخدمين والصلاحيات"
      actions={
        <div className="flex gap-2">
          <button
            onClick={load}
            className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" /> تحديث
          </button>
          <button
            onClick={logout}
            className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-xs flex items-center gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" /> خروج
          </button>
        </div>
      }
    >
      {me && (
        <Card className="mb-6 border-[#25D366]/20 bg-gradient-to-br from-[#25D366]/[0.04] to-transparent">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#25D366] text-black flex items-center justify-center font-bold uppercase">
              {(me.full_name ?? me.email ?? "U").slice(0, 1)}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold flex items-center gap-2">
                {me.full_name ?? me.email}
                {roles[me.id] === "super_admin" && <Crown className="h-3.5 w-3.5 text-amber-400" />}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Mail className="h-3 w-3" />{me.email}
              </div>
            </div>
            <Badge tone="green">{roleLabel(roles[me.id])}</Badge>
          </div>
        </Card>
      )}

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-[#25D366]" />
          <h3 className="text-sm font-semibold">Team Members ({profiles.length})</h3>
        </div>
        {loading ? (
          <div className="text-xs text-slate-400 py-6 text-center">جاري التحميل...</div>
        ) : profiles.length === 0 ? (
          <div className="text-xs text-slate-400 py-6 text-center">لا يوجد أعضاء بعد — ادعُ زملاءك للتسجيل من صفحة الدخول.</div>
        ) : (
          <div className="space-y-2">
            {profiles.map((u) => (
              <div key={u.id} className="rounded-xl border border-white/5 bg-white/[0.03] p-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#25D366] to-emerald-700 flex items-center justify-center text-xs font-bold text-black uppercase">
                  {(u.full_name ?? u.email ?? "U").slice(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium flex items-center gap-2">
                    {u.full_name ?? u.email}
                    {roles[u.id] === "super_admin" && <Crown className="h-3 w-3 text-amber-400" />}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{u.email}</div>
                </div>
                <Badge tone={roles[u.id] === "super_admin" ? "green" : roles[u.id] === "admin" ? "blue" : "default"}>
                  {roleLabel(roles[u.id])}
                </Badge>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 text-[11px] text-slate-500 border-t border-white/5 pt-3">
          لإضافة عضو جديد: أرسل له رابط <span className="text-[#25D366]">/login</span> ليُنشئ حسابه بنفسه. سيُسنَد له دور Agent تلقائياً، ويمكن لـ Super Admin ترقيته لاحقاً.
        </div>
      </Card>
    </AppShell>
  );
}
