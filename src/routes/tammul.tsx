import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Wind,
  Moon,
  Briefcase,
  Brain,
  Sparkles,
  Volume2,
} from "lucide-react";

export const Route = createFileRoute("/tammul")({
  head: () => ({
    meta: [
      { title: "تأمّل | Tammul — تجربة هدوء سينمائية" },
      {
        name: "description",
        content:
          "تأمّل تجربة رقمية تأخذك من فوضى اليوم إلى لحظة صفاء، عبر جلسات صوتية ومسارات تنفّس وواجهة مصممة كأنها مشهد سينمائي.",
      },
      { property: "og:title", content: "تأمّل | Tammul" },
      {
        property: "og:description",
        content: "اهدأ… قبل أن يبتلعك الضجيج.",
      },
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

/* ---------- Generated cinematic hero (Higgsfield) ---------- */
// Cinematic wet-asphalt night road, neon fog + silhouette — generated with Higgsfield.
// A full CSS gradient fallback sits beneath it, so the hero still looks great if the
// image is slow or unavailable.
const HERO_IMG =
  "https://d8j0ntlcm91z4.cloudfront.net/user_36QuWjjGd7BUAlCO7raUowBciHm/hf_20260614_122810_a56d3c2a-9b00-4d2d-af25-b60de06155c3.png";

/* ---------- Small building blocks ---------- */

function RainLayer() {
  // CSS-only rain: a handful of layered animated streaks.
  const drops = Array.from({ length: 60 });
  return (
    <div className="tm-rain" aria-hidden="true">
      {drops.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 4;
        const dur = 0.6 + Math.random() * 0.7;
        const h = 60 + Math.random() * 80;
        const o = 0.06 + Math.random() * 0.16;
        return (
          <span
            key={i}
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
              height: `${h}px`,
              opacity: o,
            }}
          />
        );
      })}
    </div>
  );
}

function Waveform({ active }: { active: boolean }) {
  const bars = Array.from({ length: 56 });
  return (
    <div className={`tm-wave ${active ? "is-active" : ""}`} aria-hidden="true">
      {bars.map((_, i) => (
        <span
          key={i}
          style={{
            animationDelay: `${(i % 14) * 0.07}s`,
            // a soft bell-curve so the middle bars are taller
            height: `${20 + Math.sin((i / bars.length) * Math.PI) * 70}%`,
          }}
        />
      ))}
    </div>
  );
}

function CinematicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const total = 8 * 60; // 8:00
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => {
        setSeconds((s) => (s + 1) % (total + 1));
      }, 1000);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, total]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const progress = (seconds / total) * 100;

  return (
    <div className="tm-player">
      <div className="tm-player-reflect" aria-hidden="true" />
      <div className="tm-player-inner">
        <div className="tm-player-head">
          <div className="tm-player-tag">
            <Volume2 size={14} />
            <span>جلسة صوتية</span>
          </div>
          <h3 className="tm-player-title">طريق هادئ بعد يوم طويل</h3>
          <p className="tm-player-sub">تنفّس عميق · موسيقى محيطية · 8 دقائق</p>
        </div>

        <Waveform active={playing} />

        <div className="tm-player-progress">
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className="tm-player-controls">
          <span className="tm-time">{fmt(seconds)}</span>

          <button
            type="button"
            className={`tm-play ${playing ? "is-playing" : ""}`}
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "إيقاف مؤقت" : "تشغيل"}
          >
            <span className="tm-play-ring" aria-hidden="true" />
            <span className="tm-play-ring tm-play-ring--2" aria-hidden="true" />
            {playing ? <Pause size={26} /> : <Play size={26} className="tm-play-icon" />}
          </button>

          <span className="tm-time">{fmt(total)}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export function TammulPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const problems = [
    {
      icon: <Wind size={22} />,
      title: "تشتيت مستمر",
      desc: "إشعارات لا تتوقف، وذهن يقفز من فكرة لأخرى دون أن يرتاح.",
    },
    {
      icon: <Brain size={22} />,
      title: "ضغط ذهني",
      desc: "حِمل يومي يتراكم بصمت حتى يصبح التركيز معركة.",
    },
    {
      icon: <Moon size={22} />,
      title: "نوم متقطع",
      desc: "تغمض عينيك… لكن العقل ما زال يعمل بأقصى سرعة.",
    },
  ];

  const sessions = [
    {
      icon: <Wind size={22} />,
      title: "جلسة تنفّس",
      time: "3 دقائق",
      desc: "إيقاع تنفّس موجَّه يعيد ضبط جهازك العصبي بسرعة.",
      accent: "violet",
    },
    {
      icon: <Moon size={22} />,
      title: "تهدئة قبل النوم",
      time: "12 دقيقة",
      desc: "أصوات دافئة تذيب توتر اليوم وتمهّد لنومٍ أعمق.",
      accent: "blue",
    },
    {
      icon: <Briefcase size={22} />,
      title: "تفريغ ضغط العمل",
      time: "7 دقائق",
      desc: "استراحة قصيرة بين المهام تعيد لك صفاء القرار.",
      accent: "gold",
    },
    {
      icon: <Brain size={22} />,
      title: "تركيز عميق",
      time: "20 دقيقة",
      desc: "طبقات صوتية تدخلك في حالة تدفّق وانغماس كامل.",
      accent: "violet",
    },
  ];

  const reasons = [
    "تجربة بصرية تشدّك من أول لحظة",
    "جلسات قصيرة تناسب الشخص المشغول",
    "واجهة عربية فاخرة بكل تفصيل",
    "تصميم يحوّل الهدوء إلى مشهد",
  ];

  return (
    <div className="tm-root" dir="rtl">
      <style>{TM_CSS}</style>

      {/* film grain + vignette over everything */}
      <div className="tm-grain" aria-hidden="true" />
      <div className="tm-vignette" aria-hidden="true" />

      {/* ===== NAV ===== */}
      <header className="tm-nav">
        <div className="tm-brand">
          <span className="tm-brand-dot" aria-hidden="true" />
          <span className="tm-brand-ar">تأمّل</span>
          <span className="tm-brand-en">Tammul</span>
        </div>
        <a href="#cta" className="tm-nav-cta">
          ابدأ الآن
        </a>
      </header>

      {/* ===== HERO ===== */}
      <section className="tm-hero">
        <div
          className="tm-hero-bg"
          style={{
            backgroundImage: `url(${HERO_IMG})`,
            transform: `translateY(${scrollY * 0.18}px) scale(1.08)`,
          }}
          aria-hidden="true"
        />
        <div className="tm-hero-fallback" aria-hidden="true" />
        <div className="tm-fog" aria-hidden="true" />
        <div className="tm-fog tm-fog--2" aria-hidden="true" />
        <RainLayer />
        <div className="tm-hero-grad" aria-hidden="true" />

        {/* breathing rings centered behind text */}
        <div
          className="tm-breath"
          aria-hidden="true"
          style={{ transform: `translate(-50%, -50%) translateY(${scrollY * 0.12}px)` }}
        >
          <span />
          <span />
          <span />
          <span className="tm-breath-core" />
        </div>

        <div className="tm-hero-content">
          <p className="tm-eyebrow">
            <Sparkles size={14} /> تجربة تأمّل سينمائية
          </p>
          <h1 className="tm-hero-title">
            اهدأ…
            <br />
            <span className="tm-hero-title-accent">قبل أن يبتلعك الضجيج.</span>
          </h1>
          <p className="tm-hero-sub">
            تأمّل تجربة رقمية تأخذك من فوضى اليوم إلى لحظة صفاء، عبر جلسات صوتية،
            ومسارات تنفّس، وواجهة مصمَّمة كأنها مشهد سينمائي.
          </p>
          <div className="tm-hero-actions">
            <a href="#cta" className="tm-btn tm-btn-primary">
              <span>ابدأ الجلسة</span>
              <Play size={16} />
            </a>
            <a href="#player" className="tm-btn tm-btn-ghost">
              شاهد التجربة
            </a>
          </div>
        </div>

        <div className="tm-scroll-hint" aria-hidden="true">
          <span />
        </div>
      </section>

      {/* ===== PROBLEM ===== */}
      <section className="tm-section">
        <div className="tm-section-head">
          <span className="tm-kicker">المشكلة</span>
          <h2 className="tm-h2">
            مو كل تعب يحتاج نوم…
            <br />
            <span className="tm-muted-accent">أحيانًا يحتاج صمت.</span>
          </h2>
        </div>
        <div className="tm-grid-3">
          {problems.map((p) => (
            <article key={p.title} className="tm-card tm-card--problem">
              <div className="tm-card-icon">{p.icon}</div>
              <h3 className="tm-card-title">{p.title}</h3>
              <p className="tm-card-desc">{p.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ===== EXPERIENCE ===== */}
      <section className="tm-section">
        <div className="tm-section-head">
          <span className="tm-kicker">التجربة</span>
          <h2 className="tm-h2">جلسات مصمَّمة لِلحظتك.</h2>
          <p className="tm-section-lead">
            اختر مسارك حسب مزاجك ووقتك — كل جلسة مشهد قائم بذاته.
          </p>
        </div>
        <div className="tm-grid-4">
          {sessions.map((s) => (
            <article
              key={s.title}
              className={`tm-card tm-card--glass tm-accent-${s.accent}`}
            >
              <div className="tm-glass-glow" aria-hidden="true" />
              <div className="tm-card-icon">{s.icon}</div>
              <div className="tm-card-meta">
                <h3 className="tm-card-title">{s.title}</h3>
                <span className="tm-pill">{s.time}</span>
              </div>
              <p className="tm-card-desc">{s.desc}</p>
              <span className="tm-card-link">
                ابدأ <Play size={13} />
              </span>
            </article>
          ))}
        </div>
      </section>

      {/* ===== CINEMATIC PLAYER ===== */}
      <section className="tm-section tm-section--player" id="player">
        <div className="tm-player-stage">
          <div className="tm-player-glow" aria-hidden="true" />
          <div className="tm-section-head tm-section-head--center">
            <span className="tm-kicker">المشغّل</span>
            <h2 className="tm-h2">اضغط تشغيل… ودع الباقي علينا.</h2>
          </div>
          <CinematicPlayer />
        </div>
      </section>

      {/* ===== WHY DIFFERENT ===== */}
      <section className="tm-section">
        <div className="tm-why">
          <div className="tm-why-head">
            <span className="tm-kicker">لماذا مختلف؟</span>
            <h2 className="tm-h2">
              تطبيقات التأمل كثيرة…
              <br />
              <span className="tm-muted-accent">لكن الإحساس نادر.</span>
            </h2>
          </div>
          <ul className="tm-why-list">
            {reasons.map((r, i) => (
              <li key={r} className="tm-why-item">
                <span className="tm-why-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="tm-why-text">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="tm-section tm-cta" id="cta">
        <div className="tm-cta-glow" aria-hidden="true" />
        <div className="tm-breath tm-breath--cta" aria-hidden="true">
          <span />
          <span />
          <span className="tm-breath-core" />
        </div>
        <div className="tm-cta-inner">
          <h2 className="tm-cta-title">
            خذ نفَس…
            <br />
            <span className="tm-hero-title-accent">وابدأ من جديد.</span>
          </h2>
          <a href="#" className="tm-btn tm-btn-primary tm-btn-lg">
            <span>ادخل التجربة</span>
            <Sparkles size={16} />
          </a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="tm-footer">
        <div className="tm-brand">
          <span className="tm-brand-dot" aria-hidden="true" />
          <span className="tm-brand-ar">تأمّل</span>
          <span className="tm-brand-en">Tammul</span>
        </div>
        <p>صُمِّم ليُشعَر به — لا ليُستخدَم فقط.</p>
      </footer>
    </div>
  );
}

/* ---------- Scoped styles ---------- */
const TM_CSS = `
.tm-root{
  --bg:#05070a;
  --ink:#f2f4f8;
  --muted:#9aa3b2;
  --violet:#8b5cf6;
  --blue:#38bdf8;
  --gold:#e9c684;
  position:relative;
  background:var(--bg);
  color:var(--ink);
  font-family:"IBM Plex Sans Arabic","Readex Pro",system-ui,sans-serif;
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
.tm-root *{box-sizing:border-box;}

/* grain + vignette overlays */
.tm-grain{
  position:fixed; inset:0; z-index:60; pointer-events:none; opacity:.05;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation:tm-grain 6s steps(6) infinite;
}
@keyframes tm-grain{
  0%{transform:translate(0,0)}10%{transform:translate(-4%,-4%)}20%{transform:translate(3%,-2%)}
  30%{transform:translate(-2%,3%)}40%{transform:translate(2%,2%)}50%{transform:translate(-3%,1%)}
  60%{transform:translate(3%,-3%)}70%{transform:translate(-2%,-2%)}80%{transform:translate(2%,3%)}
  90%{transform:translate(-3%,-1%)}100%{transform:translate(0,0)}
}
.tm-vignette{
  position:fixed; inset:0; z-index:55; pointer-events:none;
  background:radial-gradient(120% 90% at 50% 35%,transparent 45%,rgba(0,0,0,.55) 100%);
}

/* nav */
.tm-nav{
  position:fixed; top:0; inset-inline:0; z-index:50;
  display:flex; align-items:center; justify-content:space-between;
  padding:18px clamp(20px,5vw,64px);
  background:linear-gradient(180deg,rgba(5,7,10,.75),rgba(5,7,10,0));
  backdrop-filter:blur(4px);
}
.tm-brand{display:flex; align-items:center; gap:9px; font-weight:600;}
.tm-brand-dot{
  width:9px;height:9px;border-radius:50%;
  background:radial-gradient(circle,#fff,var(--violet));
  box-shadow:0 0 14px 2px var(--violet);
  animation:tm-pulse 3.4s ease-in-out infinite;
}
.tm-brand-ar{font-size:19px;letter-spacing:.5px;}
.tm-brand-en{font-size:12px;color:var(--muted);font-family:"Readex Pro",sans-serif;letter-spacing:2px;text-transform:uppercase;}
.tm-nav-cta{
  font-size:13px;color:var(--ink);text-decoration:none;
  padding:9px 18px;border-radius:999px;
  border:1px solid rgba(255,255,255,.14);
  background:rgba(255,255,255,.03);
  transition:.35s;
}
.tm-nav-cta:hover{background:rgba(139,92,246,.16);border-color:rgba(139,92,246,.5);box-shadow:0 0 24px rgba(139,92,246,.25);}

/* hero */
.tm-hero{
  position:relative; min-height:100svh;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  text-align:center; padding:140px clamp(20px,5vw,40px) 120px; overflow:hidden;
}
.tm-hero-bg{
  position:absolute; inset:-6%; z-index:1;
  background-size:cover; background-position:center 60%;
  will-change:transform;
}
.tm-hero-fallback{
  position:absolute; inset:0; z-index:0;
  background:
    radial-gradient(80% 50% at 50% 12%,rgba(56,189,248,.18),transparent 60%),
    radial-gradient(70% 60% at 30% 80%,rgba(139,92,246,.22),transparent 60%),
    radial-gradient(60% 50% at 75% 70%,rgba(233,198,132,.10),transparent 60%),
    linear-gradient(180deg,#05070a,#070a10 60%,#05070a);
}
.tm-hero-grad{
  position:absolute; inset:0; z-index:3;
  background:
    radial-gradient(90% 60% at 50% 30%,transparent 30%,rgba(5,7,10,.55) 100%),
    linear-gradient(180deg,rgba(5,7,10,.35) 0%,rgba(5,7,10,.1) 35%,rgba(5,7,10,.85) 88%,#05070a 100%);
}

/* fog */
.tm-fog{
  position:absolute; inset:0; z-index:2; pointer-events:none;
  background:radial-gradient(60% 40% at 50% 75%,rgba(139,92,246,.14),transparent 70%),
            radial-gradient(50% 35% at 25% 60%,rgba(56,189,248,.10),transparent 70%);
  filter:blur(20px);
  animation:tm-fog 16s ease-in-out infinite alternate;
}
.tm-fog--2{
  background:radial-gradient(55% 40% at 70% 70%,rgba(233,198,132,.08),transparent 70%);
  animation-duration:22s; animation-direction:alternate-reverse;
}
@keyframes tm-fog{0%{transform:translateX(-4%) translateY(0)}100%{transform:translateX(6%) translateY(-3%)}}

/* rain */
.tm-rain{position:absolute; inset:0; z-index:4; pointer-events:none; overflow:hidden;}
.tm-rain span{
  position:absolute; top:-15%; width:1px;
  background:linear-gradient(transparent,rgba(190,210,255,.7));
  animation-name:tm-rain; animation-iteration-count:infinite; animation-timing-function:linear;
}
@keyframes tm-rain{0%{transform:translateY(-20vh)}100%{transform:translateY(120vh)}}

/* breathing rings */
.tm-breath{
  position:absolute; top:42%; left:50%; z-index:3;
  width:520px; height:520px; max-width:90vw; max-height:90vw;
  display:grid; place-items:center; pointer-events:none;
}
.tm-breath span{
  position:absolute; border-radius:50%;
  border:1px solid rgba(139,92,246,.22);
  width:100%; height:100%;
  animation:tm-breath 7s ease-in-out infinite;
}
.tm-breath span:nth-child(2){width:70%;height:70%;border-color:rgba(56,189,248,.22);animation-delay:.6s;}
.tm-breath span:nth-child(3){width:42%;height:42%;border-color:rgba(233,198,132,.20);animation-delay:1.2s;}
.tm-breath-core{
  width:120px!important;height:120px!important;border:none!important;
  background:radial-gradient(circle,rgba(139,92,246,.35),transparent 70%);
  filter:blur(8px); animation:tm-breath-core 7s ease-in-out infinite!important;
}
@keyframes tm-breath{0%,100%{transform:scale(.82);opacity:.5}50%{transform:scale(1.06);opacity:1}}
@keyframes tm-breath-core{0%,100%{transform:scale(.7);opacity:.5}50%{transform:scale(1.15);opacity:1}}
@keyframes tm-pulse{0%,100%{opacity:.6;box-shadow:0 0 10px 1px var(--violet)}50%{opacity:1;box-shadow:0 0 18px 4px var(--violet)}}

.tm-hero-content{position:relative; z-index:10; max-width:820px; animation:tm-rise 1.1s cubic-bezier(.16,1,.3,1) both;}
@keyframes tm-rise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
.tm-eyebrow{
  display:inline-flex; align-items:center; gap:7px;
  font-size:13px; color:var(--gold); letter-spacing:.5px;
  padding:7px 16px; border-radius:999px; margin:0 0 26px;
  border:1px solid rgba(233,198,132,.25); background:rgba(233,198,132,.05);
}
.tm-eyebrow svg{color:var(--gold);}
.tm-hero-title{
  font-size:clamp(40px,8vw,86px); line-height:1.08; font-weight:700; margin:0;
  letter-spacing:-1px; text-shadow:0 4px 40px rgba(0,0,0,.6);
}
.tm-hero-title-accent{
  background:linear-gradient(100deg,#fff 0%,var(--violet) 45%,var(--blue) 100%);
  -webkit-background-clip:text; background-clip:text; color:transparent;
}
.tm-hero-sub{
  font-size:clamp(15px,2.2vw,20px); line-height:2; color:#cbd2de;
  max-width:620px; margin:26px auto 0; font-weight:300;
}
.tm-hero-actions{display:flex; gap:14px; justify-content:center; flex-wrap:wrap; margin-top:38px;}

/* buttons */
.tm-btn{
  display:inline-flex; align-items:center; gap:9px;
  font-size:15px; font-weight:500; text-decoration:none; cursor:pointer;
  padding:14px 28px; border-radius:999px; border:1px solid transparent;
  transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s,background .3s,border-color .3s;
}
.tm-btn-primary{
  color:#0a0610;
  background:linear-gradient(100deg,#fff,#e6dcff 40%,var(--violet));
  box-shadow:0 8px 30px rgba(139,92,246,.4),inset 0 0 0 1px rgba(255,255,255,.3);
}
.tm-btn-primary:hover{transform:translateY(-3px);box-shadow:0 14px 44px rgba(139,92,246,.6);}
.tm-btn-ghost{
  color:var(--ink); border-color:rgba(255,255,255,.18); background:rgba(255,255,255,.03);
  backdrop-filter:blur(6px);
}
.tm-btn-ghost:hover{transform:translateY(-3px);border-color:rgba(56,189,248,.55);box-shadow:0 8px 30px rgba(56,189,248,.22);}
.tm-btn-lg{padding:18px 40px;font-size:17px;}

/* scroll hint */
.tm-scroll-hint{
  position:absolute; bottom:30px; left:50%; transform:translateX(-50%); z-index:10;
  width:24px; height:40px; border-radius:14px; border:1px solid rgba(255,255,255,.2);
  display:flex; justify-content:center; padding-top:7px;
}
.tm-scroll-hint span{width:3px;height:8px;border-radius:3px;background:#fff;animation:tm-scroll 1.8s ease-in-out infinite;}
@keyframes tm-scroll{0%{opacity:0;transform:translateY(-4px)}50%{opacity:1}100%{opacity:0;transform:translateY(10px)}}

/* sections */
.tm-section{position:relative; z-index:10; padding:clamp(80px,12vw,150px) clamp(20px,6vw,80px); max-width:1180px; margin:0 auto;}
.tm-section-head{margin-bottom:54px; max-width:640px;}
.tm-section-head--center{margin:0 auto 54px; text-align:center;}
.tm-kicker{
  display:inline-block; font-size:12px; letter-spacing:3px; text-transform:uppercase;
  color:var(--violet); font-family:"Readex Pro",sans-serif; margin-bottom:18px;
}
.tm-h2{font-size:clamp(28px,4.6vw,48px); line-height:1.25; font-weight:700; margin:0; letter-spacing:-.5px;}
.tm-muted-accent{
  background:linear-gradient(100deg,var(--blue),var(--violet));
  -webkit-background-clip:text;background-clip:text;color:transparent;
}
.tm-section-lead{color:var(--muted); font-size:17px; line-height:1.9; margin-top:18px; font-weight:300;}

/* grids */
.tm-grid-3{display:grid; grid-template-columns:repeat(3,1fr); gap:22px;}
.tm-grid-4{display:grid; grid-template-columns:repeat(4,1fr); gap:20px;}

/* cards */
.tm-card{
  position:relative; padding:30px 26px; border-radius:22px; overflow:hidden;
  border:1px solid rgba(255,255,255,.07);
  background:linear-gradient(160deg,rgba(255,255,255,.04),rgba(255,255,255,.01));
  transition:transform .45s cubic-bezier(.16,1,.3,1),border-color .45s,box-shadow .45s;
}
.tm-card-icon{
  width:48px;height:48px;border-radius:14px; display:grid; place-items:center;
  color:var(--violet); margin-bottom:20px;
  background:rgba(139,92,246,.1); border:1px solid rgba(139,92,246,.2);
}
.tm-card-title{font-size:19px;font-weight:600;margin:0 0 10px;}
.tm-card-desc{font-size:14.5px;line-height:1.85;color:var(--muted);font-weight:300;margin:0;}

.tm-card--problem:hover{transform:translateY(-6px);border-color:rgba(139,92,246,.3);box-shadow:0 20px 50px rgba(0,0,0,.5);}

/* glass session cards */
.tm-card--glass{
  background:linear-gradient(160deg,rgba(255,255,255,.07),rgba(255,255,255,.015));
  backdrop-filter:blur(12px); display:flex; flex-direction:column;
}
.tm-glass-glow{
  position:absolute; inset:0; opacity:0; transition:opacity .5s; pointer-events:none;
  background:radial-gradient(80% 60% at 50% 0%,rgba(139,92,246,.25),transparent 70%);
}
.tm-card--glass:hover{transform:translateY(-8px) scale(1.015);border-color:rgba(255,255,255,.18);box-shadow:0 26px 60px rgba(0,0,0,.55);}
.tm-card--glass:hover .tm-glass-glow{opacity:1;}
.tm-accent-blue .tm-card-icon{color:var(--blue);background:rgba(56,189,248,.1);border-color:rgba(56,189,248,.22);}
.tm-accent-blue .tm-glass-glow{background:radial-gradient(80% 60% at 50% 0%,rgba(56,189,248,.25),transparent 70%);}
.tm-accent-gold .tm-card-icon{color:var(--gold);background:rgba(233,198,132,.1);border-color:rgba(233,198,132,.22);}
.tm-accent-gold .tm-glass-glow{background:radial-gradient(80% 60% at 50% 0%,rgba(233,198,132,.22),transparent 70%);}
.tm-card-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;}
.tm-card-meta .tm-card-title{margin:0;}
.tm-pill{
  font-size:11.5px;color:var(--muted);padding:4px 11px;border-radius:999px;
  border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);white-space:nowrap;
  font-family:"Readex Pro",sans-serif;
}
.tm-card-link{
  margin-top:auto; padding-top:18px; display:inline-flex; align-items:center; gap:6px;
  font-size:13.5px; color:#fff; opacity:.0; transform:translateY(6px);
  transition:.4s; font-weight:500;
}
.tm-card--glass:hover .tm-card-link{opacity:1;transform:translateY(0);}
.tm-card-link svg{transition:transform .4s;}
.tm-card--glass:hover .tm-card-link svg{transform:translateX(-4px);}

/* ===== PLAYER ===== */
.tm-section--player{max-width:none; padding-inline:clamp(20px,6vw,80px);}
.tm-player-stage{position:relative; max-width:760px; margin:0 auto;}
.tm-player-glow{
  position:absolute; inset:-20% -10%; z-index:0; pointer-events:none;
  background:radial-gradient(50% 50% at 50% 60%,rgba(139,92,246,.22),transparent 70%);
  filter:blur(30px);
}
.tm-player{
  position:relative; z-index:2; border-radius:28px; overflow:hidden;
  padding:42px clamp(24px,5vw,52px) 38px;
  border:1px solid rgba(255,255,255,.1);
  background:
    linear-gradient(160deg,rgba(20,16,32,.85),rgba(8,10,16,.92));
  box-shadow:0 40px 90px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.06);
  backdrop-filter:blur(14px);
}
/* wet asphalt reflection at the bottom of the player */
.tm-player-reflect{
  position:absolute; inset-inline:0; bottom:0; height:46%; z-index:0; pointer-events:none;
  background:
    radial-gradient(70% 120% at 30% 120%,rgba(139,92,246,.28),transparent 60%),
    radial-gradient(60% 120% at 75% 120%,rgba(56,189,248,.22),transparent 60%),
    linear-gradient(180deg,transparent,rgba(0,0,0,.5));
  mask-image:linear-gradient(180deg,transparent,#000 60%);
  filter:blur(6px);
}
.tm-player-inner{position:relative; z-index:2;}
.tm-player-head{text-align:center; margin-bottom:30px;}
.tm-player-tag{
  display:inline-flex; align-items:center; gap:7px; font-size:12px; color:var(--gold);
  padding:6px 14px;border-radius:999px;border:1px solid rgba(233,198,132,.22);
  background:rgba(233,198,132,.05); margin-bottom:16px;
}
.tm-player-title{font-size:clamp(22px,3.4vw,30px);font-weight:700;margin:0 0 8px;}
.tm-player-sub{font-size:13.5px;color:var(--muted);margin:0;font-weight:300;}

/* waveform */
.tm-wave{display:flex; align-items:center; justify-content:center; gap:3px; height:90px; margin:6px 0 26px;}
.tm-wave span{
  width:4px; border-radius:4px; min-height:6px;
  background:linear-gradient(180deg,var(--blue),var(--violet));
  opacity:.5; transform:scaleY(.45); transform-origin:center;
  transition:opacity .4s;
}
.tm-wave.is-active span{opacity:1; animation:tm-wave 1.1s ease-in-out infinite;}
@keyframes tm-wave{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}

.tm-player-progress{height:4px;border-radius:4px;background:rgba(255,255,255,.08);overflow:hidden;margin-bottom:24px;}
.tm-player-progress span{display:block;height:100%;border-radius:4px;background:linear-gradient(90deg,var(--blue),var(--violet));transition:width 1s linear;box-shadow:0 0 12px rgba(139,92,246,.6);}

.tm-player-controls{display:flex; align-items:center; justify-content:center; gap:26px;}
.tm-time{font-size:13px;color:var(--muted);font-family:"Readex Pro",sans-serif;min-width:46px;text-align:center;}
.tm-play{
  position:relative; width:74px; height:74px; border-radius:50%; cursor:pointer;
  display:grid; place-items:center; color:#0a0610; border:none;
  background:linear-gradient(140deg,#fff,#e6dcff 50%,var(--violet));
  box-shadow:0 10px 34px rgba(139,92,246,.5);
  transition:transform .3s;
}
.tm-play:hover{transform:scale(1.06);}
.tm-play:active{transform:scale(.96);}
.tm-play-icon{margin-inline-start:3px;}
.tm-play-ring{
  position:absolute; inset:0; border-radius:50%; border:1px solid rgba(139,92,246,.5);
  opacity:0;
}
.tm-play.is-playing .tm-play-ring{animation:tm-ring 2.4s ease-out infinite;}
.tm-play.is-playing .tm-play-ring--2{animation-delay:1.2s;}
@keyframes tm-ring{0%{opacity:.7;transform:scale(1)}100%{opacity:0;transform:scale(1.9)}}

/* why */
.tm-why{display:grid; grid-template-columns:1fr 1fr; gap:clamp(30px,6vw,80px); align-items:center;}
.tm-why-list{list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:6px;}
.tm-why-item{
  display:flex; align-items:center; gap:18px; padding:20px 22px; border-radius:16px;
  border:1px solid rgba(255,255,255,.06); background:rgba(255,255,255,.015);
  transition:.4s; cursor:default;
}
.tm-why-item:hover{border-color:rgba(139,92,246,.3);background:rgba(139,92,246,.06);transform:translateX(-6px);}
.tm-why-num{
  font-family:"Readex Pro",sans-serif; font-size:15px; color:var(--violet); font-weight:600;
  width:34px; flex-shrink:0;
}
.tm-why-text{font-size:16.5px; font-weight:400;}

/* final cta */
.tm-cta{position:relative; text-align:center; overflow:hidden; max-width:none; padding-block:clamp(110px,16vw,200px);}
.tm-cta-glow{
  position:absolute; inset:0; z-index:0; pointer-events:none;
  background:
    radial-gradient(50% 60% at 50% 50%,rgba(139,92,246,.2),transparent 70%),
    radial-gradient(40% 50% at 30% 60%,rgba(56,189,248,.12),transparent 70%);
}
.tm-breath--cta{top:50%; opacity:.6;}
.tm-cta-inner{position:relative; z-index:10;}
.tm-cta-title{font-size:clamp(34px,6.5vw,68px); line-height:1.15; font-weight:700; margin:0 0 40px; letter-spacing:-1px;}

/* footer */
.tm-footer{
  position:relative; z-index:10; border-top:1px solid rgba(255,255,255,.06);
  padding:40px clamp(20px,6vw,80px); display:flex; align-items:center; justify-content:space-between;
  flex-wrap:wrap; gap:16px;
}
.tm-footer p{color:var(--muted); font-size:13.5px; font-weight:300; margin:0;}

/* responsive */
@media (max-width:960px){
  .tm-grid-4{grid-template-columns:repeat(2,1fr);}
  .tm-why{grid-template-columns:1fr;}
}
@media (max-width:680px){
  .tm-grid-3{grid-template-columns:1fr;}
  .tm-grid-4{grid-template-columns:1fr;}
  .tm-player-controls{gap:16px;}
  .tm-hero-bg{background-position:center 65%;}
}
@media (prefers-reduced-motion:reduce){
  .tm-grain,.tm-fog,.tm-rain span,.tm-breath span,.tm-breath-core,.tm-wave.is-active span,
  .tm-play.is-playing .tm-play-ring,.tm-scroll-hint span,.tm-brand-dot{animation:none!important;}
}
`;
