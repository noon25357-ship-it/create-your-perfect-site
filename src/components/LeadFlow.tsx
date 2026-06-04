// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  LayoutDashboard, MessageSquare, Bot, Ticket, Send, Users, Share2, Tag,
  Sparkles, Search, Bell, ChevronLeft, ChevronRight, Menu, X, Globe,
  TrendingUp, TrendingDown, Phone, Clock, CheckCheck, ArrowUpRight,
  Plus, Filter, MoreHorizontal, Flame, UserCheck, CircleDot, Zap,
  Calendar, Eye, Reply, Target, Settings, Play, Star, Check, Shield,
  Activity, Inbox as InboxIcon, ArrowRight, Mic, Paperclip, Smile,
  Building2, Stethoscope, Utensils, GraduationCap, Briefcase, Headphones,
  Instagram, MessageCircle, AtSign, Music2, FileText, Workflow, Gauge,
  Brain, RefreshCw, PauseCircle, PlayCircle, BadgeCheck, ListChecks
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar
} from "recharts";

/* ============================== THEME / CSS ============================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Readex+Pro:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');

:root{
  --bg0:#05100B; --bg1:#08160F; --panel:#0B1D15; --panel2:#0E251A;
  --line:rgba(120,200,160,.10); --line2:rgba(120,200,160,.18);
  --wa:#25D366; --wa-dk:#1FA855; --teal:#0FD9A3; --teal2:#13B98C;
  --txt:#EAF6EF; --txt2:#9FBBAD; --txt3:#6A8377;
  --hot:#FF5C6B; --warm:#FFB23E; --cool:#46B0FF; --violet:#A98BFF;
  --glow:rgba(37,211,102,.35);
  --font-ar:"IBM Plex Sans Arabic","Readex Pro",sans-serif;
  --font-en:"Readex Pro","IBM Plex Sans Arabic",sans-serif;
  --mono:"JetBrains Mono",monospace;
}
*{box-sizing:border-box}
.wa-root{
  font-family:var(--font-ar); color:var(--txt);
  background:
    radial-gradient(1100px 600px at 85% -10%, rgba(37,211,102,.10), transparent 60%),
    radial-gradient(900px 500px at 0% 100%, rgba(15,217,163,.08), transparent 55%),
    var(--bg0);
  min-height:100vh; -webkit-font-smoothing:antialiased;
}
.wa-root[dir="ltr"]{font-family:var(--font-en)}
.wa-root::before{
  content:""; position:fixed; inset:0; pointer-events:none; z-index:0;
  background-image:linear-gradient(rgba(120,200,160,.025) 1px,transparent 1px),
    linear-gradient(90deg,rgba(120,200,160,.025) 1px,transparent 1px);
  background-size:46px 46px; mask-image:radial-gradient(circle at 50% 30%,#000,transparent 75%);
}
.mono{font-family:var(--mono);font-feature-settings:"tnum"}
.muted{color:var(--txt2)} .dim{color:var(--txt3)}

/* surfaces */
.card{
  background:linear-gradient(180deg, rgba(14,37,26,.85), rgba(11,29,21,.75));
  border:1px solid var(--line); border-radius:18px;
  backdrop-filter:blur(10px); position:relative;
}
.card.hov{transition:transform .25s cubic-bezier(.2,.8,.2,1),border-color .25s,box-shadow .25s}
.card.hov:hover{transform:translateY(-3px);border-color:var(--line2);box-shadow:0 18px 50px -25px rgba(0,0,0,.8)}
.glass{background:rgba(11,29,21,.6);border:1px solid var(--line);backdrop-filter:blur(14px)}

/* buttons */
.btn{display:inline-flex;align-items:center;gap:8px;font-family:inherit;font-weight:600;
  border-radius:12px;cursor:pointer;border:1px solid transparent;transition:.2s;font-size:14px;white-space:nowrap}
.btn-primary{background:linear-gradient(180deg,var(--wa),var(--wa-dk));color:#04140B;padding:11px 18px;
  box-shadow:0 10px 30px -10px var(--glow)}
.btn-primary:hover{filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 16px 40px -12px var(--glow)}
.btn-ghost{background:rgba(255,255,255,.04);color:var(--txt);border-color:var(--line);padding:10px 16px}
.btn-ghost:hover{background:rgba(255,255,255,.08);border-color:var(--line2)}
.btn-sm{padding:7px 12px;font-size:13px;border-radius:10px}
.btn-icon{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:12px;
  background:rgba(255,255,255,.04);border:1px solid var(--line);color:var(--txt2);cursor:pointer;transition:.2s}
.btn-icon:hover{color:var(--txt);background:rgba(255,255,255,.08);border-color:var(--line2)}

/* badges / pills */
.pill{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;
  padding:4px 10px;border-radius:999px;border:1px solid var(--line2)}
.tag{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:600;padding:3px 9px;border-radius:7px}

/* inputs */
.inp{width:100%;background:rgba(255,255,255,.03);border:1px solid var(--line);border-radius:12px;
  color:var(--txt);padding:11px 14px;font-family:inherit;font-size:14px;transition:.2s;outline:none}
.inp:focus{border-color:var(--wa);box-shadow:0 0 0 3px rgba(37,211,102,.12);background:rgba(255,255,255,.05)}
.inp::placeholder{color:var(--txt3)}
textarea.inp{resize:vertical;min-height:90px;line-height:1.6}
.lbl{font-size:12.5px;font-weight:600;color:var(--txt2);margin-bottom:7px;display:block}

/* nav */
.nav-item{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:13px;cursor:pointer;
  color:var(--txt2);font-weight:500;font-size:14.5px;transition:.18s;border:1px solid transparent;position:relative}
.nav-item:hover{color:var(--txt);background:rgba(255,255,255,.04)}
.nav-item.on{color:var(--txt);background:linear-gradient(90deg,rgba(37,211,102,.16),rgba(37,211,102,.02));
  border-color:rgba(37,211,102,.25)}
.nav-item.on::before{content:"";position:absolute;inset-inline-start:0;top:18%;bottom:18%;width:3px;border-radius:3px;
  background:var(--wa);box-shadow:0 0 14px var(--glow)}

/* progress */
.track{height:7px;border-radius:999px;background:rgba(255,255,255,.07);overflow:hidden}
.track>span{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--teal),var(--wa))}

/* table */
.tbl{width:100%;border-collapse:separate;border-spacing:0}
.tbl th{font-size:12px;color:var(--txt3);font-weight:600;text-align:start;padding:12px 14px;
  border-bottom:1px solid var(--line);white-space:nowrap}
.tbl td{padding:14px;border-bottom:1px solid rgba(120,200,160,.06);font-size:13.5px;vertical-align:middle}
.tbl tr:last-child td{border-bottom:none}
.tbl tbody tr{transition:background .15s}
.tbl tbody tr:hover{background:rgba(255,255,255,.025)}

/* misc */
.dot{width:8px;height:8px;border-radius:50%}
.scroll::-webkit-scrollbar{width:8px;height:8px}
.scroll::-webkit-scrollbar-thumb{background:rgba(120,200,160,.18);border-radius:8px}
.scroll::-webkit-scrollbar-track{background:transparent}
/* cinematic reveal: scroll-triggered */
.fade-up{opacity:0;transform:translateY(28px) scale(.985);will-change:transform,opacity;
  transition:opacity .9s cubic-bezier(.2,.8,.2,1), transform 1s cubic-bezier(.2,.8,.2,1)}
.fade-up.in-view{opacity:1;transform:none}
.reveal-stagger > *{opacity:0;transform:translateY(22px);transition:opacity .8s cubic-bezier(.2,.8,.2,1), transform .9s cubic-bezier(.2,.8,.2,1)}
.reveal-stagger.in-view > *{opacity:1;transform:none}
.reveal-stagger.in-view > *:nth-child(1){transition-delay:.04s}
.reveal-stagger.in-view > *:nth-child(2){transition-delay:.12s}
.reveal-stagger.in-view > *:nth-child(3){transition-delay:.20s}
.reveal-stagger.in-view > *:nth-child(4){transition-delay:.28s}
.reveal-stagger.in-view > *:nth-child(5){transition-delay:.36s}
.reveal-stagger.in-view > *:nth-child(6){transition-delay:.44s}
.reveal-stagger.in-view > *:nth-child(7){transition-delay:.52s}
.reveal-stagger.in-view > *:nth-child(8){transition-delay:.60s}

@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 rgba(37,211,102,.55)}50%{box-shadow:0 0 0 12px rgba(37,211,102,0)}}
.live-dot{animation:pulseGlow 2s infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes floatAlt{0%,100%{transform:translateY(0) translateX(0)}50%{transform:translateY(12px) translateX(-10px)}}
@keyframes auroraDrift{0%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(40px,-30px,0) scale(1.15)}100%{transform:translate3d(0,0,0) scale(1)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes gradientShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes textGlow{0%,100%{text-shadow:0 0 0 rgba(37,211,102,0)}50%{text-shadow:0 0 32px rgba(37,211,102,.35)}}

.aurora{position:absolute;border-radius:50%;filter:blur(80px);opacity:.55;pointer-events:none;
  animation:auroraDrift 14s ease-in-out infinite}
.aurora:nth-of-type(2){animation:floatAlt 18s ease-in-out infinite}

/* cinematic card hover */
.card.hov{transition:transform .5s cubic-bezier(.2,.8,.2,1),border-color .4s,box-shadow .5s,background .4s}
.card.hov:hover{transform:translateY(-6px) scale(1.012);border-color:rgba(37,211,102,.35);
  box-shadow:0 30px 70px -30px rgba(0,0,0,.9),0 0 0 1px rgba(37,211,102,.15),0 0 60px -20px rgba(37,211,102,.25)}

/* button shine */
.btn{position:relative;overflow:hidden;transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s,background .25s,border-color .25s !important}
.btn:hover{transform:translateY(-2px)}
.btn-primary:hover{box-shadow:0 14px 40px -14px rgba(37,211,102,.7),0 0 0 1px rgba(37,211,102,.4)}
.btn::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 30%,rgba(255,255,255,.18) 50%,transparent 70%);
  transform:translateX(-100%);transition:transform .8s cubic-bezier(.2,.8,.2,1);pointer-events:none}
.btn:hover::after{transform:translateX(100%)}

/* animated gradient headline */
.hero-grad{background:linear-gradient(110deg,var(--txt) 0%,var(--wa) 35%,var(--teal) 55%,var(--txt) 80%);
  background-size:200% auto;-webkit-background-clip:text;background-clip:text;color:transparent;
  animation:gradientShift 8s ease-in-out infinite}

/* hero entry */
.hero-in{opacity:0;transform:translateY(40px);animation:fadeUp 1.1s cubic-bezier(.2,.8,.2,1) .15s both}
.hero-in-2{opacity:0;transform:translateY(40px);animation:fadeUp 1.1s cubic-bezier(.2,.8,.2,1) .35s both}
.hero-in-3{opacity:0;transform:translateY(40px);animation:fadeUp 1.1s cubic-bezier(.2,.8,.2,1) .55s both}
.hero-in-4{opacity:0;transform:translateY(60px) scale(.96);animation:fadeUp 1.3s cubic-bezier(.2,.8,.2,1) .75s both}

/* parallax aurora wrapper */
.parallax-y{will-change:transform;transition:transform .15s linear}

/* sparkle pill */
.pill{transition:transform .3s, border-color .3s, background .3s}
.pill:hover{transform:translateY(-2px)}

/* table row hover lift */
.tbl tbody tr{transition:background .25s, transform .25s}
.tbl tbody tr:hover{background:rgba(37,211,102,.04);transform:translateX(2px)}

@media (prefers-reduced-motion: reduce){
  .fade-up,.reveal-stagger > *,.hero-in,.hero-in-2,.hero-in-3,.hero-in-4{opacity:1!important;transform:none!important;animation:none!important}
  .aurora,.hero-grad{animation:none!important}
}

/* chat bubbles */
.bub{max-width:78%;padding:9px 13px;border-radius:14px;font-size:13.5px;line-height:1.55;position:relative}
.bub.in{background:rgba(255,255,255,.06);border:1px solid var(--line);border-start-start-radius:4px}
.bub.out{background:linear-gradient(180deg,rgba(37,211,102,.22),rgba(37,211,102,.12));
  border:1px solid rgba(37,211,102,.3);border-start-end-radius:4px;margin-inline-start:auto}

.kpi-spark{position:absolute;inset-inline-end:14px;bottom:14px;width:88px;height:34px;opacity:.85}

/* responsive */
.sidebar{width:264px;flex-shrink:0}
.app-grid{display:flex;min-height:100vh;position:relative;z-index:1}
.backdrop{display:none}
@media(max-width:980px){
  .sidebar{position:fixed;top:0;bottom:0;inset-inline-start:0;z-index:60;transform:translateX(var(--off));transition:transform .3s}
  .wa-root[dir="rtl"] .sidebar{--off:110%}
  .wa-root[dir="ltr"] .sidebar{--off:-110%}
  .sidebar.open{transform:translateX(0)!important}
  .backdrop.show{display:block;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:55;backdrop-filter:blur(2px)}
  .hide-mob{display:none!important}
}
@media(min-width:981px){.menu-btn{display:none!important}}
.grid-auto{display:grid;gap:16px}

