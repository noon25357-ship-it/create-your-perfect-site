export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <title>حدث خطأ في تحميل الصفحة</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.6 system-ui, -apple-system, sans-serif; background: #0b0f14; color: #e2e8f0; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; background: #0f141b; border: 1px solid rgba(255,255,255,.06); border-radius: 20px; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #94a3b8; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.65rem 1rem; border-radius: 0.75rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #25D366; color: #04140B; font-weight: 700; }
      .secondary { background: rgba(255,255,255,.04); color: #e2e8f0; border-color: rgba(255,255,255,.08); }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>حدث خطأ في تحميل الصفحة</h1>
      <p>أعد المحاولة أو ارجع للرئيسية.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">أعد المحاولة</button>
        <a class="secondary" href="/">الرئيسية</a>
      </div>
    </div>
  </body>
</html>`;
}
