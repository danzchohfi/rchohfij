/* ============================================================
   RCJ — Consultoria em Engenharia
   Motion engine: progressive enhancement
   CSS → GSAP/ScrollTrigger → Lenis → Three.js (WebGL hero)
   Every layer guarded; reduced-motion fully honored.
   ============================================================ */

import * as THREE from "./vendor/three.module.min.js";

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const gsap = window.gsap || null;
const ScrollTrigger = window.ScrollTrigger || null;
if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

/* ---------- WhatsApp wiring ---------- */
(function wireWhatsApp() {
  const phone = "5511981028224";
  const msg = encodeURIComponent(
    "Olá! Vim pelo site da RCJ e gostaria de conversar sobre apoio à decisão técnica em um empreendimento."
  );
  const url = `https://wa.me/${phone}?text=${msg}`;
  $$("[data-wa]").forEach((a) => {
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });
})();

/* ---------- Year ---------- */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Header scroll state ---------- */
(function header() {
  const header = $("#header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

/* ---------- Mobile menu ---------- */
(function mobileMenu() {
  const toggle = $("#navToggle");
  const menu = $("#mobileMenu");
  if (!toggle || !menu) return;
  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  $$("#mobileMenu a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
})();

/* ---------- Lenis smooth scroll ---------- */
let lenis = null;
(function smoothScroll() {
  if (REDUCED || !window.Lenis) return;
  lenis = new window.Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  if (ScrollTrigger) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
})();

/* Anchor smooth scroll (works with or without Lenis) */
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id === "#" || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -10 });
    else target.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
  });
});

/* ---------- Reveal on scroll ---------- */
(function reveals() {
  const items = $$("[data-reveal]");
  if (!items.length) return;
  if (REDUCED) { items.forEach((el) => el.classList.add("is-in")); return; }

  if (gsap && ScrollTrigger) {
    ScrollTrigger.batch(items, {
      start: "top 88%",
      onEnter: (els) =>
        gsap.to(els, {
          opacity: 1, y: 0, duration: 0.95, stagger: 0.09, ease: "power3.out",
          overwrite: true,
        }),
    });
    // gsap controls these — clear the CSS transition baseline
    gsap.set(items, { opacity: 0, y: 28 });
  } else {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }),
      { threshold: 0.18 }
    );
    items.forEach((el) => io.observe(el));
  }
})();

/* ---------- Stroke-draw blueprint SVG paths ---------- */
(function strokeDraw() {
  const paths = $$(".ts-line, .bp-draw, .tp-draw, .pl-line");
  paths.forEach((p) => {
    try {
      const len = p.getTotalLength ? p.getTotalLength() : 0;
      if (!len) return;
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = REDUCED ? 0 : len;
      p.dataset.len = len;
    } catch (_) {}
  });
  if (REDUCED) return;

  // Hero fallback truss draws immediately (only visible without WebGL)
  const heroLines = $$("#trussFallback .ts-line");
  if (heroLines.length && gsap) {
    gsap.to(heroLines, { strokeDashoffset: 0, duration: 1.6, stagger: 0.18, ease: "power2.inOut", delay: 0.3 });
  }

  if (!gsap || !ScrollTrigger) {
    // fallback: just show them
    paths.forEach((p) => { if (!p.closest("#trussFallback")) p.style.strokeDashoffset = 0; });
    return;
  }

  // Draw blueprint rules + tripod when scrolled into view
  $$(".blueprint-rule, .contato__truss, .tripod__diagram").forEach((wrap) => {
    const lines = $$(".bp-draw, .tp-draw", wrap);
    const nodes = $$(".tp-node", wrap);
    if (!lines.length) return;
    ScrollTrigger.create({
      trigger: wrap,
      start: "top 82%",
      once: true,
      onEnter: () => {
        gsap.to(lines, { strokeDashoffset: 0, duration: 1.3, stagger: 0.12, ease: "power2.inOut" });
        if (nodes.length) gsap.to(nodes, { opacity: 1, duration: 0.5, stagger: 0.15, delay: 0.9 });
      },
    });
  });
})();

/* ---------- Counters ---------- */
(function counters() {
  const nums = $$("[data-count]");
  if (!nums.length) return;
  const run = (el) => {
    const end = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (REDUCED || !gsap) { el.textContent = end + suffix; return; }
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end, duration: 1.8, ease: "power2.out",
      onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; },
    });
  };
  if (gsap && ScrollTrigger) {
    nums.forEach((el) => ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => run(el) }));
  } else {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: 0.5 });
    nums.forEach((el) => io.observe(el));
  }
})();

