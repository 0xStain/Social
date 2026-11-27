/* solo-fx.js — animation upgrade layer for Solo's Links.
   Add one line before </body> in your page:  <script src="solo-fx.js" defer></script>
   Nothing in your HTML/CSS needs to change. */
(() => {
/* Animations run automatically, even if the device has "reduce motion" on.
   To respect that setting instead, open the page once as  index.html?fx=off
   (and  ?fx=on  turns automatic mode back on). */
const q = location.search.match(/[?&]fx=(on|off)\b/);
if (q) { try { localStorage.setItem("solo-fx", q[1]); } catch (e) {} }
let pref = null; try { pref = localStorage.getItem("solo-fx"); } catch (e) {}
let reduce = matchMedia("(prefers-reduced-motion: reduce)").matches && pref === "off";
if (!reduce) {
  /* remove the page's own reduce-motion rule so its animations run too */
  for (const sh of document.styleSheets) {
    let rules; try { rules = sh.cssRules; } catch (e) { continue; }
    for (let i = rules.length - 1; i >= 0; i--)
      if (rules[i].media && /prefers-reduced-motion/.test(rules[i].media.mediaText)) sh.deleteRule(i);
  }
}
const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ================= CSS ================= */
const css = `
@property --ang{syntax:"<angle>";inherits:false;initial-value:0deg}
.scene{animation:lightUp 2.2s ease-out backwards}
@keyframes lightUp{from{filter:brightness(0)}to{filter:brightness(1)}}

/* headline: tracking-in, metallic sweep, glitch */
h1{
  background:linear-gradient(105deg,transparent 42%,rgba(255,255,255,.95) 50%,transparent 58%) 100% 0/250% 100% no-repeat,
             linear-gradient(180deg,#fff 0%,#e2e2e8 34%,#93939e 60%,#f4f4f8 100%);
  -webkit-background-clip:text;background-clip:text;
  animation:trackIn 1.5s cubic-bezier(.2,.8,.2,1) .15s backwards,sweep 5.5s ease-in-out 2.2s infinite;
}
h1.glitch{animation:trackIn 1.5s cubic-bezier(.2,.8,.2,1) .15s backwards,sweep 5.5s ease-in-out 2.2s infinite,glitch .4s steps(1,end) 1}
@keyframes trackIn{from{letter-spacing:.7em;opacity:0;filter:blur(8px)}}
@keyframes sweep{0%{background-position:100% 0,0 0}60%,100%{background-position:0% 0,0 0}}
@keyframes glitch{
  0%,100%{transform:none}
  20%{transform:translateX(-3px) skewX(-6deg);filter:drop-shadow(3px 0 0 rgba(120,170,255,.9)) drop-shadow(-3px 0 0 rgba(255,110,170,.8))}
  45%{transform:translateX(3px) skewX(4deg);filter:drop-shadow(-3px 0 0 rgba(120,170,255,.9)) drop-shadow(3px 0 0 rgba(255,110,170,.8))}
  70%{transform:translateX(-1px);filter:drop-shadow(2px 0 0 rgba(255,255,255,.9))}
}

/* avatar: float + audio-reactive pulse */
.avatar{animation:floaty 6s ease-in-out infinite;transform:scale(calc(1 + var(--lvl,0)*.06))}
@keyframes floaty{50%{translate:0 -5px}}
.fx-eq{position:absolute;left:50%;top:50%;width:240px;height:240px;margin:-120px 0 0 -120px;pointer-events:none}
.fx-pulse{position:absolute;inset:0;opacity:0;pointer-events:none;background:radial-gradient(ellipse 60% 45% at 50% 24%,rgba(255,255,255,.22),transparent 70%)}

/* dividers draw in */
.divider i{transform:scaleX(0);animation:draw 1s cubic-bezier(.2,.8,.2,1) calc(.4s + var(--k,0)*.14s) forwards}
.divider i:first-child{transform-origin:right}.divider i:last-child{transform-origin:left}
.divider span{opacity:0;animation:fadeIn .9s ease calc(.5s + var(--k,0)*.14s) forwards}
@keyframes draw{to{transform:scaleX(1)}}
@keyframes fadeIn{to{opacity:1}}

/* card: orbiting edge light, scan sweep, cursor spotlight */
.card-edge{position:absolute;inset:0;border-radius:inherit;padding:1px;pointer-events:none;z-index:6;
  background:conic-gradient(from var(--ang),transparent 0 68%,rgba(255,255,255,.95) 82%,transparent 94%);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;
  mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);
  animation:edgeSpin 7s linear infinite}
@keyframes edgeSpin{to{--ang:360deg}}
.card-scan{position:absolute;left:0;right:0;top:0;height:38%;pointer-events:none;z-index:4;opacity:.55;
  background:linear-gradient(180deg,transparent,rgba(255,255,255,.07) 70%,rgba(255,255,255,.16) 99%,transparent);
  transform:translateY(-110%);animation:scan 9s cubic-bezier(.4,0,.2,1) 2.5s infinite}
@keyframes scan{0%{transform:translateY(-110%)}40%,100%{transform:translateY(290%)}}
.fx-cardspot{position:absolute;inset:0;pointer-events:none;z-index:0;opacity:0;transition:opacity .5s;
  background:radial-gradient(360px circle at var(--cx,50%) var(--cy,30%),rgba(255,255,255,.07),transparent 65%)}
.card:hover .fx-cardspot{opacity:1}

/* tiles */
.link,.support{animation-fill-mode:backwards;
  transition:transform .22s cubic-bezier(.2,.8,.2,1),border-color .55s ease,box-shadow .55s ease,background .45s ease}
.link:hover,.support:hover{transform:perspective(700px) rotateX(var(--tx,0deg)) rotateY(var(--ty,0deg)) translateY(-4px)}
.link:active,.support:active{transform:translateY(-1px) scale(.97)}
.fx-spot{position:absolute;inset:0;z-index:0;pointer-events:none;opacity:0;transition:opacity .4s;
  background:radial-gradient(130px circle at var(--mx,50%) var(--my,50%),rgba(255,255,255,.2),transparent 66%)}
.link:hover .fx-spot,.support:hover .fx-spot{opacity:1}
.fx-rip{position:absolute;z-index:2;border-radius:50%;pointer-events:none;background:rgba(255,255,255,.3);
  transform:scale(0);animation:rip .75s ease-out forwards}
@keyframes rip{to{transform:scale(1);opacity:0}}
.link:hover .icon svg,.support:hover .icon svg,.link:hover .icon img{animation:wiggle .6s ease}
@keyframes wiggle{25%{transform:rotate(-12deg) scale(1.12)}60%{transform:rotate(8deg) scale(1.08)}}

/* modals */
.modal.active .discord-option{animation:optIn .55s cubic-bezier(.16,1,.3,1) backwards}
.discord-option:nth-child(1){animation-delay:.12s!important}.discord-option:nth-child(2){animation-delay:.2s!important}
.discord-option:nth-child(3){animation-delay:.28s!important}.discord-option:nth-child(4){animation-delay:.36s!important}
@keyframes optIn{from{opacity:0;transform:translateX(-20px)}}
.modal.active #qrImg{animation:qrReveal .6s cubic-bezier(.16,1,.3,1) .1s backwards,qrGlow 3s ease-in-out .8s infinite}
@keyframes qrGlow{50%{box-shadow:0 0 42px rgba(255,255,255,.32)}}
.qr-wrap{position:relative;width:100%;overflow:hidden}
.qr-wrap::after{content:"";position:absolute;left:0;right:0;top:0;height:2px;pointer-events:none;opacity:.16;
  background:linear-gradient(90deg,transparent,#000,transparent);animation:qrScan 2.8s ease-in-out infinite alternate}
@keyframes qrScan{to{top:calc(100% - 2px)}}

.fx-note{position:fixed;left:50%;bottom:calc(18px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:50;
  padding:10px 16px;border:1px solid rgba(255,255,255,.3);border-radius:2px 2px 999px 999px;background:rgba(0,0,0,.85);
  color:#fff;font:600 .68rem/1 var(--sans,system-ui);letter-spacing:.14em;text-transform:uppercase;cursor:pointer;
  box-shadow:0 0 24px rgba(255,255,255,.15)}


/* ===== background upgrade ===== */
.floor{animation:gridMove 2.6s linear infinite;translate:calc(var(--mx,0)*50px) 0}
@keyframes gridMove{to{background-position:0 80px,0 0}}
.fog{translate:calc(var(--mx,0)*-70px) calc(var(--my,0)*-36px)}
.shafts{translate:calc(var(--mx,0)*34px) 0}
.rose{animation-duration:70s}
.cathedral .halo{transform-box:fill-box;transform-origin:center;animation:haloBreath 7s ease-in-out infinite}
@keyframes haloBreath{50%{transform:scale(1.22);opacity:.5}}
.cathedral .tr{fill:none!important;stroke:#fff!important;stroke-width:1.7;stroke-dasharray:.07 .93;stroke-dashoffset:1;opacity:.85;
  animation:trace var(--d,7s) linear var(--dl,0s) infinite}
.cathedral .tr.g{stroke-width:6;opacity:.14}
@keyframes trace{to{stroke-dashoffset:0}}
.cathedral circle.fx-ring{fill:none;stroke:rgba(255,255,255,.35);stroke-width:.8;transform-box:fill-box;transform-origin:center}
.cathedral circle.fx-ring.a{stroke-dasharray:2 14;animation:spin 90s linear infinite reverse}
.cathedral circle.fx-ring.b{stroke-dasharray:60 20 6 20;animation:spin 140s linear infinite}
.cathedral circle.fx-ring.c{stroke:rgba(255,255,255,.2);stroke-dasharray:1 7;animation:spin 200s linear infinite reverse}
.fx-rays{position:absolute;left:var(--rx,50%);top:var(--ry,18%);width:210vmax;height:210vmax;translate:-50% -50%;pointer-events:none;
  mix-blend-mode:screen;will-change:rotate;
  -webkit-mask-image:radial-gradient(closest-side,#000 0,rgba(0,0,0,.6) 25%,transparent 100%);
  mask-image:radial-gradient(closest-side,#000 0,rgba(0,0,0,.6) 25%,transparent 100%)}
.fx-rays.a{background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.075) 0 2.6deg,transparent 2.6deg 13deg);animation:rot 120s linear infinite}
.fx-rays.b{background:repeating-conic-gradient(from 6deg,rgba(255,255,255,.05) 0 1.1deg,transparent 1.1deg 8.5deg);animation:rot 80s linear infinite reverse}
@keyframes rot{to{rotate:360deg}}
.fx-flash{position:absolute;inset:0;opacity:0;pointer-events:none;
  background:radial-gradient(ellipse 60% 50% at var(--rx,50%) var(--ry,20%),rgba(255,255,255,.4),transparent 70%)}
.fx-flash.go{animation:flash 1.8s ease-out}
@keyframes flash{0%{opacity:0}8%{opacity:1}18%{opacity:.35}28%{opacity:.85}100%{opacity:0}}
.fx-cursor{position:absolute;left:0;top:0;width:560px;height:560px;margin:-280px 0 0 -280px;pointer-events:none;will-change:transform;
  background:radial-gradient(circle,rgba(255,255,255,.11),transparent 62%)}
.fx-bg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}

/* cursor / spark canvas */
#fx{position:fixed;inset:0;width:100%;height:100%;z-index:3;pointer-events:none}
`;
const st = document.createElement("style");
st.textContent = css;
document.head.appendChild(st);

console.log("[solo-fx] loaded. reduced-motion:", reduce, "| mouse device:", fine);
if (reduce) { console.warn("[solo-fx] Disabled (?fx=off). Open ?fx=on to enable."); return; }

/* ================= structure ================= */
const card = $(".card"), scene = $(".scene"), bgm = $("#bgm"), av = $("#audioToggle");

$$(".divider").forEach((d, i) => d.style.setProperty("--k", i));

if (card) {
  const edge = document.createElement("span"); edge.className = "card-edge";
  const scan = document.createElement("span"); scan.className = "card-scan";
  const spot = document.createElement("span"); spot.className = "fx-cardspot";
  [edge, scan].forEach(n => n.setAttribute("aria-hidden", "true"));
  card.prepend(spot); card.append(edge, scan);
  if (fine) card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--cx", e.clientX - r.left + "px");
    card.style.setProperty("--cy", e.clientY - r.top + "px");
  });
}

