import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { login, getSession } from "@/lib/auth-store";
import { LogIn, Shield } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "تسجيل الدخول — مسار" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getSession()) navigate({ to: "/executive-dashboard" });
  }, [navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const u = login(email.trim(), password);
      setLoading(false);
      if (!u) {
        toast.error("بيانات الدخول غير صحيحة");
        return;
      }
      toast.success(`مرحباً ${u.name} — تم تسجيل الدخول بصلاحية ${u.role}`);
      navigate({ to: "/executive-dashboard" });
    }, 300);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#0b0f14] text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-3xl font-bold">
            <span className="text-[#25D366]">مسار</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">WhatsApp AI Sales Hub</p>
        </div>
        <form onSubmit={onSubmit} className="rounded-2xl border border-white/5 bg-[#0f141b] p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <LogIn className="h-4 w-4 text-[#25D366]" /> تسجيل الدخول
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-[#0a0d12] border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-[#25D366]/50"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">كلمة المرور</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-[#0a0d12] border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-[#25D366]/50"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#25D366] hover:bg-[#25D366]/90 text-black font-semibold py-2.5 text-sm disabled:opacity-60"
          >
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
          <div className="rounded-xl border border-[#25D366]/20 bg-[#25D366]/5 p-3 text-[11px] text-slate-300 flex gap-2">
            <Shield className="h-3.5 w-3.5 text-[#25D366] shrink-0 mt-0.5" />
            <div>
              حساب الشريك جاهز: <span className="text-[#25D366]">braah45aleissa@gmail.com</span> / كلمة المرور: <span className="text-[#25D366]">Bb12345</span>
              <div className="text-slate-500 mt-1">صلاحية Super Admin — وصول كامل لجميع الأقسام.</div>
            </div>
          </div>
          <Link to="/" className="block text-center text-xs text-slate-400 hover:text-slate-200">← العودة للرئيسية</Link>
        </form>
      </div>
    </div>
  );
}