/* ---------- Marquee ---------- */
(function marquee() {
  const track = $(".marquee__track");
  if (!track || REDUCED || !gsap) return;
  gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
})();

/* ---------- Custom cursor ---------- */
(function cursor() {
  const cur = $("#cursor");
  if (!cur || REDUCED || window.matchMedia("(hover:none)").matches) return;
  const dot = $(".cursor__dot", cur);
  const ring = $(".cursor__ring", cur);
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    cur.classList.add("is-active");
    dot.style.transform = `translate(${mx}px,${my}px)`;
  });
  const loop = () => {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(loop);
  };
  loop();
  $$('a, button, [data-wa], .service, .vcard, .pillar, .tcard').forEach((el) => {
    el.addEventListener("mouseenter", () => cur.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => cur.classList.remove("is-hover"));
  });
})();

/* ---------- Hero coordinate micro-flicker (sober) ---------- */
(function coord() {
  const el = $("#heroCoord");
  if (!el || REDUCED) return;
  const base = "N 23°33' · W 46°38'";
  el.textContent = base;
})();

/* ---------- Floating WhatsApp reveal ---------- */
(function waFloat() {
  const wa = $(".wa-float");
  if (!wa) return;
  if (REDUCED) { wa.classList.add("is-in"); return; }
  setTimeout(() => wa.classList.add("is-in"), 1400);
})();

/* ============================================================
   THREE.JS — HERO STRUCTURAL TRUSS (3D wireframe bridge)
   ============================================================ */