const pulse = document.createElement("div");
pulse.className = "fx-pulse"; if (scene) scene.insertBefore(pulse, $(".vignette", scene));

const qrImg = $("#qrImg");
if (qrImg) { const w = document.createElement("div"); w.className = "qr-wrap"; qrImg.before(w); w.append(qrImg); }

/* tagline typewriter */
const tg = $(".tagline");
const tn = tg && [...tg.childNodes].find(n => n.nodeType === 3);
if (tn) {
  const full = tn.textContent; tn.textContent = ""; let i = 0;
  setTimeout(function typ() { tn.textContent = full.slice(0, ++i); if (i < full.length) setTimeout(typ, 38); }, 1100);
}

/* headline glitch every few seconds */
const h1 = $("h1");
(function g() {
  setTimeout(() => {
    if (h1) { h1.classList.add("glitch"); setTimeout(() => h1.classList.remove("glitch"), 450); }
    g();
  }, 6000 + Math.random() * 5000);
})();

/* ================= tiles: spotlight, tilt, ripple, scramble ================= */
const CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/·";
function scramble(el) {
  if (el._s) return;
  const t = el.dataset.o || (el.dataset.o = el.textContent);
  let f = 0; el._s = 1;
  const id = setInterval(() => {
    f++;
    el.textContent = [...t].map((c, i) => (c === " " || i < (f * t.length) / 11 ? c : CH[(Math.random() * CH.length) | 0])).join("");
    if (f >= 11) { clearInterval(id); el.textContent = t; el._s = 0; }
  }, 34);
}
$$(".link,.support").forEach(t => {
  const sp = document.createElement("span"); sp.className = "fx-spot"; sp.setAttribute("aria-hidden", "true"); t.prepend(sp);
  t.addEventListener("pointermove", e => {
    const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    t.style.setProperty("--mx", x * 100 + "%"); t.style.setProperty("--my", y * 100 + "%");
    if (fine) { t.style.setProperty("--tx", (-(y - .5) * 12).toFixed(1) + "deg"); t.style.setProperty("--ty", ((x - .5) * 12).toFixed(1) + "deg"); }
  });
  t.addEventListener("pointerleave", () => { t.style.setProperty("--tx", "0deg"); t.style.setProperty("--ty", "0deg"); });
  t.addEventListener("pointerenter", () => { const n = $(".name", t); if (n) scramble(n); });
  t.addEventListener("pointerdown", e => {
    const r = t.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.4, p = document.createElement("span");
    p.className = "fx-rip";
    p.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
    p.addEventListener("animationend", () => p.remove()); t.append(p);
  });
});

