import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { LogIn, UserPlus, Mail } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "تسجيل الدخول — مسار" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/executive-dashboard" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        toast.success("تم تسجيل الدخول");
        navigate({ to: "/executive-dashboard" });
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/executive-dashboard`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("تم إنشاء الحساب! تحقق من بريدك إن طُلب التأكيد.");
        navigate({ to: "/executive-dashboard" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/executive-dashboard",
      });
      if (result.error) {
        toast.error(result.error.message || "فشل تسجيل دخول جوجل");
        setLoading(false);
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/executive-dashboard" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ";
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#0b0f14] text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-3xl font-bold">
            <span className="text-[#25D366]">مسار</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">منصة واتساب ذكية للمبيعات</p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0f141b] p-6 space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#0a0d12] rounded-xl">
            <button
              onClick={() => setMode("signin")}
              className={`py-2 text-xs rounded-lg font-medium transition ${mode === "signin" ? "bg-[#25D366] text-black" : "text-slate-400"}`}
            >
              <LogIn className="h-3.5 w-3.5 inline ml-1" /> دخول
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`py-2 text-xs rounded-lg font-medium transition ${mode === "signup" ? "bg-[#25D366] text-black" : "text-slate-400"}`}
            >
              <UserPlus className="h-3.5 w-3.5 inline ml-1" /> حساب جديد
            </button>
          </div>

          <button
            onClick={onGoogle}
            disabled={loading}
            className="w-full rounded-xl bg-white text-black font-medium py-2.5 text-sm flex items-center justify-center gap-2 hover:bg-white/90 disabled:opacity-60"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            متابعة باستخدام جوجل
          </button>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <div className="flex-1 h-px bg-white/5" /> أو <div className="flex-1 h-px bg-white/5" />
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            {mode === "signup" && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="الاسم الكامل"
                className="w-full rounded-xl bg-[#0a0d12] border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-[#25D366]/50"
              />
            )}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-[#0a0d12] border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-[#25D366]/50"
              placeholder="البريد الإلكتروني"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-[#0a0d12] border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-[#25D366]/50"
              placeholder="كلمة المرور (6 أحرف على الأقل)"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#25D366] hover:bg-[#25D366]/90 text-black font-semibold py-2.5 text-sm disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4" />
              {loading ? "جاري..." : mode === "signin" ? "تسجيل الدخول" : "إنشاء حساب"}
            </button>
          </form>

          <Link to="/" className="block text-center text-xs text-slate-400 hover:text-slate-200">← العودة للرئيسية</Link>
        </div>
      </div>
    </div>
  );
}
