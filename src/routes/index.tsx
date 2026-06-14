import { createFileRoute } from "@tanstack/react-router";
import { TammulPage } from "./tammul";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "تأمّل | Tammul — تجربة هدوء سينمائية" },
      {
        name: "description",
        content:
          "تأمّل تجربة رقمية تأخذك من فوضى اليوم إلى لحظة صفاء، عبر جلسات صوتية ومسارات تنفّس وواجهة مصممة كأنها مشهد سينمائي.",
      },
      { property: "og:title", content: "تأمّل | Tammul" },
      { property: "og:description", content: "اهدأ… قبل أن يبتلعك الضجيج." },
      { name: "theme-color", content: "#05070a" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Readex+Pro:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  component: TammulPage,
});