/* visitor counter counts up */
const vc = $("#visitorCount");
if (vc) {
  let done = false;
  new MutationObserver(() => {
    if (done) return;
    const n = parseInt(vc.textContent.replace(/,/g, ""), 10);
    if (!(n > 0)) return;
    done = true; const t0 = performance.now();
    (function step(now) {
      const k = Math.min((now - t0) / 1500, 1), e = k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
      vc.textContent = Math.round(n * e).toLocaleString("en-US");
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }).observe(vc, { childList: true, characterData: true, subtree: true });
}

/* ================= spark / star canvas ================= */
const fx = document.createElement("canvas"); fx.id = "fx"; fx.setAttribute("aria-hidden", "true"); document.body.appendChild(fx);
const g = fx.getContext("2d"); let W, H; const D = Math.min(devicePixelRatio || 1, 1.5);
function rs() { W = innerWidth; H = innerHeight; fx.width = W * D; fx.height = H * D; g.setTransform(D, 0, 0, D, 0, 0); }
rs(); addEventListener("resize", rs, { passive: true });
const P = [], R = [], S = [];
function spark(x, y, n, sp, life) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * 6.283, s = sp * (.3 + Math.random());
    P.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, l: life * (.6 + Math.random() * .4), m: life, r: .6 + Math.random() * 1.6 });
  }
}
let lastTrail = 0;
addEventListener("pointermove", e => {
  if (e.pointerType !== "mouse") return;
  const n = performance.now(); if (n - lastTrail < 28) return; lastTrail = n;
  spark(e.clientX, e.clientY, 1, 30, .7);
}, { passive: true });
addEventListener("pointerdown", e => {
  if (e.target.closest && e.target.closest(".modal")) return;
  spark(e.clientX, e.clientY, 22, 230, .9); R.push({ x: e.clientX, y: e.clientY, r: 0, l: .6 });
}, { passive: true });
function star() {
  const a = .5 + Math.random() * .4, sp = 520 + Math.random() * 300;
  S.push({ x: Math.random() * W * .9, y: -10 + Math.random() * H * .3, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, l: 1 });
  setTimeout(star, 3500 + Math.random() * 5500);
}
setTimeout(star, 2500);