/* ===== Live Flow ===== */
@keyframes bubIn{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}
.bub-anim{animation:bubIn .4s cubic-bezier(.2,.8,.2,1) both}
@keyframes typingDot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-5px);opacity:1}}
.typing-dots{display:inline-flex;gap:4px;align-items:center;padding:10px 14px}
.typing-dots i{width:7px;height:7px;border-radius:50%;background:var(--wa);display:block;animation:typingDot 1.2s infinite}
.typing-dots i:nth-child(2){animation-delay:.18s}
.typing-dots i:nth-child(3){animation-delay:.36s}
.lf-phone{background:linear-gradient(180deg,#06140d,#040c08);border:1px solid var(--line2);border-radius:24px;overflow:hidden;display:flex;flex-direction:column}
.lf-chat{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:9px;background:
  radial-gradient(circle at 20% 0%,rgba(37,211,102,.05),transparent 60%)}
.src-chip{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;
  padding:4px 10px;border-radius:999px;border:1px solid var(--line2)}
.step{display:flex;gap:13px;padding:13px 14px;border-radius:14px;border:1px solid var(--line);
  background:rgba(255,255,255,.02);transition:all .45s cubic-bezier(.2,.8,.2,1);opacity:.4;transform:translateY(4px)}
.step.on{opacity:1;transform:none;border-color:rgba(37,211,102,.35);background:linear-gradient(135deg,rgba(37,211,102,.1),rgba(11,29,21,.5))}
.step.cur{border-color:var(--wa);box-shadow:0 0 0 1px var(--wa),0 14px 40px -18px rgba(37,211,102,.7)}
.step-ic{width:40px;height:40px;border-radius:11px;display:grid;place-items:center;flex-shrink:0;
  background:rgba(255,255,255,.04);color:var(--txt3);transition:all .45s}
.step.on .step-ic{background:rgba(37,211,102,.16);color:var(--wa)}
.step-check{margin-inline-start:auto;color:var(--wa);opacity:0;transform:scale(.5);transition:all .4s .1s}
.step.on .step-check{opacity:1;transform:scale(1)}
.lf-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:20px;align-items:start}
@media(max-width:900px){.lf-grid{grid-template-columns:1fr}}
`;

/* ============================== i18n ============================== */
const T = {
  ar: {
    brand: "LeadFlow", tagline: "وكيل مبيعات ذكي على واتساب",
    nav: { liveflow:"العرض الحي", dashboard:"لوحة التحكم", inbox:"المحادثات", agent:"إعداد البوت", tickets:"التذاكر", campaigns:"الحملات", leads:"العملاء المحتملون", social:"فرص السوشال", pricing:"الباقات" },
    enterApp:"ادخل للنظام", bookDemo:"احجز ديمو", demoBadge:"وضع تجريبي", search:"بحث...",
    // landing
    heroTitle:"حوّل واتساب من صندوق رسائل إلى فريق مبيعات ذكي",
    heroSub:"وكيل ذكاء اصطناعي يرد على عملائك، يصنّفهم، يفتح التذاكر، يطلق الحملات، ويرفع لك التقارير — كل ذلك داخل منصة واحدة.",
    heroNote:"عربي أولاً • يعمل على WhatsApp Business API • جاهز خلال أيام",
    problemKicker:"المشكلة",
    problemTitle:"واتساب مليان عملاء... والمبيعات تضيع",
    problems:[
      ["رسائل كثيرة","عشرات الاستفسارات يومياً ولا أحد يلحق عليها."],
      ["ردود متأخرة","العميل ينتظر ساعات، وينتقل لمنافسك."],
      ["عملاء يضيعون","لا قائمة، لا متابعة، لا أحد يعرف من هو العميل الجاهز للشراء."],
      ["لا يوجد تتبع","صفر تقارير، صفر تصنيف، قرارات بالحدس."],
    ],
    solutionKicker:"الحل",
    solutionTitle:"وكيل مبيعات يعمل 24/7 بدل صندوق الرسائل",
    solutions:[
      ["يرد فوراً","ردود ذكية بنبرة شركتك على مدار الساعة.",Bot],
      ["يصنّف العملاء","جديد / مهتم / ساخن / يحتاج متابعة تلقائياً.",Tag],
      ["يفتح تذاكر","يحوّل الطلبات المعقّدة لتذاكر بأولويات.",Ticket],
      ["يطلق حملات","رسائل موجّهة لشرائح محددة بضغطة زر.",Send],
      ["يرفع تقارير","لوحة تحكم حية: محادثات، تحويل، مصادر.",LayoutDashboard],
      ["يسلّم لموظف","تصعيد ذكي للموظف البشري وقت الحاجة.",Headphones],
    ],
    featuresKicker:"المميزات", howKicker:"كيف يعمل", useKicker:"حالات الاستخدام",
    howTitle:"ثلاث خطوات وأنت جاهز",
    how:[
      ["اربط واتساب","نوصل رقمك عبر WhatsApp Business API بأمان."],
      ["درّب البوت","حدّد مجالك، نبرتك، أسئلتك، وقواعد التصعيد."],
      ["ابدأ البيع","البوت يرد، يصنّف، ويرفع لك العملاء الجاهزين."],
    ],
    useCases:[
      ["العقار","تأهيل المهتمين بالعقارات وحجز المعاينات.",Building2],
      ["العيادات","حجوزات، استفسارات، ومتابعة المرضى.",Stethoscope],
      ["المطاعم","الطلبات، الحجوزات، والعروض.",Utensils],
      ["مراكز التدريب","التسجيل في الدورات والاستفسارات.",GraduationCap],
      ["شركات الخدمات","عروض الأسعار وتأهيل الطلبات.",Briefcase],
      ["التجزئة","الاستفسارات، التوفّر، والمبيعات.",Tag],
    ],
    ctaTitle:"جاهز تحوّل واتساب لقناة مبيعات حقيقية؟",
    ctaSub:"احجز ديمو 15 دقيقة وشف المنصة شغّالة على بياناتك.",
    landingFeatures:[
      ["وكيل AI عربي","يفهم اللهجة ويرد باحتراف."],
      ["تصنيف لحظي","درجة عميل من 100 لكل محادثة."],
      ["نظام تذاكر","لا يضيع طلب بعد اليوم."],
      ["حملات موجّهة","شرائح + جدولة + مؤشرات."],
      ["CRM مدمج","كل عملائك في مكان واحد."],
      ["تقارير حية","قرارات مبنية على أرقام."],
    ],
    // dashboard
    dashTitle:"لوحة التحكم", dashSub:"نظرة شاملة على أداء قناة واتساب اليوم",
    kpis:{ conv:"المحادثات", newLeads:"عملاء جدد", tickets:"تذاكر مفتوحة", camps:"حملات نشطة", rate:"معدل التحويل", resp:"متوسط زمن الرد" },
    convOverTime:"المحادثات خلال الأسبوع", leadSources:"أفضل مصادر العملاء", funnel:"قمع التحويل", recentConv:"محادثات أخيرة", topAgents:"أداء البوت مقابل الموظفين",
    // inbox
    inboxTitle:"المحادثات", aiSummary:"ملخص AI للمحادثة", toTicket:"تحويل لتذكرة", toHuman:"تسليم لموظف", suggested:"ردود مقترحة من AI", typeMsg:"اكتب رسالة...", assignedAI:"يرد عليه: الوكيل الذكي",
    statuses:{ new:"جديد", interested:"مهتم", hot:"ساخن", followup:"يحتاج متابعة", closed:"مغلق" },
    // agent builder
    agentTitle:"إعداد الوكيل الذكي", agentSub:"درّب بوت المبيعات الخاص بشركتك",
    botName:"اسم البوت", tone:"نبرة الرد", industry:"مجال الشركة", faqs:"الأسئلة الشائعة", escRules:"قواعد التصعيد للموظف", ticketRules:"متى يفتح تذكرة", hotRules:"متى يصنّف العميل ساخن",
    tones:["ودّي ومحترف","رسمي","مرِح وقريب","مختصر ومباشر"],
    industries:["عقار","عيادة","مطعم","مركز تدريب","خدمات","تجزئة"],
    addFaq:"أضف سؤال", saveBot:"حفظ وتفعيل", testBot:"جرّب البوت", livePreview:"معاينة حية",
    // tickets
    ticketsTitle:"نظام التذاكر", ticketsSub:"تابع وحل كل طلبات العملاء بدون ما يضيع شي",
    tStatus:{ open:"مفتوحة", progress:"قيد المعالجة", closed:"مغلقة" },
    priority:{ low:"منخفضة", med:"متوسطة", high:"عالية" },
    cols:{ id:"رقم", subject:"الموضوع", customer:"العميل", priority:"الأولوية", agent:"الموظف", source:"المصدر", last:"آخر تواصل", status:"الحالة" },
    // campaigns
    campTitle:"حملات واتساب", campSub:"أرسل رسائل موجّهة لشرائح عملائك وقِس النتائج",
    newCamp:"حملة جديدة", segment:"شريحة العملاء", message:"نص الرسالة", schedule:"جدولة الإرسال", launch:"إطلاق الحملة",
    cmetrics:{ sent:"تم الإرسال", opened:"تم الفتح", replied:"تم الرد", converted:"التحويل" },
    activeCamps:"الحملات", segments:["كل العملاء","عملاء ساخنون","يحتاجون متابعة","عملاء سابقون","لم يكملوا الشراء"],
    // leads
    leadsTitle:"العملاء المحتملون (CRM)", leadsSub:"كل عملائك في جدول واحد مع تصنيف ودرجة ذكية",
    lcols:{ name:"الاسم", phone:"الجوال", source:"المصدر", class:"التصنيف", interest:"الاهتمام", last:"آخر تواصل", score:"الدرجة", notes:"ملاحظات AI" },
    addLead:"إضافة عميل", export:"تصدير",
    // social
    socialTitle:"تصنيف فرص السوشال", socialSub:"نلتقط الفرص من منصاتك ونصنّفها تلقائياً (تجريبي)",
    scols:{ source:"المصدر", text:"النص", class:"التصنيف", prio:"الأولوية", action:"إجراء مقترح" },
    sClasses:{ service:"طلب خدمة", complaint:"شكوى", interest:"اهتمام", question:"سؤال", sale:"فرصة بيع" },
    // pricing
    pricingTitle:"باقات تناسب نمو شركتك", pricingSub:"اشتراك شهري واضح — تكلفة رسائل واتساب الرسمية منفصلة حسب Meta / مزوّد BSP.",
    perMonth:"/ شهرياً", mostPopular:"الأكثر طلباً", choosePlan:"اختر الباقة", metaNote:"رسوم محادثات واتساب الرسمية (Meta) تُحتسب على المصاريف الفعلية حسب مزوّد BSP وغير مشمولة في الاشتراك.",
    plans:[
      ["Starter","للشركات الصغيرة","299","SAR",["رقم واتساب واحد","وكيل AI أساسي","حتى 1,000 محادثة/شهر","تصنيف عملاء","نظام تذاكر","مستخدم واحد"]],
      ["Growth","للشركات النامية","799","SAR",["3 أرقام واتساب","وكيل AI متقدّم + نبرة مخصصة","حتى 6,000 محادثة/شهر","حملات + جدولة","CRM كامل + درجات","حتى 5 مستخدمين","تقارير متقدمة"]],
      ["Enterprise","للشركات الكبيرة","تواصل معنا","",["أرقام غير محدودة","وكيل AI مخصّص + تدريب","محادثات غير محدودة","فرق ومستخدمون غير محدودين","تكامل API + Webhooks","مدير حساب مخصّص","SLA واتفاقية مستوى خدمة"]],
    ],
    // shared
    viewAll:"عرض الكل", today:"اليوم", thisWeek:"هذا الأسبوع", thisMonth:"هذا الشهر",
    score:"الدرجة", min:"دقيقة", vsLast:"مقارنة بالفترة السابقة", online:"متصل", logout:"خروج",
    footer:"منتج SaaS — يُباع كاشتراك شهري لعدة شركات.", backHome:"الرئيسية",
    // AI Sales Agent moat (landing)
    moatKicker:"الميزة الأساسية", moatTitle:"مو مجرد بوت رد آلي — هذا وكيل مبيعات يفكّر",
    moatSub:"الفرق بيننا وبين أي أداة واتساب ثانية: الوكيل يقرأ المحادثة، يفهم النية، يقيّم العميل، ويتصرّف لحاله.",
    moat:[
      ["يقرأ المحادثة كاملة","يفهم سياق الكلام واللهجة، مو كلمات مفتاحية.",Brain],
      ["يقيّم العميل من 100","درجة شرائية لحظية لكل عميل بناءً على سلوكه.",Gauge],
      ["يستخرج نية الشراء","يميّز بين سؤال عابر وعميل جاهز يدفع.",Target],
      ["يقترح الرد الأنسب","رد جاهز بنبرة شركتك — توافق بضغطة.",Sparkles],
      ["يفتح التذكرة تلقائياً","يحوّل العميل الجاهز لتذكرة ويصعّدها للموظف.",Ticket],
    ],
    srcKicker:"مصادر العملاء", srcTitle:"كل عملائك من كل منصّة — في مكان واحد",
    srcSub:"نلتقط الرسائل من كل قنواتك، والـ AI يصنّفها تلقائياً ويحوّل الجاد منها لعميل في الـ CRM.",
    srcAuto:"يصنّفها AI تلقائياً",
    // Live Flow
    lf:{
      title:"العرض الحي — رحلة عميل كاملة", sub:"شف كيف يتحوّل عميل واتساب من رسالة إلى صفقة — تلقائياً، خطوة بخطوة.",
      play:"شغّل العرض", replay:"إعادة", pause:"إيقاف مؤقت", live:"مباشر",
      watchLive:"شاهد العرض الحي",
      chatTitle:"محادثة واتساب", analysis:"تحليل الوكيل الذكي", pipeline:"مسار المعالجة التلقائي",
      intentLabel:"النية الشرائية", scoreLabel:"درجة العميل", classLabel:"التصنيف", typing:"الوكيل يكتب...",
      intentVal:"شراء شقة + جاهز لمعاينة هذا الأسبوع", classHot:"عميل ساخن 🔥",
      via:"عبر", done:"تمت", autoBadge:"تلقائي",
      steps:[
        ["وصلت رسالة","عميل جديد راسلك من إعلان انستقرام.",MessageCircle],
        ["رد فوري بالـ AI","الوكيل رحّب وبدأ يأهّل العميل خلال ثانية.",Bot],
        ["تحليل وتقييم","قرأ المحادثة، استخرج النية، وأعطى درجة 91/100.",Brain],
        ["تصنيف: ساخن","صنّفه عميل ساخن جاهز للإغلاق.",Flame],
        ["فتح تذكرة","فتح تذكرة TK-1043 وربطها بالعميل تلقائياً.",Ticket],
        ["تحويل لموظف","صعّد التذكرة للموظف خالد لإتمام المعاينة.",UserCheck],
        ["تسجيل + متابعة","سجّله في الـ CRM وجدول متابعة تلقائية بعد يومين.",RefreshCw],
      ],
      ticketId:"TK-1043", agentName:"خالد", followupNote:"متابعة تلقائية بعد يومين إذا ما تم الحجز",
      crmNote:"أُضيف للـ CRM — مصدر: انستقرام، اهتمام: شقة النرجس",
      script:[
        {k:"in", x:"السلام عليكم، شفت إعلانكم بانستقرام عن شقق النرجس 🏢", tm:"2:14"},
        {k:"typing"},
        {k:"out", x:"وعليكم السلام 👋 أهلاً فيك! شقق النرجس تبدأ من 850 ألف، تشطيب فاخر و3 غرف. تحب تفاصيل أكثر؟", tm:"2:14"},
        {k:"in", x:"إي، وكم الدفعة الأولى؟ وفيه تمويل؟", tm:"2:15"},
        {k:"typing"},
        {k:"out", x:"الدفعة الأولى 10% ونوفّر تمويل عقاري حتى 25 سنة. تنفع أرتب لك معاينة هالأسبوع؟", tm:"2:15"},
        {k:"in", x:"تمام، السبت العصر يناسبني 👍", tm:"2:16"},
        {k:"analyze"},
        {k:"ticket"},
        {k:"human"},
        {k:"crm"},
      ],
    },
  },
  en: {
    brand:"LeadFlow", tagline:"AI WhatsApp Sales Agent",
    nav:{ liveflow:"Live Flow", dashboard:"Dashboard", inbox:"Conversations", agent:"AI Agent", tickets:"Tickets", campaigns:"Campaigns", leads:"Leads CRM", social:"Social Leads", pricing:"Pricing" },
    enterApp:"Enter App", bookDemo:"Book a Demo", demoBadge:"Demo Mode", search:"Search...",
    heroTitle:"Turn WhatsApp from an inbox into a smart sales team",
    heroSub:"An AI agent that replies, qualifies leads, opens tickets, launches campaigns and reports back — all in one platform.",
    heroNote:"Arabic-first • Runs on WhatsApp Business API • Live in days",
    problemKicker:"The Problem",
    problemTitle:"WhatsApp is full of leads… and sales leak away",
    problems:[
      ["Too many messages","Dozens of inquiries daily, no one keeps up."],
      ["Slow replies","Customers wait hours and move to a competitor."],
      ["Lost leads","No list, no follow-up, no idea who's ready to buy."],
      ["No tracking","Zero reports, zero scoring, gut-feel decisions."],
    ],
    solutionKicker:"The Solution",
    solutionTitle:"A sales agent working 24/7 instead of an inbox",
    solutions:[
      ["Replies instantly","Smart replies in your brand's tone, around the clock.",Bot],
      ["Qualifies leads","New / Interested / Hot / Follow-up automatically.",Tag],
      ["Opens tickets","Turns complex requests into prioritized tickets.",Ticket],
      ["Runs campaigns","Targeted messages to segments in one click.",Send],
      ["Reports live","Live dashboard: chats, conversion, sources.",LayoutDashboard],
      ["Hands off","Smart escalation to a human agent when needed.",Headphones],
    ],
    featuresKicker:"Features", howKicker:"How it works", useKicker:"Use Cases",
    howTitle:"Three steps and you're live",
    how:[
      ["Connect WhatsApp","We link your number via WhatsApp Business API, securely."],
      ["Train the bot","Set your industry, tone, FAQs and escalation rules."],
      ["Start selling","The bot replies, qualifies and surfaces ready leads."],
    ],
    useCases:[
      ["Real Estate","Qualify property leads and book viewings.",Building2],
      ["Clinics","Bookings, inquiries and patient follow-up.",Stethoscope],
      ["Restaurants","Orders, reservations and offers.",Utensils],
      ["Training Centers","Course sign-ups and inquiries.",GraduationCap],
      ["Service Firms","Quotes and request qualification.",Briefcase],
      ["Retail","Inquiries, availability and sales.",Tag],
    ],
    ctaTitle:"Ready to turn WhatsApp into a real sales channel?",
    ctaSub:"Book a 15-minute demo and see the platform run on your data.",
    landingFeatures:[
      ["Arabic AI agent","Understands dialect, replies professionally."],
      ["Instant scoring","A 0–100 lead score per conversation."],
      ["Ticketing","No request ever slips again."],
      ["Targeted campaigns","Segments + scheduling + metrics."],
      ["Built-in CRM","All your leads in one place."],
      ["Live reports","Decisions backed by numbers."],
    ],
    dashTitle:"Dashboard", dashSub:"A full view of your WhatsApp channel performance today",
    kpis:{ conv:"Conversations", newLeads:"New Leads", tickets:"Open Tickets", camps:"Active Campaigns", rate:"Conversion Rate", resp:"Avg. Response Time" },
    convOverTime:"Conversations this week", leadSources:"Top Lead Sources", funnel:"Conversion Funnel", recentConv:"Recent Conversations", topAgents:"Bot vs Human Performance",
    inboxTitle:"Conversations", aiSummary:"AI Conversation Summary", toTicket:"Convert to Ticket", toHuman:"Hand to Agent", suggested:"AI Suggested Replies", typeMsg:"Type a message...", assignedAI:"Handled by: AI Agent",
    statuses:{ new:"New", interested:"Interested", hot:"Hot", followup:"Follow-up", closed:"Closed" },
    agentTitle:"AI Agent Builder", agentSub:"Train your company's sales bot",
    botName:"Bot Name", tone:"Reply Tone", industry:"Industry", faqs:"FAQs", escRules:"Escalation Rules", ticketRules:"When to open a ticket", hotRules:"When to mark a Hot Lead",
    tones:["Friendly & professional","Formal","Fun & casual","Short & direct"],
    industries:["Real Estate","Clinic","Restaurant","Training","Services","Retail"],
    addFaq:"Add FAQ", saveBot:"Save & Activate", testBot:"Test Bot", livePreview:"Live Preview",
    ticketsTitle:"Ticketing System", ticketsSub:"Track and resolve every request — nothing slips",
    tStatus:{ open:"Open", progress:"In Progress", closed:"Closed" },
    priority:{ low:"Low", med:"Medium", high:"High" },
    cols:{ id:"ID", subject:"Subject", customer:"Customer", priority:"Priority", agent:"Agent", source:"Source", last:"Last contact", status:"Status" },
    campTitle:"WhatsApp Campaigns", campSub:"Send targeted messages to segments and measure results",
    newCamp:"New Campaign", segment:"Audience Segment", message:"Message", schedule:"Schedule", launch:"Launch Campaign",
    cmetrics:{ sent:"Sent", opened:"Opened", replied:"Replied", converted:"Converted" },
    activeCamps:"Campaigns", segments:["All customers","Hot leads","Need follow-up","Past customers","Abandoned purchase"],
    leadsTitle:"Leads CRM", leadsSub:"All your leads in one table with smart classification and scoring",
    lcols:{ name:"Name", phone:"Phone", source:"Source", class:"Class", interest:"Interest", last:"Last contact", score:"Score", notes:"AI notes" },
    addLead:"Add Lead", export:"Export",
    socialTitle:"Social Lead Classification", socialSub:"We capture opportunities from your channels and classify them (beta)",
    scols:{ source:"Source", text:"Text", class:"Class", prio:"Priority", action:"Suggested action" },
    sClasses:{ service:"Service request", complaint:"Complaint", interest:"Interest", question:"Question", sale:"Sales opportunity" },
    pricingTitle:"Plans that fit your growth", pricingSub:"Clear monthly subscription — official WhatsApp message fees are separate per Meta / BSP provider.",
    perMonth:"/ month", mostPopular:"Most popular", choosePlan:"Choose plan", metaNote:"Official WhatsApp conversation fees (Meta) are billed on actual usage via your BSP provider and are not included in the subscription.",
    plans:[
      ["Starter","For small businesses","299","SAR",["1 WhatsApp number","Basic AI agent","Up to 1,000 chats/mo","Lead classification","Ticketing","1 user"]],
      ["Growth","For growing businesses","799","SAR",["3 WhatsApp numbers","Advanced AI + custom tone","Up to 6,000 chats/mo","Campaigns + scheduling","Full CRM + scoring","Up to 5 users","Advanced reports"]],
      ["Enterprise","For large businesses","Contact us","",["Unlimited numbers","Custom AI + training","Unlimited chats","Unlimited teams & users","API + Webhooks","Dedicated account manager","SLA & service agreement"]],
    ],
    viewAll:"View all", today:"Today", thisWeek:"This week", thisMonth:"This month",
    score:"Score", min:"min", vsLast:"vs previous period", online:"Online", logout:"Sign out",
    footer:"A SaaS product — sold as a monthly subscription to multiple companies.", backHome:"Home",
    moatKicker:"The core advantage", moatTitle:"Not a canned auto-reply bot — a sales agent that thinks",
    moatSub:"What sets us apart from any other WhatsApp tool: the agent reads the conversation, understands intent, scores the lead, and acts on its own.",
    moat:[
      ["Reads the full chat","Understands context and dialect, not just keywords.",Brain],
      ["Scores leads out of 100","A live buying score for every lead from their behavior.",Gauge],
      ["Extracts buying intent","Tells a casual question from a ready-to-pay buyer.",Target],
      ["Suggests the best reply","A ready reply in your brand tone — approve in one tap.",Sparkles],
      ["Opens tickets automatically","Converts a ready lead into a ticket and escalates it.",Ticket],
    ],
    srcKicker:"Lead sources", srcTitle:"Every lead, every channel — in one place",
    srcSub:"We capture messages from all your channels, and the AI classifies them automatically, pushing serious ones into the CRM.",
    srcAuto:"Auto-classified by AI",
    lf:{
      title:"Live Flow — a full customer journey", sub:"Watch a WhatsApp lead turn from a message into a deal — automatically, step by step.",
      play:"Play demo", replay:"Replay", pause:"Pause", live:"LIVE",
      watchLive:"Watch the live flow",
      chatTitle:"WhatsApp chat", analysis:"AI Agent analysis", pipeline:"Automated pipeline",
      intentLabel:"Buying intent", scoreLabel:"Lead score", classLabel:"Classification", typing:"Agent is typing...",
      intentVal:"Buy an apartment + ready to view this week", classHot:"Hot lead 🔥",
      via:"via", done:"done", autoBadge:"auto",
      steps:[
        ["Message received","A new lead messaged you from an Instagram ad.",MessageCircle],
        ["Instant AI reply","The agent greeted and started qualifying within a second.",Bot],
        ["Analyze & score","Read the chat, extracted intent, scored it 91/100.",Brain],
        ["Classified: Hot","Tagged as a hot lead ready to close.",Flame],
        ["Ticket opened","Opened ticket TK-1043 and linked the lead automatically.",Ticket],
        ["Hand to human","Escalated to agent Khalid to complete the viewing.",UserCheck],
        ["Log + follow-up","Saved to CRM and scheduled an auto follow-up in 2 days.",RefreshCw],
      ],
      ticketId:"TK-1043", agentName:"Khalid", followupNote:"Auto follow-up in 2 days if not booked",
      crmNote:"Added to CRM — source: Instagram, interest: Al-Narjis apartment",
      script:[
        {k:"in", x:"Hi, I saw your Instagram ad about the Al-Narjis apartments 🏢", tm:"2:14"},
        {k:"typing"},
        {k:"out", x:"Hello 👋 Welcome! Al-Narjis apartments start at 850K, premium finishing, 3 bedrooms. Want more details?", tm:"2:14"},
        {k:"in", x:"Yes, and what's the down payment? Any financing?", tm:"2:15"},
        {k:"typing"},
        {k:"out", x:"Down payment is 10% and we offer mortgages up to 25 years. Can I arrange a viewing this week?", tm:"2:15"},
        {k:"in", x:"Sure, Saturday afternoon works for me 👍", tm:"2:16"},
        {k:"analyze"},
        {k:"ticket"},
        {k:"human"},
        {k:"crm"},
      ],
    },
  },
};

/* ============================== DEMO DATA ============================== */
const STATUS_COLOR = { new:"var(--cool)", interested:"var(--teal)", hot:"var(--hot)", followup:"var(--warm)", closed:"var(--txt3)" };
const PRIO_COLOR = { low:"var(--cool)", med:"var(--warm)", high:"var(--hot)" };
const SCLASS_COLOR = { service:"var(--cool)", complaint:"var(--hot)", interest:"var(--teal)", question:"var(--violet)", sale:"var(--wa)" };

const SOURCES = { ar:["إعلان واتساب","X / تويتر","انستقرام","موقع الشركة","إحالة","تيك توك","قوقل"], en:["WhatsApp Ad","X / Twitter","Instagram","Website","Referral","TikTok","Google"] };

const CONV_WEEK = [
  { d:{ar:"السبت",en:"Sat"}, v:42 }, { d:{ar:"الأحد",en:"Sun"}, v:58 }, { d:{ar:"الإثنين",en:"Mon"}, v:71 },
  { d:{ar:"الثلاثاء",en:"Tue"}, v:64 }, { d:{ar:"الأربعاء",en:"Wed"}, v:89 }, { d:{ar:"الخميس",en:"Thu"}, v:97 }, { d:{ar:"الجمعة",en:"Fri"}, v:76 },
];
const SOURCE_DATA = [
  { n:{ar:"إعلان واتساب",en:"WhatsApp Ad"}, v:38, c:"#25D366" },
  { n:{ar:"انستقرام",en:"Instagram"}, v:27, c:"#A98BFF" },
  { n:{ar:"الموقع",en:"Website"}, v:18, c:"#46B0FF" },
  { n:{ar:"إحالة",en:"Referral"}, v:11, c:"#FFB23E" },
  { n:{ar:"تيك توك",en:"TikTok"}, v:6, c:"#0FD9A3" },
];
const FUNNEL = [
  { s:{ar:"محادثات",en:"Chats"}, v:486, c:"#46B0FF" },
  { s:{ar:"مهتمون",en:"Interested"}, v:243, c:"#0FD9A3" },
  { s:{ar:"عملاء ساخنون",en:"Hot leads"}, v:118, c:"#FFB23E" },
  { s:{ar:"صفقات",en:"Deals"}, v:57, c:"#25D366" },
];
const sparkData = (seed) => Array.from({length:12},(_,i)=>({v: 20 + ((Math.sin(i*1.3+seed)*0.5+0.5)*60) + (i*2)}));

const CONVS = [
  { id:1, name:"محمد العتيبي", nameEn:"Mohammed Alotaibi", last:"تمام، أبي أعرف الأسعار للفيلا", lastEn:"Sure, I want the villa pricing", time:"11:24", unread:2, status:"hot", score:88, src:0,
    summary:{ ar:"عميل مهتم بفيلا في حي الياسمين، ميزانية 1.8م، جاهز لمعاينة هذا الأسبوع. أبدى استعجال.", en:"Lead interested in a villa in Al-Yasmin, budget 1.8M, ready to view this week. Showed urgency." },
    msgs:[
      {t:"in",x:"السلام عليكم، شفت إعلانكم عن الفلل",xe:"Hi, I saw your ad about villas",tm:"11:02"},
      {t:"out",x:"وعليكم السلام 👋 أهلاً فيك! عندنا فلل في الياسمين والنرجس. أي حي يناسبك؟",xe:"Hello 👋 Welcome! We have villas in Al-Yasmin and Al-Narjis. Which area suits you?",tm:"11:03"},
      {t:"in",x:"الياسمين، وكم السعر؟",xe:"Al-Yasmin, and the price?",tm:"11:20"},
      {t:"out",x:"تبدأ من 1.75 مليون. تحب أرتب لك معاينة؟",xe:"Starts at 1.75M. Want me to arrange a viewing?",tm:"11:21"},
      {t:"in",x:"تمام، أبي أعرف الأسعار للفيلا",xe:"Sure, I want the villa pricing",tm:"11:24"},
    ]},
  { id:2, name:"سارة القحطاني", nameEn:"Sara Alqahtani", last:"ممكن موعد بكرة الصبح؟", lastEn:"Can I get an appointment tomorrow morning?", time:"10:48", unread:0, status:"interested", score:72, src:2,
    summary:{ ar:"تستفسر عن جلسة تنظيف بشرة، تفضّل صباح الغد. لم تؤكد الحجز بعد.", en:"Asking about a facial session, prefers tomorrow morning. Booking not confirmed yet." },
    msgs:[
      {t:"in",x:"مرحبا، عندكم تنظيف بشرة؟",xe:"Hi, do you offer facial cleaning?",tm:"10:40"},
      {t:"out",x:"أهلاً 🌿 نعم متوفّر، الجلسة 45 دقيقة. تفضّلين أي يوم؟",xe:"Hello 🌿 Yes available, 45-min session. Which day works?",tm:"10:41"},
      {t:"in",x:"ممكن موعد بكرة الصبح؟",xe:"Can I get an appointment tomorrow morning?",tm:"10:48"},
    ]},
  { id:3, name:"عبدالرحمن الدوسري", nameEn:"Abdulrahman Aldosari", last:"شكراً، بفكر وأرجع لكم", lastEn:"Thanks, I'll think and get back", time:"09:15", unread:0, status:"followup", score:54, src:1,
    summary:{ ar:"استفسر عن باقة تدريب القيادة، السعر مناسب لكنه متردد. يحتاج متابعة بعد يومين.", en:"Asked about a leadership training package, price ok but hesitant. Needs follow-up in 2 days." },
    msgs:[
      {t:"in",x:"كم سعر دورة القيادة؟",xe:"How much is the leadership course?",tm:"09:05"},
      {t:"out",x:"الدورة 2,400 ريال شاملة الشهادة. فيه خصم مبكر 15%.",xe:"It's 2,400 SAR incl. certificate. 15% early-bird discount.",tm:"09:07"},
      {t:"in",x:"شكراً، بفكر وأرجع لكم",xe:"Thanks, I'll think and get back",tm:"09:15"},
    ]},
  { id:4, name:"نورة الشمري", nameEn:"Noura Alshammari", last:"وصل الطلب، شكراً 🙏", lastEn:"Order arrived, thank you 🙏", time:"أمس", timeEn:"Yest.", unread:0, status:"closed", score:40, src:3,
    summary:{ ar:"عميلة سابقة، استلمت طلبها وأبدت رضا. فرصة لطلب تقييم أو بيع إضافي.", en:"Returning customer, received her order and was satisfied. Chance for a review or upsell." },
    msgs:[
      {t:"in",x:"متى يوصل الطلب؟",xe:"When will the order arrive?",tm:"أمس"},
      {t:"out",x:"خلال 24 ساعة 🚚 وبيوصلك تتبّع.",xe:"Within 24h 🚚 you'll get tracking.",tm:"أمس"},
      {t:"in",x:"وصل الطلب، شكراً 🙏",xe:"Order arrived, thank you 🙏",tm:"أمس"},
    ]},
  { id:5, name:"فهد المالكي", nameEn:"Fahad Almalki", last:"السلام عليكم", lastEn:"Hello", time:"08:02", unread:1, status:"new", score:18, src:6,
    summary:{ ar:"محادثة جديدة، لم يحدد طلبه بعد. الوكيل بدأ التأهيل.", en:"New conversation, request not yet defined. Agent started qualifying." },
    msgs:[
      {t:"in",x:"السلام عليكم",xe:"Hello",tm:"08:02"},
      {t:"out",x:"وعليكم السلام ومرحباً بك 👋 كيف أقدر أساعدك اليوم؟",xe:"Hello and welcome 👋 How can I help you today?",tm:"08:02"},
    ]},
];
const SUGGESTED = {
  ar:["أرتب لك معاينة الفيلا غداً الساعة 5 عصراً؟ 🏡","أرسل لك كتيّب الأسعار الكامل الحين؟","تبي أحجز لك الموعد المبدئي وأأكد لك لاحقاً؟"],
  en:["Shall I book a villa viewing tomorrow at 5pm? 🏡","Want me to send the full price list now?","I can hold a tentative slot and confirm later — ok?"],
};

const TICKETS = [
  { id:"TK-1042", subj:{ar:"طلب معاينة فيلا الياسمين",en:"Villa viewing request – Al-Yasmin"}, cust:"محمد العتيبي", custEn:"Mohammed Alotaibi", prio:"high", agent:{ar:"خالد",en:"Khalid"}, src:0, last:{ar:"قبل 12 د",en:"12m ago"}, status:"open" },
  { id:"TK-1041", subj:{ar:"تأكيد حجز جلسة بشرة",en:"Confirm facial booking"}, cust:"سارة القحطاني", custEn:"Sara Alqahtani", prio:"med", agent:{ar:"ريم",en:"Reem"}, src:2, last:{ar:"قبل 40 د",en:"40m ago"}, status:"progress" },
  { id:"TK-1040", subj:{ar:"استفسار عن خصم الدورة",en:"Course discount inquiry"}, cust:"عبدالرحمن الدوسري", custEn:"Abdulrahman Aldosari", prio:"low", agent:{ar:"الوكيل AI",en:"AI Agent"}, src:1, last:{ar:"قبل ساعة",en:"1h ago"}, status:"progress" },
  { id:"TK-1039", subj:{ar:"شكوى تأخر توصيل",en:"Delivery delay complaint"}, cust:"نورة الشمري", custEn:"Noura Alshammari", prio:"high", agent:{ar:"خالد",en:"Khalid"}, src:3, last:{ar:"قبل 3 س",en:"3h ago"}, status:"open" },
  { id:"TK-1038", subj:{ar:"طلب عرض سعر تصميم",en:"Design quote request"}, cust:"فهد المالكي", custEn:"Fahad Almalki", prio:"med", agent:{ar:"ريم",en:"Reem"}, src:5, last:{ar:"أمس",en:"Yest."}, status:"closed" },
  { id:"TK-1037", subj:{ar:"إعادة جدولة موعد",en:"Reschedule appointment"}, cust:"لمى الحربي", custEn:"Lama Alharbi", prio:"low", agent:{ar:"الوكيل AI",en:"AI Agent"}, src:0, last:{ar:"أمس",en:"Yest."}, status:"closed" },
];

const CAMPAIGNS = [
  { name:{ar:"عرض رمضان — العيادات",en:"Ramadan Offer — Clinics"}, seg:1, status:"active", sent:1240, opened:982, replied:341, converted:87, when:{ar:"يومي 9ص",en:"Daily 9AM"} },
  { name:{ar:"متابعة العملاء المترددين",en:"Re-engage hesitant leads"}, seg:2, status:"scheduled", sent:0, opened:0, replied:0, converted:0, when:{ar:"الخميس 7م",en:"Thu 7PM"} },
  { name:{ar:"إطلاق مشروع النرجس",en:"Al-Narjis project launch"}, seg:0, status:"active", sent:3120, opened:2510, replied:712, converted:143, when:{ar:"منتهية",en:"Completed"} },
  { name:{ar:"عرض الجمعة البيضاء",en:"White Friday offer"}, seg:3, status:"done", sent:5400, opened:4100, replied:1230, converted:402, when:{ar:"منتهية",en:"Completed"} },
];

const LEADS = [
  { name:"محمد العتيبي", nameEn:"Mohammed Alotaibi", phone:"+966 50 •• 4821", src:0, cls:"hot", interest:{ar:"فيلا — الياسمين",en:"Villa — Al-Yasmin"}, last:{ar:"اليوم",en:"Today"}, score:88, note:{ar:"جاهز للمعاينة، استعجال عالي.",en:"Ready to view, high urgency."} },
  { name:"سارة القحطاني", nameEn:"Sara Alqahtani", phone:"+966 55 •• 1190", src:2, cls:"interested", interest:{ar:"جلسة بشرة",en:"Facial session"}, last:{ar:"اليوم",en:"Today"}, score:72, note:{ar:"تحتاج تأكيد موعد الغد.",en:"Needs tomorrow's slot confirmed."} },
  { name:"عبدالرحمن الدوسري", nameEn:"Abdulrahman Aldosari", phone:"+966 53 •• 7733", src:1, cls:"followup", interest:{ar:"دورة قيادة",en:"Leadership course"}, last:{ar:"أمس",en:"Yest."}, score:54, note:{ar:"متردد على السعر — أرسل خصم.",en:"Price-hesitant — send a discount."} },
  { name:"نورة الشمري", nameEn:"Noura Alshammari", phone:"+966 56 •• 2045", src:3, cls:"closed", interest:{ar:"طلب منتج",en:"Product order"}, last:{ar:"أمس",en:"Yest."}, score:40, note:{ar:"عميلة راضية — فرصة بيع إضافي.",en:"Happy customer — upsell chance."} },
  { name:"فهد المالكي", nameEn:"Fahad Almalki", phone:"+966 59 •• 6612", src:6, cls:"new", interest:{ar:"عرض تصميم",en:"Design quote"}, last:{ar:"اليوم",en:"Today"}, score:31, note:{ar:"محادثة جديدة، تحت التأهيل.",en:"New chat, being qualified."} },
  { name:"لمى الحربي", nameEn:"Lama Alharbi", phone:"+966 50 •• 9087", src:4, cls:"interested", interest:{ar:"باقة تدريب فريق",en:"Team training pkg"}, last:{ar:"قبل يومين",en:"2d ago"}, score:66, note:{ar:"تطلب عرض لـ8 موظفين.",en:"Wants a quote for 8 staff."} },
  { name:"تركي السبيعي", nameEn:"Turki Alsubaie", phone:"+966 54 •• 3398", src:5, cls:"hot", interest:{ar:"شقة استثمارية",en:"Investment apartment"}, last:{ar:"اليوم",en:"Today"}, score:81, note:{ar:"مستثمر جاد، يقارن وحدتين.",en:"Serious investor, comparing 2 units."} },
];

const SOCIAL = [
  { src:1, srcName:"X", text:{ar:"أحد يعرف شركة عقار زينة في الرياض؟ أبي أشتري فيلا 🏡",en:"Anyone know a good real-estate firm in Riyadh? Want to buy a villa 🏡"}, cls:"sale", prio:"high", action:{ar:"رد مباشر + عرض فلل الياسمين",en:"Reply directly + share Al-Yasmin villas"} },
  { src:2, srcName:"Instagram", text:{ar:"كم سعر جلسة الليزر عندكم؟",en:"How much is a laser session?"}, cls:"question", prio:"med", action:{ar:"إرسال قائمة الأسعار",en:"Send price list"} },
  { src:5, srcName:"TikTok", text:{ar:"طلبت من زمان وما وصل الطلب 😡",en:"Ordered a while ago and it never arrived 😡"}, cls:"complaint", prio:"high", action:{ar:"فتح تذكرة عاجلة + اعتذار",en:"Open urgent ticket + apologize"} },
  { src:3, srcName:"Website Form", text:{ar:"حاب أسجل في دورة إدارة المشاريع القادمة",en:"I'd like to register for the upcoming PM course"}, cls:"service", prio:"med", action:{ar:"إرسال رابط التسجيل",en:"Send registration link"} },
  { src:2, srcName:"Instagram", text:{ar:"تصميمكم حلو، عندكم فروع ثانية؟",en:"Love your designs, any other branches?"}, cls:"interest", prio:"low", action:{ar:"شكر + مشاركة الفروع",en:"Thank + share branches"} },
];

const FAQ_SEED = {
  ar:[["وش أنواع الفلل المتوفرة؟","عندنا فلل في الياسمين والنرجس تبدأ من 1.75 مليون."],["هل فيه تقسيط؟","نعم، نوفّر دعم بنكي وتمويل عقاري."]],
  en:[["What villa types are available?","Villas in Al-Yasmin and Al-Narjis starting at 1.75M."],["Do you offer installments?","Yes, we support bank financing and mortgages."]],
};

/* ============================== HELPERS / PRIMITIVES ============================== */
function useT(lang){ return useMemo(()=>T[lang], [lang]); }
const L = (lang, v) => typeof v === "object" && v ? (v[lang] ?? v.ar ?? "") : v;

function Sparkline({ seed, color="var(--wa)" }){
  const data = useMemo(()=>sparkData(seed),[seed]);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{top:2,right:0,left:0,bottom:0}}>
        <defs><linearGradient id={`sp${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.5}/><stop offset="100%" stopColor={color} stopOpacity={0}/>
        </linearGradient></defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#sp${seed})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function KpiCard({ icon:Icon, label, value, delta, up=true, color="var(--wa)", seed, suffix }){
  return (
    <div className="card hov fade-up" style={{padding:"18px 18px 16px", overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <div style={{width:38,height:38,borderRadius:11,display:"grid",placeItems:"center",
          background:`color-mix(in srgb, ${color} 16%, transparent)`, color}}>
          <Icon size={19}/>
        </div>
        <span className="muted" style={{fontSize:13.5,fontWeight:600}}>{label}</span>
      </div>
      <div style={{display:"flex",alignItems:"baseline",gap:6}}>
        <span className="mono" style={{fontSize:30,fontWeight:700,letterSpacing:"-.5px"}}>{value}</span>
        {suffix && <span className="dim" style={{fontSize:14}}>{suffix}</span>}
      </div>
      {delta!=null && (
        <div style={{display:"flex",alignItems:"center",gap:5,marginTop:8,fontSize:12.5,fontWeight:600,
          color: up?"var(--wa)":"var(--hot)"}}>
          {up?<TrendingUp size={14}/>:<TrendingDown size={14}/>}{delta}
        </div>
      )}
      <div className="kpi-spark"><Sparkline seed={seed} color={color}/></div>
    </div>
  );
}

function StatusPill({ status, lang, map=null, colorMap=STATUS_COLOR }){
  const t = useT(lang);
  const labels = map || t.statuses;
  const c = colorMap[status];
  return (
    <span className="tag" style={{ color:c, background:`color-mix(in srgb, ${c} 14%, transparent)`, border:`1px solid color-mix(in srgb, ${c} 35%, transparent)` }}>
      <span className="dot" style={{background:c}} />{labels[status]}
    </span>
  );
}

function ScoreBar({ v }){
  const c = v>=75? "var(--hot)" : v>=50? "var(--warm)" : v>=30? "var(--teal)" : "var(--cool)";
  return (
    <div style={{display:"flex",alignItems:"center",gap:9,minWidth:120}}>
      <div className="track" style={{flex:1}}><span style={{width:`${v}%`, background:`linear-gradient(90deg, ${c}aa, ${c})`}}/></div>
      <span className="mono" style={{fontSize:13,fontWeight:700,color:c,width:28,textAlign:"end"}}>{v}</span>
    </div>
  );
}

function SectionHead({ kicker, title, sub }){
  return (
    <div style={{marginBottom:34, textAlign:"center"}}>
      {kicker && <div className="pill" style={{color:"var(--wa)",borderColor:"rgba(37,211,102,.3)",background:"rgba(37,211,102,.08)",marginBottom:14}}><Sparkles size={13}/>{kicker}</div>}
      <h2 style={{fontSize:"clamp(24px,4vw,38px)",fontWeight:700,lineHeight:1.2,letterSpacing:"-.5px",margin:0}}>{title}</h2>
      {sub && <p className="muted" style={{maxWidth:620,margin:"14px auto 0",fontSize:16,lineHeight:1.6}}>{sub}</p>}
    </div>
  );
}

function PageHead({ title, sub, right }){
  return (
    <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:16,flexWrap:"wrap",marginBottom:22}}>
      <div>
        <h1 style={{fontSize:"clamp(21px,3vw,27px)",fontWeight:700,margin:0,letterSpacing:"-.3px"}}>{title}</h1>
        <p className="muted" style={{margin:"7px 0 0",fontSize:14.5}}>{sub}</p>
      </div>
      {right}
    </div>
  );
}


