import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" style={{ background: "#0b0f14", colorScheme: "dark" }}>
      <head>
        <HeadContent />
        <style>{`
          html, body { background: #0b0f14; color: #e2e8f0; }
          #lf-boot { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 16px; background: #0b0f14; z-index: 9999; transition: opacity .25s ease; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Tahoma, sans-serif; }
          #lf-boot .lf-logo { font-size: 28px; font-weight: 700; letter-spacing: -.02em; color: #f1f5f9; }
          #lf-boot .lf-logo span { color: #25D366; }
          #lf-boot .lf-sub { font-size: 12px; color: #64748b; }
          #lf-boot .lf-spin { width: 28px; height: 28px; border: 2px solid rgba(37,211,102,.2); border-top-color: #25D366; border-radius: 50%; animation: lf-rot .8s linear infinite; }
          @keyframes lf-rot { to { transform: rotate(360deg); } }
          .lf-hidden { opacity: 0; pointer-events: none; }
        `}</style>
      </head>
      <body style={{ background: "#0b0f14", margin: 0 }}>
        <div id="lf-boot" aria-hidden="true">
          <div className="lf-logo">Lead<span>Flow</span></div>
          <div className="lf-spin" />
          <div className="lf-sub">جاري تجهيز النظام...</div>
        </div>
        {children}
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `requestAnimationFrame(function(){setTimeout(function(){var b=document.getElementById('lf-boot');if(b){b.classList.add('lf-hidden');setTimeout(function(){b&&b.remove();},300);}},120);});`,
          }}
        />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster richColors position="top-center" theme="dark" />
    </QueryClientProvider>
  );
}
