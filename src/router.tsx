import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function PendingComponent() {
  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "#0b0f14", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#f1f5f9" }}>
        Lead<span style={{ color: "#25D366" }}>Flow</span>
      </div>
      <div style={{ width: 28, height: 28, border: "2px solid rgba(37,211,102,.2)", borderTopColor: "#25D366", borderRadius: "50%", animation: "lf-rot .8s linear infinite" }} />
      <div style={{ fontSize: 12, color: "#64748b" }}>جاري تجهيز النظام...</div>
    </div>
  );
}

function DefaultErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "#0b0f14", color: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ maxWidth: 420, textAlign: "center" }}>
        <h1 style={{ fontSize: 18, fontWeight: 600 }}>حدث خطأ في تحميل الصفحة</h1>
        <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>يرجى إعادة المحاولة.</p>
        <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center" }}>
          <button onClick={() => reset()} style={{ background: "#25D366", color: "#000", border: 0, padding: "8px 16px", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>
            أعد المحاولة
          </button>
          <a href="/" style={{ background: "rgba(255,255,255,.05)", color: "#e2e8f0", padding: "8px 16px", borderRadius: 10, textDecoration: "none" }}>
            الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: PendingComponent,
    defaultPendingMs: 0,
    defaultErrorComponent: DefaultErrorComponent,
  });

  return router;
};