/* ================= audio-reactive avatar ================= */
let eq, ec, AC, an, fd, ctxA, flat = 0, sim = !/^https?:/.test(location.protocol);
const N = 72, prev = new Float32Array(N); let lvl = 0;
if (av) {
  eq = document.createElement("canvas"); eq.className = "fx-eq"; eq.width = eq.height = 480; eq.setAttribute("aria-hidden", "true");
  av.append(eq); ec = eq.getContext("2d");
}
function setupAudio() {
  if (an || sim || !bgm) return;
  try {
    ctxA = new (window.AudioContext || window.webkitAudioContext)();
    const src = ctxA.createMediaElementSource(bgm);
    an = ctxA.createAnalyser(); an.fftSize = 128; an.smoothingTimeConstant = .78;
    src.connect(an); an.connect(ctxA.destination); fd = new Uint8Array(an.frequencyBinCount);
  } catch (e) { an = null; sim = true; }
}
["pointerdown", "keydown", "touchstart"].forEach(ev =>
  addEventListener(ev, () => { setupAudio(); if (ctxA && ctxA.state === "suspended") ctxA.resume(); }, { capture: true, passive: true }));
const playing = () => bgm && !bgm.paused && !bgm.muted;

/* ================= one loop ================= */
let last = performance.now();
function loop(now) {
  requestAnimationFrame(loop);
  if (document.hidden) { last = now; return; }
  const dt = Math.min((now - last) / 1000, .05); last = now; const t = now / 1000;

  /* audio level + bars */
  const on = playing(); let raw = 0;
  if (on && an && !sim) {
    an.getByteFrequencyData(fd);
    let s = 0; for (let i = 0; i < 6; i++) s += fd[i]; raw = s / 6 / 255;
    flat = fd[0] + fd[1] + fd[2] === 0 ? flat + 1 : 0; if (flat > 120) sim = true;
  } else if (on) raw = .35 + .25 * Math.sin(t * 5.2) * Math.sin(t * 1.3 + 1);
  lvl += (raw - lvl) * .25;
  if (av) av.style.setProperty("--lvl", lvl.toFixed(3));
  pulse.style.opacity = (lvl * .8).toFixed(3);

  if (ec) {
    ec.clearRect(0, 0, 480, 480);
    ec.lineCap = "round"; ec.lineWidth = 4;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * 6.2832 - 1.5708;
      if (Math.sin(a) > .82) continue;
      let v;
      if (on && an && !sim) { const j = i < N / 2 ? i : N - 1 - i; v = fd[1 + ((j / (N / 2)) * 38 | 0)] / 255; }
      else if (on) v = Math.max(0, .5 + .5 * Math.sin(t * 4 + i * .55)) * (.35 + .5 * Math.abs(Math.sin(t * 1.7 + i * .21)));
      else v = .04 + .035 * Math.sin(t * 1.6 + i * .5);
      prev[i] += (v - prev[i]) * .35;
      const L = 6 + prev[i] * 52, c = Math.cos(a), s = Math.sin(a), r0 = 140;
      ec.strokeStyle = `rgba(255,255,255,${.25 + prev[i] * .75})`;
      ec.beginPath(); ec.moveTo(240 + c * r0, 240 + s * r0); ec.lineTo(240 + c * (r0 + L), 240 + s * (r0 + L)); ec.stroke();
    }
  }

  /* sparks, rings, shooting stars */
  g.clearRect(0, 0, W, H); g.globalCompositeOperation = "lighter";
  for (let i = P.length - 1; i >= 0; i--) {
    const p = P[i]; p.l -= dt; if (p.l <= 0) { P.splice(i, 1); continue; }
    p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .96; p.vy *= .96;
    g.fillStyle = `rgba(255,255,255,${(p.l / p.m) * .9})`;
    g.beginPath(); g.arc(p.x, p.y, p.r * (p.l / p.m + .3), 0, 6.2832); g.fill();
  }
  for (let i = R.length - 1; i >= 0; i--) {
    const r = R[i]; r.l -= dt; if (r.l <= 0) { R.splice(i, 1); continue; }
    r.r += 260 * dt; g.strokeStyle = `rgba(255,255,255,${r.l / .6 * .5})`; g.lineWidth = 1.2;
    g.beginPath(); g.arc(r.x, r.y, r.r, 0, 6.2832); g.stroke();
  }
  for (let i = S.length - 1; i >= 0; i--) {
    const s = S[i]; s.l -= dt * 1.1; s.x += s.vx * dt; s.y += s.vy * dt;
    if (s.l <= 0 || s.x > W + 100 || s.y > H + 100) { S.splice(i, 1); continue; }
    const tx = s.x - s.vx * .14, ty = s.y - s.vy * .14, gr = g.createLinearGradient(s.x, s.y, tx, ty);
    gr.addColorStop(0, `rgba(255,255,255,${s.l})`); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.strokeStyle = gr; g.lineWidth = 1.6; g.beginPath(); g.moveTo(s.x, s.y); g.lineTo(tx, ty); g.stroke();
  }
  g.globalCompositeOperation = "source-over";
}