(function heroTruss() {
  const canvas = $("#trussCanvas");
  if (!canvas || REDUCED) return;

  // WebGL feature detection
  function webglOK() {
    try {
      const c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch (_) { return false; }
  }
  if (!webglOK()) return; // SVG fallback stays visible

  document.documentElement.classList.add("webgl");

  let renderer, scene, camera, group, segments, nodePoints, raf;
  const GOLD = 0xc7a45a;
  const NAVY = 0x0e2436;

  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
  } catch (_) {
    document.documentElement.classList.remove("webgl");
    return;
  }

  const sizes = { w: canvas.clientWidth || innerWidth, h: canvas.clientHeight || innerHeight };
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(sizes.w, sizes.h, false);

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(NAVY, 9, 20);

  camera = new THREE.PerspectiveCamera(38, sizes.w / sizes.h, 0.1, 100);
  camera.position.set(0.2, 0.9, 8.4);
  camera.lookAt(0, 0, 0);

  group = new THREE.Group();
  scene.add(group);

  /* ----- Build parametric Warren truss bridge ----- */
  const PANELS = 9;          // bays along the span
  const H = 1.45;            // truss height
  const D = 2.0;             // bridge width (between two trusses)
  const L = 1.25;            // panel length
  const halfSpan = (PANELS * L) / 2;

  // node helper
  const node = (i, top, side) =>
    new THREE.Vector3(i * L - halfSpan, top ? H / 2 : -H / 2, (side ? D / 2 : -D / 2));

  const members = []; // each: [Vector3, Vector3]
  const add = (a, b) => members.push(a, b);

  // ordered for a pleasing "construction" sequence:
  // 1) bottom chords
  for (let s = 0; s < 2; s++)
    for (let i = 0; i < PANELS; i++) add(node(i, false, s), node(i + 1, false, s));
  // 2) verticals
  for (let s = 0; s < 2; s++)
    for (let i = 0; i <= PANELS; i++) add(node(i, false, s), node(i, true, s));
  // 3) diagonals (Warren — alternating)
  for (let s = 0; s < 2; s++)
    for (let i = 0; i < PANELS; i++) {
      if (i % 2 === 0) add(node(i, false, s), node(i + 1, true, s));
      else add(node(i + 1, false, s), node(i, true, s));
    }
  // 4) top chords
  for (let s = 0; s < 2; s++)
    for (let i = 0; i < PANELS; i++) add(node(i, true, s), node(i + 1, true, s));
  // 5) deck cross-bracing (bottom) + top lateral bracing
  for (let i = 0; i <= PANELS; i++) {
    add(node(i, false, 0), node(i, false, 1));   // deck transverse
    add(node(i, true, 0), node(i, true, 1));     // top transverse
  }
  // 6) deck X sway bracing
  for (let i = 0; i < PANELS; i++) {
    add(node(i, false, 0), node(i + 1, false, 1));
    add(node(i + 1, false, 0), node(i, false, 1));
  }

  const positions = new Float32Array(members.length * 3);
  members.forEach((v, i) => { positions[i * 3] = v.x; positions[i * 3 + 1] = v.y; positions[i * 3 + 2] = v.z; });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.9 });
  segments = new THREE.LineSegments(geo, mat);
  group.add(segments);

  // joints as subtle points
  const jointSet = new Map();
  members.forEach((v) => jointSet.set(`${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`, v));
  const jp = new Float32Array(jointSet.size * 3);
  let k = 0;
  jointSet.forEach((v) => { jp[k++] = v.x; jp[k++] = v.y; jp[k++] = v.z; });
  const jgeo = new THREE.BufferGeometry();
  jgeo.setAttribute("position", new THREE.BufferAttribute(jp, 3));
  const jmat = new THREE.PointsMaterial({ color: 0xd8bd83, size: 0.055, transparent: true, opacity: 0 });
  nodePoints = new THREE.Points(jgeo, jmat);
  group.add(nodePoints);

  group.rotation.set(0.04, -0.5, 0);

  // assembly animation via draw range
  const totalV = members.length;
  geo.setDrawRange(0, 0);
  const reveal = { count: 0 };
  if (gsap) {
    gsap.to(reveal, {
      count: totalV, duration: 2.6, ease: "power2.inOut", delay: 0.35,
      onUpdate: () => geo.setDrawRange(0, Math.floor(reveal.count)),
      onComplete: () => geo.setDrawRange(0, totalV),
    });
    gsap.to(jmat, { opacity: 0.85, duration: 1.2, delay: 2.4 });
  } else {
    geo.setDrawRange(0, totalV);
    jmat.opacity = 0.85;
  }

  canvas.classList.add("is-ready");

  /* ----- interaction: pointer parallax + scroll ----- */
  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  window.addEventListener("mousemove", (e) => {
    target.x = (e.clientX / innerWidth - 0.5);
    target.y = (e.clientY / innerHeight - 0.5);
  }, { passive: true });

  let scrollProg = 0;
  const onScroll = () => {
    const hero = $("#hero");
    if (!hero) return;
    const r = hero.getBoundingClientRect();
    scrollProg = Math.min(1, Math.max(0, -r.top / (r.height || 1)));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----- resize ----- */
  function resize() {
    sizes.w = canvas.clientWidth || innerWidth;
    sizes.h = canvas.clientHeight || innerHeight;
    camera.aspect = sizes.w / sizes.h;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.w, sizes.h, false);
  }
  window.addEventListener("resize", resize);

  /* ----- render loop ----- */
  let t = 0;
  function tick() {
    t += 0.0016;
    pointer.x += (target.x - pointer.x) * 0.05;
    pointer.y += (target.y - pointer.y) * 0.05;
    if (group) {
      group.rotation.y = -0.5 + Math.sin(t) * 0.18 + pointer.x * 0.35;
      group.rotation.x = 0.04 + pointer.y * 0.18 + scrollProg * 0.25;
      group.position.y = 0.1 - scrollProg * 1.2;
      if (segments) segments.material.opacity = 0.9 * (1 - scrollProg * 0.85);
      if (nodePoints) nodePoints.material.opacity = Math.max(0, 0.85 * (1 - scrollProg));
    }
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }
  tick();

  // pause when tab hidden (perf)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else tick();
  });
})();

/* ============================================================
   PRELOADER (runs last; reveals page)
   ============================================================ */
(function preloader() {
  const pl = $("#preloader");
  if (!pl) return;
  if (REDUCED) { pl.remove(); return; }

  const countEl = $("[data-pl-count]", pl);
  const lines = $$(".pl-line", pl);

  const finish = () => {
    pl.classList.add("is-done");
    setTimeout(() => pl.remove(), 1100);
  };

  if (gsap) {
    const tl = gsap.timeline();
    tl.to(lines, { strokeDashoffset: 0, duration: 0.9, stagger: 0.12, ease: "power2.inOut" });
    if (countEl) {
      const c = { v: 0 };
      tl.to(c, { v: 100, duration: 1.1, ease: "power1.inOut",
        onUpdate: () => { countEl.textContent = String(Math.round(c.v)).padStart(2, "0"); } }, 0);
    }
    tl.add(finish, "+=0.15");
  } else {
    // no gsap: brief delay then reveal
    if (countEl) countEl.textContent = "100";
    setTimeout(finish, 600);
  }
})();