/* ============================== LANDING PAGE ============================== */
function Landing({ lang, onEnter, onToggleLang }){
  const t = useT(lang);
  return (
    <div className="scroll" style={{height:"100vh",overflowY:"auto",position:"relative",zIndex:1}}>
      {/* top bar */}
      <header style={{position:"sticky",top:0,zIndex:30,backdropFilter:"blur(12px)",
        background:"rgba(5,16,11,.7)",borderBottom:"1px solid var(--line)"}}>
        <div style={{maxWidth:1180,margin:"0 auto",padding:"14px 22px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:11}}>
            <Logo/><div>
              <div style={{fontWeight:700,fontSize:15.5}}>{t.brand}</div>
              <div className="dim" style={{fontSize:11.5}}>{t.tagline}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button className="btn-icon" onClick={onToggleLang} title="Language"><Globe size={18}/></button>
            <button className="btn btn-ghost btn-sm hide-mob" onClick={onEnter}>{t.enterApp}</button>
            <button className="btn btn-primary btn-sm" onClick={onEnter}><Play size={15}/>{t.bookDemo}</button>
          </div>
        </div>
      </header>

      {/* hero */}
      <section style={{position:"relative",overflow:"hidden",padding:"clamp(48px,9vw,104px) 22px 60px"}}>
        <div className="aurora" style={{width:420,height:420,background:"var(--wa)",top:-120,insetInlineEnd:-60}}/>
        <div className="aurora" style={{width:340,height:340,background:"var(--teal)",bottom:-120,insetInlineStart:-40,animationDelay:"2s"}}/>
        <div style={{maxWidth:1080,margin:"0 auto",textAlign:"center",position:"relative"}}>
          <div className="pill fade-up" style={{color:"var(--wa)",borderColor:"rgba(37,211,102,.3)",background:"rgba(37,211,102,.08)",marginBottom:22}}>
            <span className="dot live-dot" style={{background:"var(--wa)"}}/>{t.heroNote}
          </div>
          <h1 className="fade-up" style={{fontSize:"clamp(32px,6.2vw,62px)",fontWeight:700,lineHeight:1.12,letterSpacing:"-1px",margin:0,
            animationDelay:".05s"}}>
            {t.heroTitle.split(" ").slice(0,-3).join(" ")} <span style={{background:"linear-gradient(120deg,var(--wa),var(--teal))",WebkitBackgroundClip:"text",backgroundClip:"text",color:"transparent"}}>{t.heroTitle.split(" ").slice(-3).join(" ")}</span>
          </h1>
          <p className="muted fade-up" style={{maxWidth:680,margin:"22px auto 0",fontSize:"clamp(15px,2vw,19px)",lineHeight:1.65,animationDelay:".12s"}}>{t.heroSub}</p>
          <div className="fade-up" style={{display:"flex",gap:13,justifyContent:"center",marginTop:34,flexWrap:"wrap",animationDelay:".2s"}}>
            <button className="btn btn-primary" style={{padding:"14px 26px",fontSize:15.5}} onClick={onEnter}><Play size={18}/>{t.lf.watchLive}</button>
            <button className="btn btn-ghost" style={{padding:"14px 24px",fontSize:15.5}} onClick={onEnter}><Sparkles size={17}/>{t.enterApp}</button>
          </div>
          {/* hero preview */}
          <div className="card fade-up" style={{maxWidth:880,margin:"54px auto 0",padding:0,overflow:"hidden",animationDelay:".28s",
            boxShadow:"0 50px 120px -50px rgba(37,211,102,.4)"}}>
            <HeroMock lang={lang}/>
          </div>
        </div>
      </section>

      <div style={{maxWidth:1180,margin:"0 auto",padding:"0 22px"}}>
        {/* problem */}
        <section style={{padding:"70px 0"}}>
          <SectionHead kicker={t.problemKicker} title={t.problemTitle}/>
          <div className="grid-auto" style={{gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))"}}>
            {t.problems.map((p,i)=>(
              <div key={i} className="card hov" style={{padding:22}}>
                <div style={{width:34,height:34,borderRadius:10,display:"grid",placeItems:"center",
                  background:"rgba(255,92,107,.12)",color:"var(--hot)",marginBottom:13}}>
                  <X size={18}/>
                </div>
                <h3 style={{fontSize:16.5,fontWeight:700,margin:"0 0 7px"}}>{p[0]}</h3>
                <p className="muted" style={{margin:0,fontSize:14,lineHeight:1.6}}>{p[1]}</p>
              </div>
            ))}
          </div>
        </section>

        {/* solution */}
        <section style={{padding:"40px 0 70px"}}>
          <SectionHead kicker={t.solutionKicker} title={t.solutionTitle}/>
          <div className="grid-auto" style={{gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))"}}>
            {t.solutions.map((s,i)=>{ const Ic=s[2]; return (
              <div key={i} className="card hov" style={{padding:24}}>
                <div style={{width:46,height:46,borderRadius:13,display:"grid",placeItems:"center",
                  background:"linear-gradient(135deg,rgba(37,211,102,.2),rgba(15,217,163,.08))",color:"var(--wa)",marginBottom:16,
                  border:"1px solid rgba(37,211,102,.25)"}}>
                  <Ic size={23}/>
                </div>
                <h3 style={{fontSize:17.5,fontWeight:700,margin:"0 0 8px"}}>{s[0]}</h3>
                <p className="muted" style={{margin:0,fontSize:14.5,lineHeight:1.6}}>{s[1]}</p>
              </div>
            );})}
          </div>
        </section>

        {/* AI Sales Agent — the moat */}
        <section style={{padding:"40px 0 30px"}}>
          <div className="card" style={{padding:"clamp(26px,4vw,44px)",position:"relative",overflow:"hidden",
            background:"linear-gradient(135deg,rgba(169,139,255,.1),rgba(11,29,21,.5))",border:"1px solid rgba(169,139,255,.25)"}}>
            <div className="aurora" style={{width:300,height:300,background:"var(--violet)",top:-110,insetInlineEnd:-40}}/>
            <div style={{position:"relative"}}>
              <span className="pill" style={{color:"var(--violet)",borderColor:"rgba(169,139,255,.35)",background:"rgba(169,139,255,.1)",marginBottom:16}}>
                <Brain size={13}/>{t.moatKicker}
              </span>
              <h2 style={{fontSize:"clamp(22px,3.6vw,36px)",fontWeight:700,margin:"0 0 12px",letterSpacing:"-.5px",maxWidth:760}}>{t.moatTitle}</h2>
              <p className="muted" style={{maxWidth:680,margin:"0 0 30px",fontSize:"clamp(14px,1.8vw,17px)",lineHeight:1.65}}>{t.moatSub}</p>
              <div className="grid-auto" style={{gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))"}}>
                {t.moat.map((m,i)=>{ const Ic=m[2]; return (
                  <div key={i} className="glass hov card" style={{padding:20,position:"relative"}}>
                    <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:11}}>
                      <div style={{width:40,height:40,borderRadius:11,display:"grid",placeItems:"center",flexShrink:0,
                        background:"rgba(169,139,255,.16)",color:"var(--violet)"}}><Ic size={20}/></div>
                      <span className="mono" style={{fontSize:13,color:"rgba(169,139,255,.5)",fontWeight:700}}>0{i+1}</span>
                    </div>
                    <h3 style={{fontSize:15.5,fontWeight:700,margin:"0 0 6px"}}>{m[0]}</h3>
                    <p className="muted" style={{margin:0,fontSize:13.5,lineHeight:1.55}}>{m[1]}</p>
                  </div>
                );})}
              </div>
            </div>
          </div>
        </section>

        {/* Lead sources */}
        <section style={{padding:"30px 0 40px"}}>
          <SectionHead kicker={t.srcKicker} title={t.srcTitle} sub={t.srcSub}/>
          <div className="card" style={{padding:"clamp(22px,3.5vw,34px)"}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center",alignItems:"center"}}>
              {SRC_ORDER.map((k,i)=>{ const m=SRC_META[k]; const Ic=m.Icon; return (
                <React.Fragment key={k}>
                  <div className="glass" style={{padding:"13px 18px",borderRadius:14,display:"flex",alignItems:"center",gap:10,
                    border:`1px solid ${m.c}44`}}>
                    <div style={{width:34,height:34,borderRadius:10,display:"grid",placeItems:"center",background:m.c+"1f",color:m.c}}><Ic size={19}/></div>
                    <span style={{fontWeight:700,fontSize:14.5}}>{m.label[lang]}</span>
                  </div>
                  {i<SRC_ORDER.length-1 && <ArrowRight size={18} className="dim" style={{transform:lang==="ar"?"scaleX(-1)":"none"}}/>}
                </React.Fragment>
              );})}
            </div>
            <div style={{display:"flex",justifyContent:"center",marginTop:22}}>
              <div style={{display:"flex",alignItems:"center",gap:11}}>
                <div style={{width:46,height:46,borderRadius:13,display:"grid",placeItems:"center",
                  background:"linear-gradient(135deg,rgba(37,211,102,.22),rgba(15,217,163,.08))",color:"var(--wa)",border:"1px solid rgba(37,211,102,.3)"}}><Brain size={23}/></div>
                <div>
                  <div style={{fontWeight:700,fontSize:15}}>{t.brand} AI</div>
                  <div className="muted" style={{fontSize:13}}>{t.srcAuto}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* features strip */}
        <section style={{padding:"30px 0 60px"}}>
          <SectionHead kicker={t.featuresKicker} title={lang==="ar"?"كل ما تحتاجه قناة مبيعات احترافية":"Everything a pro sales channel needs"}/>
          <div className="grid-auto" style={{gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))"}}>
            {t.landingFeatures.map((f,i)=>(
              <div key={i} className="glass" style={{padding:"18px 20px",borderRadius:15,display:"flex",gap:13,alignItems:"flex-start"}}>
                <div style={{color:"var(--wa)",flexShrink:0,marginTop:2}}><Check size={18}/></div>
                <div><div style={{fontWeight:700,fontSize:15,marginBottom:4}}>{f[0]}</div>
                  <div className="muted" style={{fontSize:13.5,lineHeight:1.55}}>{f[1]}</div></div>
              </div>
            ))}
          </div>
        </section>

        {/* how it works */}
        <section style={{padding:"40px 0 70px"}}>
          <SectionHead kicker={t.howKicker} title={t.howTitle}/>
          <div className="grid-auto" style={{gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))"}}>
            {t.how.map((h,i)=>(
              <div key={i} className="card hov" style={{padding:26,position:"relative"}}>
                <span className="mono" style={{position:"absolute",insetInlineEnd:20,top:16,fontSize:46,fontWeight:700,
                  color:"rgba(37,211,102,.14)",lineHeight:1}}>0{i+1}</span>
                <div style={{width:42,height:42,borderRadius:12,display:"grid",placeItems:"center",
                  background:"rgba(37,211,102,.14)",color:"var(--wa)",marginBottom:16}}>
                  {[<Phone size={20}/>,<Bot size={20}/>,<TrendingUp size={20}/>][i]}
                </div>
                <h3 style={{fontSize:18,fontWeight:700,margin:"0 0 8px"}}>{h[0]}</h3>
                <p className="muted" style={{margin:0,fontSize:14.5,lineHeight:1.6}}>{h[1]}</p>
              </div>
            ))}
          </div>
        </section>

        {/* use cases */}
        <section style={{padding:"30px 0 70px"}}>
          <SectionHead kicker={t.useKicker} title={lang==="ar"?"مصمّم لقطاعات تستقبل كثير على واتساب":"Built for high-WhatsApp-volume sectors"}/>
          <div className="grid-auto" style={{gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))"}}>
            {t.useCases.map((u,i)=>{ const Ic=u[2]; return (
              <div key={i} className="card hov" style={{padding:22,display:"flex",gap:14,alignItems:"center"}}>
                <div style={{width:44,height:44,borderRadius:12,display:"grid",placeItems:"center",flexShrink:0,
                  background:"rgba(15,217,163,.12)",color:"var(--teal)"}}><Ic size={22}/></div>
                <div><div style={{fontWeight:700,fontSize:15.5}}>{u[0]}</div>
                  <div className="muted" style={{fontSize:13,lineHeight:1.5,marginTop:3}}>{u[1]}</div></div>
              </div>
            );})}
          </div>
        </section>

        {/* pricing teaser -> reuse */}
        <section style={{padding:"20px 0 40px"}}>
          <PricingView lang={lang} embedded onEnter={onEnter}/>
        </section>

        {/* CTA */}
        <section style={{padding:"50px 0 80px"}}>
          <div className="card" style={{padding:"clamp(34px,6vw,64px)",textAlign:"center",position:"relative",overflow:"hidden",
            background:"linear-gradient(135deg,rgba(37,211,102,.16),rgba(11,29,21,.6))",border:"1px solid rgba(37,211,102,.3)"}}>
            <div className="aurora" style={{width:300,height:300,background:"var(--wa)",top:-100,insetInlineEnd:60}}/>
            <h2 style={{fontSize:"clamp(24px,4vw,40px)",fontWeight:700,margin:0,letterSpacing:"-.5px",position:"relative"}}>{t.ctaTitle}</h2>
            <p className="muted" style={{maxWidth:560,margin:"16px auto 28px",fontSize:16.5,lineHeight:1.6,position:"relative"}}>{t.ctaSub}</p>
            <button className="btn btn-primary" style={{padding:"15px 30px",fontSize:16,position:"relative"}} onClick={onEnter}>
              <Play size={18}/>{t.bookDemo}
            </button>
          </div>
        </section>
      </div>

      <footer style={{borderTop:"1px solid var(--line)",padding:"28px 22px",textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:10}}>
          <Logo size={28}/><span style={{fontWeight:700}}>{t.brand}</span>
        </div>
        <p className="dim" style={{fontSize:13,margin:0}}>{t.footer}</p>
      </footer>
    </div>
  );
}