/* ================= BACKGROUND UPGRADE ================= */
(function bgUpgrade() {
  if (!scene) return;
  const svg = $(".cathedral", scene), van = $(".vignette", scene);
  const mk = (tag, cls, before) => {
    const e = document.createElement(tag); e.className = cls; e.setAttribute("aria-hidden", "true");
    scene.insertBefore(e, before || null); return e;
  };
  const ray1 = mk("div", "fx-rays a", svg), ray2 = mk("div", "fx-rays b", svg);
  const flash = mk("div", "fx-flash", van), cur = mk("div", "fx-cursor", van);
  const cv = mk("canvas", "fx-bg", van), c = cv.getContext("2d");
  [[-10, 2, 90, 30, 60, -8], [55, 18, 70, 24, 52, -20], [20, 40, 85, 22, 70, -33]].forEach(([l, b, w, h, d, dl]) => {
    const f = mk("div", "fog", van);
    f.style.cssText = `left:${l}%;bottom:${b}%;width:${w}vw;height:${h}vh;animation-duration:${d}s;animation-delay:${dl}s;opacity:.8`;
  });

  /* light that travels along the architecture + spinning ritual rings */
  if (svg) {
    const NS = "http://www.w3.org/2000/svg";
    [...svg.querySelectorAll("path,circle")]
      .filter(e => !e.closest("defs") && !e.classList.contains("halo") && !e.classList.contains("rose-fill"))
      .forEach(e => {
        const isFine = e.classList.contains("fine") || (e.parentNode.classList && e.parentNode.classList.contains("fine"));
        if (isFine && !fine) return;
        const d = (6 + Math.random() * 7).toFixed(1) + "s", dl = (-Math.random() * 12).toFixed(1) + "s";
        (isFine ? [""] : ["", "g"]).forEach(k => {
          const n = e.cloneNode(false);
          n.setAttribute("class", "tr " + k); n.setAttribute("pathLength", "1");
          n.style.setProperty("--d", d); n.style.setProperty("--dl", dl);
          e.parentNode.appendChild(n);
        });
      });
    [[150, "a"], [168, "b"], [190, "c"]].forEach(([r, k]) => {
      const ci = document.createElementNS(NS, "circle");
      ci.setAttribute("cx", 800); ci.setAttribute("cy", 205); ci.setAttribute("r", r);
      ci.setAttribute("class", "fx-ring " + k); svg.appendChild(ci);
    });
  }

  /* canvas: stars, embers, sparks from the rose window, shockwave rings */
  let W = 1, H = 1, RX = 0, RY = 0;
  const D = Math.min(devicePixelRatio || 1, 1.5);
  const glow = document.createElement("canvas"); glow.width = glow.height = 64;
  { const x = glow.getContext("2d"), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(.25, "rgba(255,255,255,.35)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = gr; x.fillRect(0, 0, 64, 64); }
  function size() {
    W = innerWidth; H = innerHeight; cv.width = W * D; cv.height = H * D; c.setTransform(D, 0, 0, D, 0, 0);
    const K = Math.max(W / 1600, H / 1000) * 1.07; RX = W / 2; RY = H / 2 + (205 - 500) * K;
    scene.style.setProperty("--rx", RX + "px"); scene.style.setProperty("--ry", RY + "px");
  }
  size(); addEventListener("resize", size, { passive: true });

  const E = [], ST = [], SP = [], RG = [];
  for (let i = 0; i < (fine ? 110 : 60); i++) E.push({ x: Math.random() * W, y: Math.random() * H, z: .3 + Math.random() * .7, s: 6 + Math.random() * 26, ph: Math.random() * 6.28, r: 6 + Math.random() * 16 });
  for (let i = 0; i < 70; i++) ST.push({ x: Math.random() * W, y: Math.random() * H * .55, r: .6 + Math.random() * 1.1, ph: Math.random() * 6.28, sp: .6 + Math.random() * 2 });

  let t0 = performance.now(), emit = 0, nextFlash = 5, nextRing = 3, ringCool = 0;
  let cx = W / 2, cy = H / 3, tx = cx, ty = cy, lastPtr = -9;
  addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; lastPtr = performance.now() / 1000; }, { passive: true });

  function bg(now) {
    requestAnimationFrame(bg);
    if (document.hidden) { t0 = now; return; }
    const dt = Math.min((now - t0) / 1000, .05); t0 = now; const t = now / 1000;

    if (t - lastPtr > 3) { tx = W / 2 + Math.sin(t * .35) * W * .32; ty = H * .45 + Math.cos(t * .27) * H * .25; }
    const k = Math.min(dt * 4, 1); cx += (tx - cx) * k; cy += (ty - cy) * k;
    cur.style.transform = `translate(${cx.toFixed(1)}px,${cy.toFixed(1)}px)`;
    scene.style.setProperty("--mx", (cx / W - .5).toFixed(3)); scene.style.setProperty("--my", (cy / H - .5).toFixed(3));
    const ro = (.55 + lvl * .45).toFixed(3); ray1.style.opacity = ro; ray2.style.opacity = ro;

    if (t > nextFlash) { flash.classList.remove("go"); void flash.offsetWidth; flash.classList.add("go"); nextFlash = t + 8 + Math.random() * 8; RG.push({ r: 0 }); }
    ringCool -= dt;
    if ((lvl > .5 && ringCool <= 0) || t > nextRing) { RG.push({ r: 0 }); ringCool = .45; nextRing = t + 6 + Math.random() * 3; }

    c.clearRect(0, 0, W, H); c.globalCompositeOperation = "lighter";
    for (const s of ST) { c.globalAlpha = (.25 + .6 * Math.abs(Math.sin(t * s.sp + s.ph))) * .7; c.drawImage(glow, s.x - s.r * 3, s.y - s.r * 3, s.r * 6, s.r * 6); }
    const boost = 1 + lvl * 3;
    for (const p of E) {
      p.y -= p.s * p.z * dt * boost; p.x += Math.sin(t * .6 + p.ph) * 10 * dt;
      const dx = p.x - cx, dy = p.y - cy, d = Math.hypot(dx, dy);
      if (d < 140 && d > 0) { p.x += dx / d * 60 * dt; p.y += dy / d * 60 * dt; }
      if (p.y < -20) { p.y = H + 20; p.x = Math.random() * W; }
      if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
      const sz = p.r * p.z * 2;
      c.globalAlpha = .25 + .5 * p.z * (.6 + .4 * Math.sin(t * 2 + p.ph));
      c.drawImage(glow, p.x - sz, p.y - sz, sz * 2, sz * 2);
    }
    emit -= dt;
    if (emit <= 0 && SP.length < 90) { emit = .06; const a = Math.random() * 6.283, sp = 40 + Math.random() * 110; SP.push({ x: RX, y: RY, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, l: 2.2, m: 2.2 }); }
    for (let i = SP.length - 1; i >= 0; i--) {
      const p = SP[i]; p.l -= dt; if (p.l <= 0) { SP.splice(i, 1); continue; }
      p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .985; p.vy *= .985;
      const f = p.l / p.m, sz = 14 * f + 2; c.globalAlpha = f * .7; c.drawImage(glow, p.x - sz, p.y - sz, sz * 2, sz * 2);
    }
    c.globalAlpha = 1; c.lineWidth = 1.4; const reach = Math.max(W, H) * .9;
    for (let i = RG.length - 1; i >= 0; i--) {
      const r = RG[i]; r.r += (380 + lvl * 300) * dt; const l = 1 - r.r / reach;
      if (l <= 0) { RG.splice(i, 1); continue; }
      c.strokeStyle = `rgba(255,255,255,${(l * .28).toFixed(3)})`; c.beginPath(); c.arc(RX, RY, r.r, 0, 6.2832); c.stroke();
      c.strokeStyle = `rgba(255,255,255,${(l * .12).toFixed(3)})`; c.beginPath(); c.arc(RX, RY, r.r * .82, 0, 6.2832); c.stroke();
    }
    c.globalCompositeOperation = "source-over";
  }
  requestAnimationFrame(bg);
})();

requestAnimationFrame(loop);
})();