function HeroMock({ lang }){
  const t = useT(lang);
  return (
    <div style={{background:"var(--bg1)",padding:"14px"}}>
      <div style={{display:"flex",gap:6,marginBottom:12,paddingInlineStart:4}}>
        {["#FF5C6B","#FFB23E","#25D366"].map(c=><span key={c} className="dot" style={{background:c,opacity:.8}}/>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:12}}>
        {/* mini chat */}
        <div className="glass" style={{borderRadius:13,padding:14,display:"flex",flexDirection:"column",gap:9}}>
          <div style={{display:"flex",alignItems:"center",gap:8,paddingBottom:9,borderBottom:"1px solid var(--line)"}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,var(--wa),var(--teal))",display:"grid",placeItems:"center",fontWeight:700,fontSize:13,color:"#04140B"}}>م</div>
            <div><div style={{fontWeight:700,fontSize:13}}>{lang==="ar"?"محمد العتيبي":"M. Alotaibi"}</div>
              <div className="dim" style={{fontSize:10.5,display:"flex",alignItems:"center",gap:4}}><span className="dot live-dot" style={{background:"var(--wa)",width:6,height:6}}/>{t.assignedAI}</div></div>
            <StatusPill status="hot" lang={lang}/>
          </div>
          <div className="bub in">{lang==="ar"?"كم سعر الفيلا؟":"How much is the villa?"}</div>
          <div className="bub out">{lang==="ar"?"تبدأ من 1.75 مليون 🏡 أرتب لك معاينة؟":"Starts at 1.75M 🏡 shall I book a viewing?"}</div>
          <div className="bub in">{lang==="ar"?"تمام، أبي معاينة":"Yes, book it"}</div>
        </div>
        {/* mini stats */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div className="glass" style={{borderRadius:13,padding:14}}>
            <div className="dim" style={{fontSize:11,marginBottom:4}}>{t.aiSummary}</div>
            <div style={{fontSize:12.5,lineHeight:1.6}}>{lang==="ar"?"عميل ساخن • فيلا الياسمين • جاهز لمعاينة • الدرجة 88":"Hot lead • Al-Yasmin villa • ready to view • score 88"}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div className="glass" style={{borderRadius:13,padding:"12px 14px"}}>
              <div className="mono" style={{fontSize:22,fontWeight:700,color:"var(--wa)"}}>88</div>
              <div className="dim" style={{fontSize:11}}>{t.score}</div>
            </div>
            <div className="glass" style={{borderRadius:13,padding:"12px 14px"}}>
              <div className="mono" style={{fontSize:22,fontWeight:700,color:"var(--teal)"}}>12{lang==="ar"?"د":"m"}</div>
              <div className="dim" style={{fontSize:11}}>{t.kpis.resp}</div>
            </div>
          </div>
          <div className="glass" style={{borderRadius:13,padding:14,flex:1,minHeight:70}}>
            <div className="dim" style={{fontSize:11,marginBottom:6}}>{t.convOverTime}</div>
            <div style={{height:42}}><Sparkline seed={3} color="var(--wa)"/></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Logo({ size=36 }){
  return (
    <div style={{width:size,height:size,borderRadius:size*0.28,display:"grid",placeItems:"center",
      background:"linear-gradient(135deg,var(--wa),var(--teal))",boxShadow:"0 8px 22px -8px var(--glow)",flexShrink:0}}>
      <MessageSquare size={size*0.5} color="#04140B" strokeWidth={2.4}/>
    </div>
  );
}

/* ============================== DASHBOARD ============================== */
function ChartTip({ active, payload, lang, suffix="" }){
  if(!active||!payload||!payload.length) return null;
  return (
    <div className="glass" style={{padding:"8px 12px",borderRadius:10,fontSize:12.5}}>
      <span className="mono" style={{fontWeight:700,color:"var(--wa)"}}>{payload[0].value}{suffix}</span>
    </div>
  );
}

function Dashboard({ lang }){
  const t = useT(lang);
  return (
    <div className="fade-up">
      <PageHead title={t.dashTitle} sub={t.dashSub}
        right={<div className="pill" style={{color:"var(--txt2)"}}><Calendar size={14}/>{t.thisWeek}</div>} />

      {/* KPIs */}
      <div className="grid-auto" style={{gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",marginBottom:16}}>
        <KpiCard icon={MessageSquare} label={t.kpis.conv} value="486" delta="+18%" color="var(--wa)" seed={1}/>
        <KpiCard icon={UserCheck} label={t.kpis.newLeads} value="73" delta="+12%" color="var(--teal)" seed={2}/>
        <KpiCard icon={Ticket} label={t.kpis.tickets} value="14" delta="-3" up={false} color="var(--warm)" seed={3}/>
        <KpiCard icon={Send} label={t.kpis.camps} value="2" color="var(--cool)" seed={4}/>
        <KpiCard icon={Target} label={t.kpis.rate} value="11.7" suffix="%" delta="+2.4%" color="var(--violet)" seed={5}/>
        <KpiCard icon={Clock} label={t.kpis.resp} value="12" suffix={t.min} delta="-41%" color="var(--hot)" seed={6}/>
      </div>

      {/* charts row */}
      <div className="grid-auto" style={{gridTemplateColumns:"minmax(0,1.7fr) minmax(0,1fr)",marginBottom:16}}>
        <div className="card" style={{padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <h3 style={{fontSize:15.5,fontWeight:700,margin:0}}>{t.convOverTime}</h3>
            <span className="pill" style={{color:"var(--wa)",fontSize:11.5}}><span className="dot" style={{background:"var(--wa)"}}/>+18% {t.vsLast}</span>
          </div>
          <div style={{height:240}}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CONV_WEEK} margin={{top:6,right:8,left:-18,bottom:0}}>
                <defs><linearGradient id="gconv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--wa)" stopOpacity={.4}/><stop offset="100%" stopColor="var(--wa)" stopOpacity={0}/>
                </linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,200,160,.08)" vertical={false}/>
                <XAxis dataKey={d=>L(lang,d.d)} tick={{fill:"var(--txt3)",fontSize:12}} axisLine={false} tickLine={false} reversed={lang==="ar"}/>
                <YAxis tick={{fill:"var(--txt3)",fontSize:12}} axisLine={false} tickLine={false} orientation={lang==="ar"?"right":"left"}/>
                <Tooltip content={<ChartTip lang={lang}/>} cursor={{stroke:"var(--wa)",strokeOpacity:.3}}/>
                <Area type="monotone" dataKey="v" stroke="var(--wa)" strokeWidth={2.5} fill="url(#gconv)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{padding:20}}>
          <h3 style={{fontSize:15.5,fontWeight:700,margin:"0 0 14px"}}>{t.leadSources}</h3>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:140,height:160,flexShrink:0}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={SOURCE_DATA} dataKey="v" innerRadius={42} outerRadius={66} paddingAngle={3} stroke="none">
                    {SOURCE_DATA.map((s,i)=><Cell key={i} fill={s.c}/>)}
                  </Pie>
                  <Tooltip content={<ChartTip lang={lang} suffix="%"/>}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:9}}>
              {SOURCE_DATA.map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:13}}>
                  <span className="dot" style={{background:s.c}}/>
                  <span style={{flex:1}} className="muted">{L(lang,s.n)}</span>
                  <span className="mono" style={{fontWeight:700}}>{s.v}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* funnel + recent */}
      <div className="grid-auto" style={{gridTemplateColumns:"minmax(0,1fr) minmax(0,1.4fr)"}}>
        <div className="card" style={{padding:20}}>
          <h3 style={{fontSize:15.5,fontWeight:700,margin:"0 0 18px"}}>{t.funnel}</h3>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {FUNNEL.map((f,i)=>{ const pct = Math.round(f.v/FUNNEL[0].v*100); return (
              <div key={i}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}>
                  <span className="muted">{L(lang,f.s)}</span>
                  <span><span className="mono" style={{fontWeight:700}}>{f.v}</span> <span className="dim">· {pct}%</span></span>
                </div>
                <div className="track" style={{height:9}}><span style={{width:`${pct}%`,background:`linear-gradient(90deg,${f.c}88,${f.c})`}}/></div>
              </div>
            );})}
          </div>
        </div>

        <div className="card" style={{padding:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h3 style={{fontSize:15.5,fontWeight:700,margin:0}}>{t.recentConv}</h3>
            <span className="dim" style={{fontSize:12.5,display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}>{t.viewAll}<ArrowRight size={13} style={{transform:lang==="ar"?"scaleX(-1)":"none"}}/></span>
          </div>
          <div style={{display:"flex",flexDirection:"column"}}>
            {CONVS.slice(0,5).map((c,i)=>(
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",
                borderBottom: i<4?"1px solid rgba(120,200,160,.06)":"none"}}>
                <Avatar name={lang==="ar"?c.name:c.nameEn}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:13.5}}>{lang==="ar"?c.name:c.nameEn}</div>
                  <div className="dim" style={{fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{lang==="ar"?c.last:c.lastEn}</div>
                </div>
                <StatusPill status={c.status} lang={lang}/>
                <span className="mono dim" style={{fontSize:12,width:30,textAlign:"end"}}>{c.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Avatar({ name, size=36 }){
  const ch = (name||"؟").trim()[0];
  const hues = ["var(--wa)","var(--teal)","var(--cool)","var(--violet)","var(--warm)"];
  const h = hues[(name||"").length % hues.length];
  return (
    <div style={{width:size,height:size,borderRadius:"50%",flexShrink:0,display:"grid",placeItems:"center",
      fontWeight:700,fontSize:size*0.4,color:"#04140B",background:`linear-gradient(135deg, ${h}, color-mix(in srgb, ${h} 55%, #000))`}}>
      {ch}
    </div>
  );
}

/* ============================== INBOX ============================== */
function Inbox({ lang, toast }){
  const t = useT(lang);
  const [sel, setSel] = useState(CONVS[0].id);
  const [draft, setDraft] = useState("");
  const [extra, setExtra] = useState([]);
  const c = CONVS.find(x=>x.id===sel);
  const send = (txt) => { if(!txt.trim())return; setExtra(e=>[...e,{t:"out",x:txt,xe:txt,tm:lang==="ar"?"الآن":"now"}]); setDraft(""); };
  useEffect(()=>setExtra([]),[sel]);

  return (
    <div className="fade-up" style={{height:"calc(100vh - 130px)"}}>
      <PageHead title={t.inboxTitle} sub={lang==="ar"?"كل محادثات واتساب في مكان واحد":"All WhatsApp chats in one place"}/>
      <div className="card" style={{padding:0,overflow:"hidden",display:"grid",gridTemplateColumns:"300px 1fr",height:"100%"}}>
        {/* list */}
        <div className="scroll" style={{borderInlineEnd:"1px solid var(--line)",overflowY:"auto"}}>
          <div style={{padding:12,position:"sticky",top:0,background:"var(--panel)",zIndex:2,borderBottom:"1px solid var(--line)"}}>
            <div style={{position:"relative"}}>
              <Search size={16} style={{position:"absolute",insetInlineStart:12,top:12,color:"var(--txt3)"}}/>
              <input className="inp" placeholder={t.search} style={{paddingInlineStart:36,paddingTop:9,paddingBottom:9}}/>
            </div>
          </div>
          {CONVS.map(cv=>(
            <div key={cv.id} onClick={()=>setSel(cv.id)} style={{display:"flex",gap:11,padding:"13px 14px",cursor:"pointer",
              borderBottom:"1px solid rgba(120,200,160,.05)",
              background: sel===cv.id?"linear-gradient(90deg,rgba(37,211,102,.1),transparent)":"transparent",
              borderInlineStart: sel===cv.id?"3px solid var(--wa)":"3px solid transparent",transition:".15s"}}>
              <Avatar name={lang==="ar"?cv.name:cv.nameEn} size={42}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",gap:6}}>
                  <span style={{fontWeight:600,fontSize:13.5}}>{lang==="ar"?cv.name:cv.nameEn}</span>
                  <span className="dim" style={{fontSize:11}}>{lang==="ar"?cv.time:(cv.timeEn||cv.time)}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",gap:6,marginTop:4,alignItems:"center"}}>
                  <span className="dim" style={{fontSize:12.5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{lang==="ar"?cv.last:cv.lastEn}</span>
                  {cv.unread>0 && <span style={{background:"var(--wa)",color:"#04140B",borderRadius:999,fontSize:10.5,fontWeight:700,minWidth:18,height:18,display:"grid",placeItems:"center",padding:"0 5px"}}>{cv.unread}</span>}
                </div>
                <div style={{marginTop:6}}><StatusPill status={cv.status} lang={lang}/></div>
              </div>
            </div>
          ))}
        </div>

        {/* thread */}
        <div style={{display:"flex",flexDirection:"column",minWidth:0}}>
          {/* header */}
          <div style={{padding:"13px 18px",borderBottom:"1px solid var(--line)",display:"flex",alignItems:"center",gap:12}}>
            <Avatar name={lang==="ar"?c.name:c.nameEn} size={40}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,fontSize:14.5}}>{lang==="ar"?c.name:c.nameEn}</div>
              <div className="dim" style={{fontSize:11.5,display:"flex",alignItems:"center",gap:5}}>
                <span className="dot live-dot" style={{background:"var(--wa)",width:6,height:6}}/>{t.assignedAI}
              </div>
            </div>
            <div className="hide-mob" style={{display:"flex",gap:8}}>
              <button className="btn btn-ghost btn-sm" onClick={()=>toast(lang==="ar"?"تم فتح تذكرة TK-1043 ✅":"Ticket TK-1043 opened ✅")}><Ticket size={15}/>{t.toTicket}</button>
              <button className="btn btn-ghost btn-sm" onClick={()=>toast(lang==="ar"?"تم تسليم المحادثة لخالد 👤":"Handed to Khalid 👤")}><Headphones size={15}/>{t.toHuman}</button>
            </div>
          </div>

          {/* body */}
          <div className="scroll" style={{flex:1,overflowY:"auto",padding:18,display:"flex",flexDirection:"column",gap:10,
            background:"radial-gradient(circle at 50% 0%, rgba(37,211,102,.04), transparent 60%)"}}>
            {/* AI summary banner */}
            <div className="glass" style={{borderRadius:13,padding:"12px 14px",border:"1px solid rgba(169,139,255,.25)",
              background:"linear-gradient(90deg,rgba(169,139,255,.1),transparent)"}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:6,color:"var(--violet)",fontSize:12.5,fontWeight:700}}>
                <Sparkles size={15}/>{t.aiSummary}
                <span style={{marginInlineStart:"auto"}}><StatusPill status={c.status} lang={lang}/></span>
              </div>
              <div style={{fontSize:13,lineHeight:1.6}}>{lang==="ar"?c.summary.ar:c.summary.en}</div>
            </div>
            {[...c.msgs,...extra].map((m,i)=>(
              <div key={i} className={`bub ${m.t}`}>
                <div>{lang==="ar"?m.x:(m.xe||m.x)}</div>
                <div style={{fontSize:10,opacity:.6,marginTop:3,textAlign:"end",display:"flex",gap:3,justifyContent:"flex-end",alignItems:"center"}}>
                  {m.tm}{m.t==="out"&&<CheckCheck size={12} color="var(--wa)"/>}
                </div>
              </div>
            ))}
          </div>

          {/* suggested + composer */}
          <div style={{borderTop:"1px solid var(--line)",padding:"12px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:9,fontSize:12,color:"var(--wa)",fontWeight:600}}>
              <Sparkles size={13}/>{t.suggested}
            </div>
            <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginBottom:10}} className="scroll">
              {(lang==="ar"?SUGGESTED.ar:SUGGESTED.en).map((s,i)=>(
                <button key={i} onClick={()=>setDraft(s)} className="btn-sm" style={{whiteSpace:"nowrap",flexShrink:0,
                  background:"rgba(37,211,102,.08)",border:"1px solid rgba(37,211,102,.25)",color:"var(--txt)",
                  borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:12.5,padding:"7px 12px"}}>{s}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:9,alignItems:"center"}}>
              <button className="btn-icon" style={{width:38,height:38}}><Paperclip size={17}/></button>
              <input className="inp" value={draft} onChange={e=>setDraft(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&send(draft)} placeholder={t.typeMsg}/>
              <button className="btn btn-primary" style={{padding:"10px 14px"}} onClick={()=>send(draft)}>
                <Send size={17} style={{transform:lang==="ar"?"scaleX(-1)":"none"}}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== AGENT BUILDER ============================== */
function AgentBuilder({ lang, toast }){
  const t = useT(lang);
  const [name, setName] = useState(lang==="ar"?"وكيل عقار البحيرة":"Buhairah Real-Estate Agent");
  const [tone, setTone] = useState(0);
  const [ind, setInd] = useState(0);
  const [faqs, setFaqs] = useState(lang==="ar"?FAQ_SEED.ar:FAQ_SEED.en);
  const [esc, setEsc] = useState(lang==="ar"?"إذا طلب العميل التحدث مع موظف، أو ذكر شكوى، أو سأل عن عقد قانوني.":"If the customer asks for a human, mentions a complaint, or asks about a legal contract.");
  const [tkt, setTkt] = useState(lang==="ar"?"عند طلب معاينة، أو طلب عرض سعر رسمي، أو مشكلة تحتاج متابعة.":"On a viewing request, a formal quote request, or an issue needing follow-up.");
  const [hot, setHot] = useState(lang==="ar"?"إذا أبدى استعجال، أو ذكر ميزانية واضحة، أو طلب موعد.":"If they show urgency, state a clear budget, or request an appointment.");
  const [preview, setPreview] = useState([
    {t:"in",x:lang==="ar"?"السلام عليكم، عندكم فلل؟":"Hi, do you have villas?"},
    {t:"out",x:lang==="ar"?"وعليكم السلام 👋 أهلاً فيك! نعم عندنا فلل بمواقع مميزة. تبي حي معيّن أو ميزانية محددة؟":"Hello 👋 Welcome! Yes, we have villas in prime locations. Any specific area or budget?"},
  ]);
  const [test, setTest] = useState("");

  const addFaq = () => setFaqs(f=>[...f,["",""]]);
  const setFaq = (i,j,v) => setFaqs(f=>f.map((r,ri)=>ri===i?(j===0?[v,r[1]]:[r[0],v]):r));
  const runTest = () => {
    if(!test.trim())return;
    setPreview(p=>[...p,{t:"in",x:test},{t:"out",x:lang==="ar"?"شكراً لتواصلك 🙌 بناءً على طلبك رتّبت لك المعلومات، وأقدر أحجز لك موعد معاينة إذا تحب؟":"Thanks for reaching out 🙌 Based on your request I've prepared the info — shall I book you a viewing?"}]);
    setTest("");
  };

  const field = (label, children) => <div style={{marginBottom:18}}><label className="lbl">{label}</label>{children}</div>;

  return (
    <div className="fade-up">
      <PageHead title={t.agentTitle} sub={t.agentSub}
        right={<button className="btn btn-primary" onClick={()=>toast(lang==="ar"?"تم حفظ وتفعيل البوت ✅":"Bot saved & activated ✅")}><Zap size={16}/>{t.saveBot}</button>}/>
      <div className="grid-auto" style={{gridTemplateColumns:"minmax(0,1.3fr) minmax(0,1fr)",alignItems:"start"}}>
        {/* config */}
        <div className="card" style={{padding:22}}>
          {field(t.botName, <input className="inp" value={name} onChange={e=>setName(e.target.value)}/>)}
          <div className="grid-auto" style={{gridTemplateColumns:"1fr 1fr"}}>
            {field(t.tone,
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {t.tones.map((to,i)=>(
                  <button key={i} onClick={()=>setTone(i)} className="btn-sm" style={{cursor:"pointer",fontFamily:"inherit",
                    background:tone===i?"rgba(37,211,102,.16)":"rgba(255,255,255,.04)",
                    border:`1px solid ${tone===i?"rgba(37,211,102,.4)":"var(--line)"}`,color:tone===i?"var(--wa)":"var(--txt2)",borderRadius:9,padding:"7px 11px",fontSize:12.5}}>{to}</button>
                ))}
              </div>)}
            {field(t.industry,
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {t.industries.map((io,i)=>(
                  <button key={i} onClick={()=>setInd(i)} className="btn-sm" style={{cursor:"pointer",fontFamily:"inherit",
                    background:ind===i?"rgba(15,217,163,.16)":"rgba(255,255,255,.04)",
                    border:`1px solid ${ind===i?"rgba(15,217,163,.4)":"var(--line)"}`,color:ind===i?"var(--teal)":"var(--txt2)",borderRadius:9,padding:"7px 11px",fontSize:12.5}}>{io}</button>
                ))}
              </div>)}
          </div>

          {field(t.faqs,
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {faqs.map((f,i)=>(
                <div key={i} className="glass" style={{borderRadius:12,padding:12,display:"flex",flexDirection:"column",gap:8}}>
                  <input className="inp" style={{fontSize:13,padding:"8px 11px"}} value={f[0]} onChange={e=>setFaq(i,0,e.target.value)} placeholder={lang==="ar"?"السؤال":"Question"}/>
                  <input className="inp" style={{fontSize:13,padding:"8px 11px"}} value={f[1]} onChange={e=>setFaq(i,1,e.target.value)} placeholder={lang==="ar"?"رد البوت":"Bot reply"}/>
                </div>
              ))}
              <button className="btn btn-ghost btn-sm" onClick={addFaq} style={{alignSelf:"flex-start"}}><Plus size={15}/>{t.addFaq}</button>
            </div>)}

          {field(<span style={{display:"flex",alignItems:"center",gap:6}}><Headphones size={14} color="var(--cool)"/>{t.escRules}</span>,
            <textarea className="inp" value={esc} onChange={e=>setEsc(e.target.value)}/>)}
          {field(<span style={{display:"flex",alignItems:"center",gap:6}}><Ticket size={14} color="var(--warm)"/>{t.ticketRules}</span>,
            <textarea className="inp" value={tkt} onChange={e=>setTkt(e.target.value)}/>)}
          {field(<span style={{display:"flex",alignItems:"center",gap:6}}><Flame size={14} color="var(--hot)"/>{t.hotRules}</span>,
            <textarea className="inp" value={hot} onChange={e=>setHot(e.target.value)} style={{marginBottom:0}}/>)}
        </div>

        {/* live preview */}
        <div className="card" style={{padding:0,overflow:"hidden",position:"sticky",top:0}}>
          <div style={{padding:"13px 16px",borderBottom:"1px solid var(--line)",display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,var(--wa),var(--teal))",display:"grid",placeItems:"center"}}><Bot size={18} color="#04140B"/></div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:13.5}}>{name||"—"}</div>
              <div className="dim" style={{fontSize:11}}>{t.industries[ind]} · {t.tones[tone]}</div>
            </div>
            <span className="pill" style={{color:"var(--wa)",fontSize:11}}><span className="dot live-dot" style={{background:"var(--wa)"}}/>{t.livePreview}</span>
          </div>
          <div className="scroll" style={{padding:16,display:"flex",flexDirection:"column",gap:10,minHeight:300,maxHeight:380,overflowY:"auto",
            background:"radial-gradient(circle at 50% 0%, rgba(37,211,102,.05), transparent 60%)"}}>
            {preview.map((m,i)=><div key={i} className={`bub ${m.t}`}>{m.x}</div>)}
          </div>
          <div style={{padding:"12px 14px",borderTop:"1px solid var(--line)",display:"flex",gap:8}}>
            <input className="inp" value={test} onChange={e=>setTest(e.target.value)} onKeyDown={e=>e.key==="Enter"&&runTest()} placeholder={t.testBot}/>
            <button className="btn btn-primary" style={{padding:"10px 14px"}} onClick={runTest}><Send size={16} style={{transform:lang==="ar"?"scaleX(-1)":"none"}}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== TICKETS ============================== */
function Tickets({ lang, toast }){
  const t = useT(lang);
  const [filter, setFilter] = useState("all");
  const counts = { all:TICKETS.length, open:TICKETS.filter(x=>x.status==="open").length, progress:TICKETS.filter(x=>x.status==="progress").length, closed:TICKETS.filter(x=>x.status==="closed").length };
  const rows = filter==="all"?TICKETS:TICKETS.filter(x=>x.status===filter);
  const tabs = [["all",lang==="ar"?"الكل":"All"],["open",t.tStatus.open],["progress",t.tStatus.progress],["closed",t.tStatus.closed]];

  return (
    <div className="fade-up">
      <PageHead title={t.ticketsTitle} sub={t.ticketsSub}
        right={<button className="btn btn-primary" onClick={()=>toast(lang==="ar"?"إنشاء تذكرة جديدة":"New ticket")}><Plus size={16}/>{lang==="ar"?"تذكرة جديدة":"New ticket"}</button>}/>
      {/* stat tabs */}
      <div className="grid-auto" style={{gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",marginBottom:18}}>
        {tabs.map(([k,lbl])=>{
          const cmap={all:"var(--wa)",open:"var(--hot)",progress:"var(--warm)",closed:"var(--txt3)"};
          return (
            <div key={k} onClick={()=>setFilter(k)} className="card hov" style={{padding:"14px 16px",cursor:"pointer",
              borderColor: filter===k?"rgba(37,211,102,.4)":"var(--line)",
              background: filter===k?"linear-gradient(180deg,rgba(37,211,102,.1),rgba(11,29,21,.6))":undefined}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span className="muted" style={{fontSize:13}}>{lbl}</span>
                <span className="dot" style={{background:cmap[k]}}/>
              </div>
              <div className="mono" style={{fontSize:26,fontWeight:700,marginTop:6}}>{counts[k]}</div>
            </div>
          );
        })}
      </div>

      <div className="card scroll" style={{padding:0,overflowX:"auto"}}>
        <table className="tbl">
          <thead><tr>
            <th>{t.cols.id}</th><th>{t.cols.subject}</th><th>{t.cols.customer}</th><th>{t.cols.priority}</th>
            <th>{t.cols.agent}</th><th>{t.cols.source}</th><th>{t.cols.last}</th><th>{t.cols.status}</th>
          </tr></thead>
          <tbody>
            {rows.map(tk=>(
              <tr key={tk.id}>
                <td className="mono" style={{color:"var(--wa)",fontWeight:700}}>{tk.id}</td>
                <td style={{fontWeight:600,maxWidth:240}}>{L(lang,tk.subj)}</td>
                <td>{lang==="ar"?tk.cust:tk.custEn}</td>
                <td><StatusPill status={tk.prio} lang={lang} map={t.priority} colorMap={PRIO_COLOR}/></td>
                <td><div style={{display:"flex",alignItems:"center",gap:7}}><Avatar name={L(lang,tk.agent)} size={26}/><span className="muted">{L(lang,tk.agent)}</span></div></td>
                <td className="muted">{SOURCES[lang][tk.src]}</td>
                <td className="dim">{L(lang,tk.last)}</td>
                <td><StatusPill status={tk.status} lang={lang} map={t.tStatus} colorMap={{open:"var(--hot)",progress:"var(--warm)",closed:"var(--txt3)"}}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================== CAMPAIGNS ============================== */
function Campaigns({ lang, toast }){
  const t = useT(lang);
  const [seg, setSeg] = useState(0);
  const [msg, setMsg] = useState(lang==="ar"?"عميلنا العزيز 👋 عرض خاص هذا الأسبوع على باقاتنا. تحب نرسل لك التفاصيل؟":"Dear customer 👋 special offer this week on our packages. Want the details?");
  const [when, setWhen] = useState("");
  const csmap={active:"var(--wa)",scheduled:"var(--warm)",done:"var(--txt3)"};
  const cslabel={ ar:{active:"نشطة",scheduled:"مجدولة",done:"منتهية"}, en:{active:"Active",scheduled:"Scheduled",done:"Done"} };

  return (
    <div className="fade-up">
      <PageHead title={t.campTitle} sub={t.campSub}/>
      <div className="grid-auto" style={{gridTemplateColumns:"minmax(0,1fr) minmax(0,1.4fr)",alignItems:"start"}}>
        {/* builder */}
        <div className="card" style={{padding:22}}>
          <h3 style={{fontSize:15.5,fontWeight:700,margin:"0 0 18px",display:"flex",alignItems:"center",gap:8}}><Plus size={17} color="var(--wa)"/>{t.newCamp}</h3>
          <label className="lbl">{t.segment}</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:18}}>
            {t.segments.map((s,i)=>(
              <button key={i} onClick={()=>setSeg(i)} className="btn-sm" style={{cursor:"pointer",fontFamily:"inherit",
                background:seg===i?"rgba(37,211,102,.16)":"rgba(255,255,255,.04)",
                border:`1px solid ${seg===i?"rgba(37,211,102,.4)":"var(--line)"}`,color:seg===i?"var(--wa)":"var(--txt2)",borderRadius:9,padding:"7px 11px",fontSize:12.5}}>{s}</button>
            ))}
          </div>
          <label className="lbl">{t.message}</label>
          <textarea className="inp" value={msg} onChange={e=>setMsg(e.target.value)} style={{marginBottom:6}}/>
          <div className="dim" style={{fontSize:11.5,marginBottom:18,textAlign:"end"}}>{msg.length} {lang==="ar"?"حرف":"chars"}</div>
          <label className="lbl">{t.schedule}</label>
          <input className="inp" type="datetime-local" value={when} onChange={e=>setWhen(e.target.value)} style={{marginBottom:18,colorScheme:"dark"}}/>
          <button className="btn btn-primary" style={{width:"100%",justifyContent:"center",padding:"13px"}}
            onClick={()=>toast(lang==="ar"?`تم إطلاق الحملة لشريحة: ${t.segments[seg]} 🚀`:`Campaign launched to: ${t.segments[seg]} 🚀`)}>
            <Send size={16} style={{transform:lang==="ar"?"scaleX(-1)":"none"}}/>{t.launch}</button>
        </div>

        {/* active campaigns */}
        <div className="card" style={{padding:22}}>
          <h3 style={{fontSize:15.5,fontWeight:700,margin:"0 0 16px"}}>{t.activeCamps}</h3>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {CAMPAIGNS.map((cmp,i)=>(
              <div key={i} className="glass" style={{borderRadius:14,padding:16}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,marginBottom:13,flexWrap:"wrap"}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:14.5}}>{L(lang,cmp.name)}</div>
                    <div className="dim" style={{fontSize:12,marginTop:3,display:"flex",alignItems:"center",gap:6}}>
                      <Users size={12}/>{t.segments[cmp.seg]} · <Clock size={12}/>{L(lang,cmp.when)}
                    </div>
                  </div>
                  <span className="tag" style={{color:csmap[cmp.status],background:`color-mix(in srgb, ${csmap[cmp.status]} 14%, transparent)`,border:`1px solid color-mix(in srgb, ${csmap[cmp.status]} 35%, transparent)`}}>
                    <span className="dot" style={{background:csmap[cmp.status]}}/>{cslabel[lang][cmp.status]}</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
                  {[["sent",cmp.sent,"var(--cool)"],["opened",cmp.opened,"var(--teal)"],["replied",cmp.replied,"var(--warm)"],["converted",cmp.converted,"var(--wa)"]].map(([k,v,c])=>(
                    <div key={k} style={{textAlign:"center"}}>
                      <div className="mono" style={{fontSize:18,fontWeight:700,color:c}}>{v.toLocaleString("en-US")}</div>
                      <div className="dim" style={{fontSize:11,marginTop:2}}>{t.cmetrics[k]}</div>
                    </div>
                  ))}
                </div>
                {cmp.sent>0 && <div className="track" style={{marginTop:13,height:6}}><span style={{width:`${Math.round(cmp.opened/cmp.sent*100)}%`}}/></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== LEADS CRM ============================== */
function Leads({ lang, toast }){
  const t = useT(lang);
  const [f, setF] = useState("all");
  const filters = [["all",lang==="ar"?"الكل":"All"],["hot",t.statuses.hot],["interested",t.statuses.interested],["followup",t.statuses.followup],["new",t.statuses.new]];
  const rows = (f==="all"?LEADS:LEADS.filter(l=>l.cls===f)).slice().sort((a,b)=>b.score-a.score);

  return (
    <div className="fade-up">
      <PageHead title={t.leadsTitle} sub={t.leadsSub}
        right={<div style={{display:"flex",gap:9}}>
          <button className="btn btn-ghost" onClick={()=>toast(lang==="ar"?"تم تصدير CSV ⬇️":"CSV exported ⬇️")}><ArrowUpRight size={15}/>{t.export}</button>
          <button className="btn btn-primary" onClick={()=>toast(lang==="ar"?"إضافة عميل جديد":"Add new lead")}><Plus size={16}/>{t.addLead}</button>
        </div>}/>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {filters.map(([k,lbl])=>(
          <button key={k} onClick={()=>setF(k)} className="btn-sm" style={{cursor:"pointer",fontFamily:"inherit",
            background:f===k?"rgba(37,211,102,.16)":"rgba(255,255,255,.04)",
            border:`1px solid ${f===k?"rgba(37,211,102,.4)":"var(--line)"}`,color:f===k?"var(--wa)":"var(--txt2)",borderRadius:9,padding:"8px 14px",fontSize:13}}>{lbl}</button>
        ))}
      </div>
      <div className="card scroll" style={{padding:0,overflowX:"auto"}}>
        <table className="tbl">
          <thead><tr>
            <th>{t.lcols.name}</th><th>{t.lcols.phone}</th><th>{t.lcols.source}</th><th>{t.lcols.class}</th>
            <th>{t.lcols.interest}</th><th>{t.lcols.last}</th><th style={{minWidth:130}}>{t.lcols.score}</th><th>{t.lcols.notes}</th>
          </tr></thead>
          <tbody>
            {rows.map((l,i)=>(
              <tr key={i}>
                <td><div style={{display:"flex",alignItems:"center",gap:9}}><Avatar name={lang==="ar"?l.name:l.nameEn} size={30}/><span style={{fontWeight:600}}>{lang==="ar"?l.name:l.nameEn}</span></div></td>
                <td className="mono dim" style={{fontSize:12.5}}>{l.phone}</td>
                <td className="muted">{SOURCES[lang][l.src]}</td>
                <td><StatusPill status={l.cls} lang={lang}/></td>
                <td className="muted">{L(lang,l.interest)}</td>
                <td className="dim">{L(lang,l.last)}</td>
                <td><ScoreBar v={l.score}/></td>
                <td style={{maxWidth:200}}><span className="muted" style={{fontSize:12.5,display:"inline-flex",gap:5}}><Sparkles size={13} color="var(--violet)" style={{flexShrink:0,marginTop:2}}/>{L(lang,l.note)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================== SOCIAL CLASSIFICATION ============================== */
function Social({ lang }){
  const t = useT(lang);
  const srcIcon = { X:Share2, Instagram:Share2, TikTok:Share2, "Website Form":Globe };
  return (
    <div className="fade-up">
      <PageHead title={t.socialTitle} sub={t.socialSub}
        right={<span className="pill" style={{color:"var(--violet)",borderColor:"rgba(169,139,255,.3)",background:"rgba(169,139,255,.08)"}}><Sparkles size={13}/>Beta</span>}/>
      <div className="card scroll" style={{padding:0,overflowX:"auto"}}>
        <table className="tbl">
          <thead><tr>
            <th>{t.scols.source}</th><th style={{minWidth:280}}>{t.scols.text}</th><th>{t.scols.class}</th><th>{t.scols.prio}</th><th>{t.scols.action}</th>
          </tr></thead>
          <tbody>
            {SOCIAL.map((s,i)=>{
              const c = SCLASS_COLOR[s.cls];
              return (
                <tr key={i}>
                  <td><span className="tag" style={{background:"rgba(255,255,255,.05)",border:"1px solid var(--line)",color:"var(--txt2)"}}><Share2 size={12}/>{s.srcName}</span></td>
                  <td style={{maxWidth:340,lineHeight:1.55}}>{L(lang,s.text)}</td>
                  <td><span className="tag" style={{color:c,background:`color-mix(in srgb, ${c} 14%, transparent)`,border:`1px solid color-mix(in srgb, ${c} 35%, transparent)`}}><span className="dot" style={{background:c}}/>{t.sClasses[s.cls]}</span></td>
                  <td><StatusPill status={s.prio} lang={lang} map={t.priority} colorMap={PRIO_COLOR}/></td>
                  <td><span className="muted" style={{fontSize:13,display:"inline-flex",gap:6,alignItems:"center"}}><Zap size={13} color="var(--wa)"/>{L(lang,s.action)}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================== PRICING ============================== */
function PricingView({ lang, embedded=false, onEnter }){
  const t = useT(lang);
  return (
    <div className={embedded?"":"fade-up"}>
      {!embedded && <PageHead title={t.pricingTitle} sub={t.pricingSub}/>}
      {embedded && <SectionHead kicker={lang==="ar"?"الأسعار":"Pricing"} title={t.pricingTitle} sub={t.pricingSub}/>}
      <div className="grid-auto" style={{gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",alignItems:"stretch",maxWidth:1000,margin:"0 auto"}}>
        {t.plans.map((p,i)=>{
          const pop = i===1;
          return (
            <div key={i} className="card hov" style={{padding:"28px 24px",display:"flex",flexDirection:"column",position:"relative",
              border: pop?"1px solid rgba(37,211,102,.45)":"1px solid var(--line)",
              background: pop?"linear-gradient(180deg,rgba(37,211,102,.1),rgba(11,29,21,.7))":undefined,
              boxShadow: pop?"0 30px 70px -40px var(--glow)":undefined}}>
              {pop && <span className="pill" style={{position:"absolute",top:-13,insetInlineStart:"50%",transform:"translateX(-50%)",
                background:"linear-gradient(90deg,var(--wa),var(--teal))",color:"#04140B",border:"none",fontWeight:700}}><Star size={12}/>{t.mostPopular}</span>}
              <div style={{fontSize:19,fontWeight:700}}>{p[0]}</div>
              <div className="muted" style={{fontSize:13.5,marginTop:4,marginBottom:18}}>{p[1]}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:7,marginBottom:22}}>
                {p[3] ? <>
                  <span className="mono" style={{fontSize:38,fontWeight:700,letterSpacing:"-1px"}}>{p[2]}</span>
                  <span className="muted" style={{fontSize:14}}>{p[3]} {t.perMonth}</span>
                </> : <span style={{fontSize:26,fontWeight:700}}>{p[2]}</span>}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:11,marginBottom:24,flex:1}}>
                {p[4].map((f,fi)=>(
                  <div key={fi} style={{display:"flex",gap:9,alignItems:"flex-start",fontSize:13.5}}>
                    <span style={{color:"var(--wa)",flexShrink:0,marginTop:1}}><Check size={16}/></span>
                    <span className="muted">{f}</span>
                  </div>
                ))}
              </div>
              <button className={pop?"btn btn-primary":"btn btn-ghost"} style={{width:"100%",justifyContent:"center",padding:"12px"}}
                onClick={onEnter}>{i===2?t.bookDemo:t.choosePlan}</button>
            </div>
          );
        })}
      </div>
      <div className="glass" style={{maxWidth:760,margin:"26px auto 0",borderRadius:14,padding:"14px 18px",display:"flex",gap:11,alignItems:"flex-start"}}>
        <Shield size={18} color="var(--warm)" style={{flexShrink:0,marginTop:2}}/>
        <p className="muted" style={{margin:0,fontSize:13,lineHeight:1.6}}>{t.metaNote}</p>
      </div>
    </div>
  );
}

/* ============================== SOURCES (shared) ============================== */
const SRC_META = {
  whatsapp:{ label:{ar:"واتساب",en:"WhatsApp"}, Icon:MessageCircle, c:"#25D366" },
  instagram:{ label:{ar:"انستقرام",en:"Instagram"}, Icon:Instagram, c:"#E1306C" },
  x:{ label:{ar:"X / تويتر",en:"X / Twitter"}, Icon:AtSign, c:"#9aa7b2" },
  tiktok:{ label:{ar:"تيك توك",en:"TikTok"}, Icon:Music2, c:"#0FD9A3" },
  website:{ label:{ar:"الموقع",en:"Website"}, Icon:Globe, c:"#46B0FF" },
};
const SRC_ORDER = ["whatsapp","instagram","x","tiktok","website"];

function SrcChip({ k, lang }){
  const m = SRC_META[k]; const Ic = m.Icon;
  return (
    <span className="src-chip" style={{color:m.c,borderColor:m.c+"55",background:m.c+"14"}}>
      <Ic size={13}/>{m.label[lang]}
    </span>
  );
}

/* ============================== LIVE FLOW ============================== */
function LiveFlow({ lang }){
  const t = useT(lang);
  const lf = t.lf;
  const script = lf.script;
  const [idx, setIdx] = useState(0);     // number of revealed script items
  const [playing, setPlaying] = useState(true);
  const [score, setScore] = useState(0);
  const chatRef = useRef(null);

  const DELAY = { in:1250, out:1500, typing:1000, analyze:1900, ticket:1350, human:1350, crm:1500 };

  // advance the timeline
  useEffect(()=>{
    if(!playing || idx>=script.length) return;
    const k = idx===0 ? null : script[idx-1].k;
    const d = idx===0 ? 450 : (DELAY[k] ?? 1200);
    const x = setTimeout(()=>setIdx(i=>i+1), d);
    return ()=>clearTimeout(x);
  },[playing, idx, script]);

  const revealed = script.slice(0, idx);
  const keys = revealed.map(s=>s.k);
  const hasIn = keys.includes("in");
  const hasOut = keys.includes("out");
  const analyzed = keys.includes("analyze");
  const ticketed = keys.includes("ticket");
  const humaned = keys.includes("human");
  const crmed = keys.includes("crm");
  const finished = idx>=script.length;
  const isTyping = revealed.length>0 && revealed[revealed.length-1].k==="typing" && idx<script.length;
  const bubbles = revealed.filter(s=>s.k==="in"||s.k==="out");

  // animate lead score on analyze
  useEffect(()=>{
    if(!analyzed){ setScore(0); return; }
    let v=0; const target=91;
    const iv=setInterval(()=>{ v+=3; if(v>=target){ v=target; clearInterval(iv);} setScore(v); },28);
    return ()=>clearInterval(iv);
  },[analyzed]);

  // auto-scroll chat
  useEffect(()=>{ if(chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; },[idx]);

  const done = [hasIn, hasOut, analyzed, analyzed, ticketed, humaned, crmed];
  const cur = done.lastIndexOf(true);
  const replay = ()=>{ setIdx(0); setScore(0); setPlaying(true); };

  return (
    <div className="fade-up">
      <PageHead title={lf.title} sub={lf.sub} right={
        <div style={{display:"flex",gap:9,alignItems:"center"}}>
          {playing && !finished &&
            <span className="pill" style={{color:"var(--hot)",borderColor:"rgba(255,92,107,.3)",background:"rgba(255,92,107,.08)"}}>
              <span className="dot live-dot" style={{background:"var(--hot)"}}/>{lf.live}</span>}
          {!finished
            ? <button className="btn btn-ghost btn-sm" onClick={()=>setPlaying(p=>!p)}>{playing?<><PauseCircle size={15}/>{lf.pause}</>:<><PlayCircle size={15}/>{lf.play}</>}</button>
            : <button className="btn btn-primary btn-sm" onClick={replay}><RefreshCw size={15}/>{lf.replay}</button>}
        </div>
      }/>

      <div className="lf-grid">
        {/* LEFT — WhatsApp phone */}
        <div className="lf-phone" style={{height:528}}>
          <div style={{display:"flex",alignItems:"center",gap:11,padding:"13px 15px",borderBottom:"1px solid var(--line)",background:"rgba(37,211,102,.06)"}}>
            <Avatar name={lang==="ar"?"عميل":"Lead"} size={40}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,fontSize:14}}>{lang==="ar"?"عميل جديد":"New lead"}</div>
              <div className="dim" style={{fontSize:11,display:"flex",alignItems:"center",gap:6,marginTop:3}}>
                {lf.via} <SrcChip k="instagram" lang={lang}/>
              </div>
            </div>
            <MessageCircle size={18} color="var(--wa)"/>
          </div>
          <div className="lf-chat scroll" ref={chatRef}>
            {bubbles.map((b,i)=>(
              <div key={i} className={`bub bub-anim ${b.k==="in"?"in":"out"}`}>
                {b.x}
                <div className="mono" style={{fontSize:10,opacity:.5,marginTop:4,textAlign:"end"}}>{b.tm}</div>
              </div>
            ))}
            {isTyping && <div className="bub in" style={{padding:0,width:"fit-content"}}><div className="typing-dots"><i/><i/><i/></div></div>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderTop:"1px solid var(--line)"}}>
            <Smile size={18} color="var(--txt3)"/>
            <div className="muted" style={{flex:1,fontSize:13}}>{isTyping?lf.typing:"..."}</div>
            <div style={{width:34,height:34,borderRadius:"50%",background:"var(--wa)",display:"grid",placeItems:"center"}}><Send size={15} color="#04140B"/></div>
          </div>
        </div>

        {/* RIGHT — analysis + pipeline */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div className="card" style={{padding:18,borderColor:analyzed?"rgba(37,211,102,.3)":"var(--line)",transition:"border-color .4s"}}>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:15}}>
              <div style={{width:34,height:34,borderRadius:10,background:"rgba(169,139,255,.16)",display:"grid",placeItems:"center"}}><Brain size={18} color="var(--violet)"/></div>
              <span style={{fontWeight:700,fontSize:15}}>{lf.analysis}</span>
              {analyzed && <span className="pill" style={{marginInlineStart:"auto",color:"var(--wa)",fontSize:11}}><Sparkles size={12}/>{lf.done}</span>}
            </div>
            <div className="dim" style={{fontSize:12,marginBottom:5}}>{lf.intentLabel}</div>
            <div style={{fontWeight:600,fontSize:14,marginBottom:16,minHeight:20,color:analyzed?"var(--txt)":"var(--txt3)"}}>{analyzed?lf.intentVal:"—"}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:7}}>
              <span className="dim" style={{fontSize:12}}>{lf.scoreLabel}</span>
              <span className="mono" style={{fontWeight:700,fontSize:18,color: score>=80?"var(--hot)":score>=50?"var(--warm)":"var(--txt3)"}}>{score}<span style={{fontSize:12,opacity:.6}}>/100</span></span>
            </div>
            <div className="track" style={{height:9,marginBottom:16}}><span style={{width:score+"%",background: score>=80?"linear-gradient(90deg,var(--warm),var(--hot))":"linear-gradient(90deg,var(--teal),var(--wa))",transition:"width .12s linear"}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span className="dim" style={{fontSize:12}}>{lf.classLabel}</span>
              {analyzed
                ? <span className="pill" style={{color:"var(--hot)",borderColor:"rgba(255,92,107,.35)",background:"rgba(255,92,107,.1)",fontSize:12.5,fontWeight:700}}><Flame size={13}/>{lf.classHot}</span>
                : <span className="dim" style={{fontSize:13}}>—</span>}
            </div>
          </div>

          <div className="card" style={{padding:18}}>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:15}}>
              <Workflow size={17} color="var(--wa)"/>
              <span style={{fontWeight:700,fontSize:15}}>{lf.pipeline}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              {lf.steps.map((s,i)=>{ const Ic=s[2]; const on=done[i]; const isCur=i===cur && !finished; return (
                <div key={i} className={`step ${on?"on":""} ${isCur?"cur":""}`}>
                  <div className="step-ic"><Ic size={19}/></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:13.5,display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                      {s[0]}
                      {i===4 && ticketed && <span className="mono" style={{fontSize:10.5,color:"var(--wa)"}}>{lf.ticketId}</span>}
                      {i===5 && humaned && <span className="mono" style={{fontSize:10.5,color:"var(--teal)"}}>{lf.agentName}</span>}
                    </div>
                    <div className="muted" style={{fontSize:12,lineHeight:1.5,marginTop:2}}>{s[1]}</div>
                  </div>
                  <div className="step-check"><BadgeCheck size={18}/></div>
                </div>
              );})}
            </div>
            {crmed && (
              <div className="fade-up" style={{marginTop:14,padding:"12px 14px",borderRadius:12,border:"1px solid rgba(37,211,102,.25)",background:"rgba(37,211,102,.07)",display:"flex",gap:10,alignItems:"flex-start"}}>
                <RefreshCw size={16} color="var(--wa)" style={{flexShrink:0,marginTop:2}}/>
                <div style={{fontSize:12.5,lineHeight:1.55}}>
                  <div style={{fontWeight:700,marginBottom:2}}>{lf.crmNote}</div>
                  <div className="muted">{lf.followupNote}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== APP SHELL ============================== */
const NAV = [
  ["liveflow", Zap], ["dashboard", LayoutDashboard], ["inbox", MessageSquare], ["agent", Bot], ["tickets", Ticket],
  ["campaigns", Send], ["leads", Users], ["social", Share2], ["pricing", Tag],
];

function Sidebar({ lang, view, setView, open, setOpen, onHome }){
  const t = useT(lang);
  return (
    <aside className={`sidebar glass scroll ${open?"open":""}`} style={{display:"flex",flexDirection:"column",
      borderInlineEnd:"1px solid var(--line)",padding:"16px 14px",overflowY:"auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:11,padding:"4px 6px 18px",cursor:"pointer"}} onClick={onHome}>
        <Logo size={38}/>
        <div><div style={{fontWeight:700,fontSize:14.5}}>{t.brand}</div>
          <div className="dim" style={{fontSize:10.5}}>{t.tagline}</div></div>
      </div>
      <nav style={{display:"flex",flexDirection:"column",gap:5,flex:1}}>
        {NAV.map(([k,Ic])=>(
          <div key={k} className={`nav-item ${view===k?"on":""}`} onClick={()=>{setView(k);setOpen(false);}}>
            <Ic size={19}/><span>{t.nav[k]}</span>
            {k==="inbox" && <span style={{marginInlineStart:"auto",background:"var(--wa)",color:"#04140B",borderRadius:999,fontSize:10.5,fontWeight:700,padding:"1px 7px"}}>3</span>}
            {k==="tickets" && <span style={{marginInlineStart:"auto",background:"rgba(255,92,107,.2)",color:"var(--hot)",borderRadius:999,fontSize:10.5,fontWeight:700,padding:"1px 7px"}}>2</span>}
          </div>
        ))}
      </nav>
      {/* upgrade card */}
      <div className="card" style={{padding:16,marginTop:12,background:"linear-gradient(135deg,rgba(37,211,102,.14),rgba(11,29,21,.6))",border:"1px solid rgba(37,211,102,.25)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <div style={{width:30,height:30,borderRadius:9,background:"rgba(37,211,102,.2)",display:"grid",placeItems:"center"}}><Sparkles size={16} color="var(--wa)"/></div>
          <span style={{fontWeight:700,fontSize:13.5}}>Growth Plan</span>
        </div>
        <div className="muted" style={{fontSize:12,lineHeight:1.5,marginBottom:10}}>{lang==="ar"?"استهلكت 4,120 من 6,000 محادثة":"4,120 of 6,000 chats used"}</div>
        <div className="track" style={{marginBottom:12}}><span style={{width:"68%"}}/></div>
        <button className="btn btn-primary btn-sm" style={{width:"100%",justifyContent:"center"}} onClick={()=>setView("pricing")}>{lang==="ar"?"ترقية":"Upgrade"}</button>
      </div>
    </aside>
  );
}

function Topbar({ lang, setLang, view, setOpen }){
  const t = useT(lang);
  return (
    <header className="glass" style={{position:"sticky",top:0,zIndex:40,padding:"12px 20px",
      borderBottom:"1px solid var(--line)",display:"flex",alignItems:"center",gap:14}}>
      <button className="btn-icon menu-btn" onClick={()=>setOpen(o=>!o)}><Menu size={18}/></button>
      <div style={{position:"relative",flex:1,maxWidth:360}} className="hide-mob">
        <Search size={16} style={{position:"absolute",insetInlineStart:13,top:11,color:"var(--txt3)"}}/>
        <input className="inp" placeholder={t.search} style={{paddingInlineStart:38,paddingTop:9,paddingBottom:9}}/>
      </div>
      <div style={{flex:1}} className="hide-mob"/>
      <span className="pill" style={{color:"var(--warm)",borderColor:"rgba(255,178,62,.3)",background:"rgba(255,178,62,.08)"}}>
        <span className="dot live-dot" style={{background:"var(--warm)"}}/>{t.demoBadge}
      </span>
      <button className="btn btn-ghost btn-sm" onClick={()=>setLang(l=>l==="ar"?"en":"ar")}><Globe size={15}/>{lang==="ar"?"EN":"ع"}</button>
      <button className="btn-icon" style={{position:"relative"}}>
        <Bell size={18}/><span className="dot" style={{position:"absolute",top:9,insetInlineEnd:10,background:"var(--hot)",border:"2px solid var(--panel)"}}/>
      </button>
      <div style={{display:"flex",alignItems:"center",gap:9}} className="hide-mob">
        <Avatar name="A.LABS" size={36}/>
        <div><div style={{fontWeight:700,fontSize:13}}>A.LABS</div><div className="dim" style={{fontSize:11,display:"flex",alignItems:"center",gap:4}}><span className="dot" style={{background:"var(--wa)",width:6,height:6}}/>{t.online}</div></div>
      </div>
    </header>
  );
}

function Toast({ msg }){
  if(!msg) return null;
  return (
    <div className="fade-up" style={{position:"fixed",bottom:24,insetInlineStart:"50%",transform:"translateX(-50%)",zIndex:100,
      background:"linear-gradient(180deg,var(--panel2),var(--panel))",border:"1px solid rgba(37,211,102,.4)",
      borderRadius:13,padding:"13px 20px",boxShadow:"0 20px 50px -20px rgba(0,0,0,.9)",display:"flex",alignItems:"center",gap:10,fontWeight:600,fontSize:14}}>
      <CheckCheck size={18} color="var(--wa)"/>{msg}
    </div>
  );
}

/* ============================== ROOT ============================== */
function WhatsAISalesHub(){
  const [lang, setLang] = useState("ar");
  const [screen, setScreen] = useState("landing"); // landing | app
  const [view, setView] = useState("liveflow");
  const [open, setOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const t = useT(lang);

  useEffect(()=>{
    if(document.getElementById("wa-style")) return;
    const s = document.createElement("style"); s.id="wa-style"; s.textContent = CSS; document.head.appendChild(s);
  },[]);

  const toast = (m) => { setToastMsg(m); clearTimeout(window.__waT); window.__waT = setTimeout(()=>setToastMsg(""),2600); };

  const views = {
    liveflow:<LiveFlow lang={lang}/>,
    dashboard:<Dashboard lang={lang}/>, inbox:<Inbox lang={lang} toast={toast}/>,
    agent:<AgentBuilder lang={lang} toast={toast}/>, tickets:<Tickets lang={lang} toast={toast}/>,
    campaigns:<Campaigns lang={lang} toast={toast}/>, leads:<Leads lang={lang} toast={toast}/>,
    social:<Social lang={lang}/>, pricing:<PricingView lang={lang} onEnter={()=>toast(lang==="ar"?"شكراً! بنتواصل معك لحجز الديمو 📅":"Thanks! We'll reach out to book your demo 📅")}/>,
  };

  return (
    <div className="wa-root" dir={lang==="ar"?"rtl":"ltr"} style={{minHeight:"100vh"}}>
      {screen==="landing" ? (
        <Landing lang={lang} onEnter={()=>{setScreen("app");setView("liveflow");}} onToggleLang={()=>setLang(l=>l==="ar"?"en":"ar")}/>
      ) : (
        <div className="app-grid">
          <div className={`backdrop ${open?"show":""}`} onClick={()=>setOpen(false)}/>
          <Sidebar lang={lang} view={view} setView={setView} open={open} setOpen={setOpen} onHome={()=>setScreen("landing")}/>
          <main style={{flex:1,minWidth:0,display:"flex",flexDirection:"column"}}>
            <Topbar lang={lang} setLang={setLang} view={view} setOpen={setOpen}/>
            <div className="scroll" style={{flex:1,overflowY:"auto",padding:"24px clamp(14px,3vw,30px)"}}>
              {views[view]}
            </div>
          </main>
        </div>
      )}
      <Toast msg={toastMsg}/>
    </div>
  );
}

export default WhatsAISalesHub;
