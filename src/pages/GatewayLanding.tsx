import { useState, useEffect, useRef } from "react";
import {
  Zap, QrCode, Users, CheckCircle, ArrowRight, Sparkles,
  Calendar, Shield, Download, Star, ChevronDown,
  Clock, MapPin, Ticket, ScanLine, Mail, Globe, ArrowUpRight,
  Sun, Moon
} from "lucide-react";

/* ═══════════════════════════════════════════════
   GLOBAL STYLES — Neon Noir System
═══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=JetBrains+Mono&display=swap');

:root {
  --color-bg:             #F8F8FC;
  --color-surface:        #FFFFFF;
  --color-surface-2:      #F0F0F7;
  --color-border:         rgba(0,0,0,0.07);
  --color-border-active:  rgba(0,0,0,0.13);
  --color-primary:        #E8186D;
  --color-primary-soft:   rgba(232,24,109,0.10);
  --color-primary-glow:   rgba(232,24,109,0.22);
  --color-accent:         #6344D4;
  --color-accent-soft:    rgba(99,68,212,0.10);
  --color-success:        #16A34A;
  --color-text-primary:   #0D0D12;
  --color-text-secondary: rgba(13,13,18,0.55);
  --color-text-muted:     rgba(13,13,18,0.38);
  --color-nav-bg:         rgba(248,248,252,0.82);
  --color-stat-grad-start: #0D0D12;
  --color-stat-grad-end:   rgba(13,13,18,0.6);
}

/* ══════════ DARK THEME OVERRIDES ══════════ */
[data-gw-theme="dark"] {
  --color-bg:             #0D0D12;
  --color-surface:        #15151E;
  --color-surface-2:      #1E1E2C;
  --color-border:         rgba(255,255,255,0.08);
  --color-border-active:  rgba(255,255,255,0.18);
  --color-primary:        #E8186D;
  --color-primary-soft:   rgba(232,24,109,0.15);
  --color-primary-glow:   rgba(232,24,109,0.35);
  --color-accent:         #7B5CF0;
  --color-accent-soft:    rgba(123,92,240,0.15);
  --color-success:        #22C55E;
  --color-text-primary:   #FFFFFF;
  --color-text-secondary: rgba(255,255,255,0.55);
  --color-text-muted:     rgba(255,255,255,0.30);
  --color-nav-bg:         rgba(13,13,18,0.75);
  --color-stat-grad-start: #FFFFFF;
  --color-stat-grad-end:   rgba(255,255,255,0.55);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--color-bg);
  color: var(--color-text-primary);
  font-family: "DM Sans", sans-serif;
  overflow-x: hidden;
  cursor: default;
}


/* ── Typography helpers ── */
.font-syne  { font-family: "Space Grotesk", sans-serif; }
.font-mono  { font-family: "JetBrains Mono", monospace; }

/* ══════════ BACKGROUND CANVAS ══════════ */
.gw-bg {
  position: fixed; inset: 0; z-index: 0;
  pointer-events: none; overflow: hidden;
}
/* large orbs — toned down for light mode */
.gw-orb {
  position: absolute; border-radius: 50%;
  filter: blur(110px);
  animation: orbFloat var(--dur, 20s) ease-in-out infinite alternate;
}
.gw-orb-1 {
  width: 600px; height: 600px; top: -200px; right: -120px;
  background: rgba(232,24,109,0.10); --dur: 22s;
}
.gw-orb-2 {
  width: 450px; height: 450px; bottom: 20%; left: -140px;
  background: rgba(99,68,212,0.08); --dur: 28s;
  animation-delay: -10s;
}
.gw-orb-3 {
  width: 350px; height: 350px; bottom: -80px; right: 15%;
  background: rgba(232,24,109,0.07); --dur: 24s;
  animation-delay: -5s;
}
@keyframes orbFloat {
  0%   { transform: translate(0,0) scale(1); }
  40%  { transform: translate(48px,-72px) scale(1.07); }
  70%  { transform: translate(-32px,44px) scale(0.95); }
  100% { transform: translate(20px,-18px) scale(1.03); }
}

/* diagonal editorial grid lines — very subtle in light mode */
.gw-diag-lines {
  position: absolute; inset: 0;
  background-image:
    repeating-linear-gradient(
      -32deg,
      transparent,
      transparent 140px,
      rgba(232,24,109,0.012) 140px,
      rgba(232,24,109,0.012) 141px
    );
}

/* kinetic sweep streaks — very subtle in light mode */
.gw-streak {
  position: absolute; height: 1px; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(232,24,109,0.12), transparent);
  animation: streak var(--spd, 7s) linear infinite;
  animation-delay: var(--del, 0s);
}
@keyframes streak {
  0%   { transform: translateX(-120vw) skewX(-18deg); opacity: 0; }
  15%  { opacity: 0.5; }
  85%  { opacity: 0.18; }
  100% { transform: translateX(200vw) skewX(-18deg); opacity: 0; }
}

/* ══════════ NAV ══════════ */
.gw-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 28px 72px;
  background: var(--color-nav-bg);
  backdrop-filter: blur(20px) saturate(1.4);
  border-bottom: 1px solid var(--color-border);
  transition: padding 250ms, background 300ms;
}
.gw-logo {
  display: flex; align-items: center; gap: 10px;
  font-family: "Space Grotesk", sans-serif; font-size: 20px; font-weight: 800;
  letter-spacing: -0.03em; color: var(--color-text-primary);
  text-decoration: none;
}
.gw-logo-mark {
  width: 32px; height: 32px; border-radius: 9px;
  background: var(--color-primary);
  box-shadow: 0 0 20px var(--color-primary-glow);
  display: flex; align-items: center; justify-content: center;
}
.gw-nav-links {
  display: flex; list-style: none; gap: 36px;
}
.gw-nav-links a {
  font-size: 14px; font-weight: 500; text-decoration: none;
  color: var(--color-text-secondary); transition: color 150ms;
}
.gw-nav-links a:hover { color: var(--color-text-primary); }
.gw-nav-cta {
  background: var(--color-primary); color: #fff; border: none;
  border-radius: 50px; padding: 11px 26px;
  font-family: "DM Sans", sans-serif; font-size: 14px; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; gap: 7px;
  box-shadow: 0 0 24px var(--color-primary-glow);
  transition: box-shadow 150ms, transform 100ms;
  white-space: nowrap; flex-shrink: 0;
  text-decoration: none;
}
.gw-nav-cta:hover { box-shadow: 0 0 44px var(--color-primary-glow); transform: translateY(-1px); }

/* ── Theme toggle ── */
.gw-theme-toggle {
  width: 38px; height: 38px; border-radius: 50%;
  background: var(--color-surface-2); border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 200ms, color 200ms, border-color 200ms, box-shadow 150ms;
  flex-shrink: 0;
}
.gw-theme-toggle:hover {
  background: var(--color-surface); color: var(--color-primary);
  border-color: var(--color-primary-soft);
  box-shadow: 0 0 14px var(--color-primary-soft);
}

/* ── Hamburger button ── */
.gw-hamburger {
  display: none;
  flex-direction: column; justify-content: center; align-items: center;
  width: 36px; height: 36px; border-radius: 10px; gap: 5px;
  background: var(--color-surface-2); border: 1px solid var(--color-border);
  cursor: pointer; flex-shrink: 0;
  transition: background 200ms, border-color 200ms;
}
.gw-hamburger:hover { background: var(--color-surface); border-color: var(--color-border-active); }
.gw-hamburger span {
  display: block; width: 18px; height: 2px; border-radius: 2px;
  background: var(--color-text-secondary);
  transition: transform 250ms, opacity 250ms, width 250ms;
}
.gw-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.gw-hamburger.open span:nth-child(2) { opacity: 0; width: 0; }
.gw-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ── Mobile menu panel ── */
.gw-mobile-menu {
  display: none;
  position: fixed; top: 0; left: 0; right: 0; z-index: 199;
  background: var(--color-nav-bg);
  backdrop-filter: blur(24px) saturate(1.4);
  border-bottom: 1px solid var(--color-border);
  padding: 0 16px 20px;
  flex-direction: column;
  transform: translateY(-110%);
  transition: transform 300ms cubic-bezier(.16,1,.3,1);
}
.gw-mobile-menu.open {
  transform: translateY(0);
}
.gw-mobile-menu-spacer {
  height: 60px;
}
.gw-mobile-menu-links {
  list-style: none; display: flex; flex-direction: column; gap: 2px;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 14px;
}
.gw-mobile-menu-links a {
  display: block; padding: 12px 4px;
  font-size: 16px; font-weight: 500; color: var(--color-text-secondary);
  text-decoration: none; border-radius: 10px;
  transition: color 150ms;
}
.gw-mobile-menu-links a:hover { color: var(--color-text-primary); }
.gw-mobile-menu-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 4px 4px 0;
}
.gw-mobile-menu-label {
  font-size: 13px; color: var(--color-text-muted);
}

/* ── Dark mode orb boost ── */
[data-gw-theme="dark"] .gw-orb-1 { background: rgba(232,24,109,0.30); }
[data-gw-theme="dark"] .gw-orb-2 { background: rgba(99,68,212,0.20); }
[data-gw-theme="dark"] .gw-orb-3 { background: rgba(232,24,109,0.18); }

/* ══════════ BUTTONS ══════════ */
.btn-primary {
  background: var(--color-primary); color: #fff; border: none;
  border-radius: 50px; padding: 15px 36px;
  font-family: "DM Sans", sans-serif; font-size: 15px; font-weight: 600;
  cursor: pointer; display: inline-flex; align-items: center; gap: 9px;
  box-shadow: 0 0 28px var(--color-primary-glow);
  transition: box-shadow 150ms, transform 100ms;
  white-space: nowrap;
}
.btn-primary:hover { box-shadow: 0 0 50px var(--color-primary-glow), 0 4px 20px rgba(0,0,0,0.3); transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0); }
.btn-ghost {
  background: transparent; color: var(--color-text-primary);
  border: 1px solid var(--color-border-active); border-radius: 50px;
  padding: 14px 36px;
  font-family: "DM Sans", sans-serif; font-size: 15px; font-weight: 600;
  cursor: pointer; display: inline-flex; align-items: center; gap: 9px;
  transition: border-color 150ms, background 150ms;
  white-space: nowrap;
}
.btn-ghost:hover { background: var(--color-surface-2); border-color: var(--color-primary); }

/* ══════════ HERO ══════════ */
.gw-hero {
  position: relative; z-index: 1;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 0;
  padding: 160px 0 120px;
  max-width: 1440px;
  margin: 0 auto;
  padding-left: 72px; padding-right: 72px;
}
.gw-hero-left { display: flex; flex-direction: column; align-items: flex-start; }
.gw-hero-right {
  display: flex; align-items: center; justify-content: center;
  position: relative;
}

/* editorial slash divider — Guasco reference */
.gw-hero-slash {
  position: absolute; left: -1px; top: 0; bottom: 0;
  width: 1px; overflow: visible;
}
.gw-hero-slash::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg,
    transparent 0%,
    var(--color-primary) 30%,
    var(--color-accent) 70%,
    transparent 100%
  );
  opacity: 0.5;
}

.gw-badge {
  display: inline-flex; align-items: center; gap: 7px;
  background: var(--color-primary-soft);
  border: 1px solid rgba(232,24,109,0.3);
  border-radius: 50px; padding: 6px 16px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.07em;
  color: var(--color-primary); text-transform: uppercase;
  margin-bottom: 48px;
  animation: fadeUp 0.5s ease both;
}

.gw-headline {
  font-family: "Space Grotesk", sans-serif;
  font-size: clamp(48px, 6.5vw, 88px);
  font-weight: 800; line-height: 1.0;
  letter-spacing: -0.04em;
  animation: fadeUp 0.5s 0.08s ease both;
}
.gw-headline .grad {
  background: linear-gradient(120deg, var(--color-primary) 0%, #d4176a 60%, var(--color-accent) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Guasco-style large decorative letter behind headline */
.gw-bg-letter {
  position: absolute;
  font-family: "Space Grotesk", sans-serif;
  font-size: 320px; font-weight: 800;
  color: transparent;
  -webkit-text-stroke: 1px rgba(232,24,109,0.06);
  letter-spacing: -0.05em;
  line-height: 1;
  top: 50%; left: -32px;
  transform: translateY(-50%);
  pointer-events: none;
  user-select: none;
  z-index: -1;
}

.gw-sub {
  font-size: 19px; font-weight: 400; line-height: 1.65;
  color: var(--color-text-secondary);
  max-width: 500px;
  margin-top: 32px;
  animation: fadeUp 0.5s 0.16s ease both;
}
.gw-hero-ctas {
  display: flex; gap: 14px; flex-wrap: wrap;
  margin-top: 56px;
  animation: fadeUp 0.5s 0.24s ease both;
}
.gw-hero-meta {
  display: flex; gap: 24px; margin-top: 52px; flex-wrap: wrap;
  animation: fadeUp 0.5s 0.32s ease both;
}
.gw-hero-meta-item {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; color: var(--color-text-muted);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* scroll hint */
.gw-scroll-hint {
  position: absolute; bottom: 32px; left: 48px;
  display: flex; align-items: center; gap: 10px;
  font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--color-text-muted);
  animation: fadeUp 0.5s 0.9s ease both;
  z-index: 1;
}
.gw-scroll-line {
  width: 40px; height: 1px;
  background: linear-gradient(90deg, var(--color-primary), transparent);
}

/* ══════════ PASS CARD SYSTEM ══════════ */
.gw-pass-scene {
  position: relative;
  animation: fadeUp 0.8s 0.3s ease both;
}
/* ambient glow behind pass — toned down for light mode */
.gw-pass-aura {
  position: absolute;
  inset: -60px;
  background: radial-gradient(ellipse at 50% 50%,
    rgba(232,24,109,0.12) 0%,
    rgba(99,68,212,0.06) 45%,
    transparent 70%
  );
  border-radius: 50%;
  animation: auraPulse 4s ease-in-out infinite;
}
@keyframes auraPulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50%       { transform: scale(1.08); opacity: 1; }
}

/* main floating pass */
.gw-pass-main {
  animation: passOrbit 7s ease-in-out infinite;
  filter: drop-shadow(0 32px 72px rgba(232,24,109,0.28));
  position: relative; z-index: 2;
}
@keyframes passOrbit {
  0%,100% { transform: translateY(0) rotate(-2deg); }
  35%      { transform: translateY(-18px) rotate(0.5deg); }
  70%      { transform: translateY(-8px) rotate(-1deg); }
}

/* ghost pass — accent color, behind and rotated */
.gw-pass-ghost {
  position: absolute;
  top: -18px; right: -52px;
  z-index: 1; opacity: 0.45;
  transform: rotate(8deg) scale(0.88);
  filter: blur(1.5px) drop-shadow(0 12px 32px rgba(123,92,240,0.3));
  animation: ghostFloat 9s 1s ease-in-out infinite;
}
@keyframes ghostFloat {
  0%,100% { transform: rotate(8deg) scale(0.88) translateY(0); }
  50%      { transform: rotate(6deg) scale(0.88) translateY(-12px); }
}

/* ── pass card itself — always dark ── */
.pc {
  border-radius: 20px; overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.10);
  width: 320px;
}
.pc-top {
  height: 136px; position: relative; overflow: hidden;
  background: #0D0D12;
}
.pc-top-stripe {
  position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
  background: var(--color-primary);
  box-shadow: 0 0 18px var(--color-primary-glow);
}
.pc-top-glow {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(232,24,109,0.18), transparent);
}
.pc-top-inner {
  position: absolute; inset: 0; padding: 18px 20px 18px 26px;
  display: flex; flex-direction: column; justify-content: space-between;
}
.pc-tag {
  display: inline-flex; align-items: center; gap: 4px;
  background: var(--color-primary-soft);
  border: 1px solid rgba(232,24,109,0.3);
  border-radius: 50px; padding: 3px 10px;
  font-size: 10px; font-weight: 600; letter-spacing: 0.06em;
  color: var(--color-primary); text-transform: uppercase;
  width: fit-content;
}
.pc-event-name {
  font-family: "Space Grotesk", sans-serif; font-size: 18px; font-weight: 800;
  letter-spacing: -0.02em; color: #fff;
  text-shadow: 0 2px 10px rgba(0,0,0,0.6);
}
.pc-event-meta {
  display: flex; align-items: center; gap: 12px;
  font-size: 10px; color: rgba(255,255,255,0.45);
  font-family: "DM Sans", sans-serif; margin-top: 3px;
}
.pc-event-meta span { display: flex; align-items: center; gap: 3px; }

.pc-perf {
  position: relative;
  border-top: 2px dashed var(--color-border-active);
  margin: 0 -1px;
}
.pc-perf::before, .pc-perf::after {
  content: ''; position: absolute; top: -12px;
  width: 24px; height: 24px; border-radius: 50%;
  background: #15151E;
}
.pc-perf::before { left: -13px; }
.pc-perf::after  { right: -13px; }

.pc-bottom {
  background: #15151E; padding: 18px 20px 18px 24px;
  display: grid; grid-template-columns: 1fr auto; gap: 14px; align-items: end;
}
.pc-name {
  font-family: "Space Grotesk", sans-serif; font-size: 15px; font-weight: 700;
  color: #FFFFFF;
}
.pc-vip {
  display: inline-flex; align-items: center; gap: 4px;
  background: rgba(251,191,36,0.15); color: #FBBF24;
  border-radius: 50px; padding: 2px 9px;
  font-size: 10px; font-weight: 600; margin-top: 3px;
}
.pc-info { font-size: 11px; color: rgba(255,255,255,0.38); margin-top: 10px; line-height: 1.7; }
.pc-id {
  font-family: "JetBrains Mono", monospace;
  font-size: 10px; color: rgba(255,255,255,0.30);
  letter-spacing: 0.03em; margin-top: 6px;
}
.pc-qr {
  background: #fff; border-radius: 10px; padding: 9px;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.06);
}
/* QR blink */
.pc-qr svg { animation: qrBlink 5s ease-in-out infinite; }
@keyframes qrBlink {
  0%,88%,100% { opacity: 1; }
  94% { opacity: 0.6; }
}

/* ══════════ HERO PASS CAROUSEL ══════════ */
.pc-carousel {
  position: relative; width: 320px; height: 316px;
}
.pc-slide {
  position: absolute; inset: 0;
  display: flex; align-items: flex-start; justify-content: center;
  opacity: 0; pointer-events: none;
}
.pc-slide.pc-active {
  opacity: 1; pointer-events: auto; z-index: 2;
  animation: pcSlideIn 0.46s cubic-bezier(0.16,1,0.3,1) forwards;
}
.pc-slide.pc-exiting {
  z-index: 1; pointer-events: none;
  animation: pcSlideOut 0.34s cubic-bezier(0.4,0,1,1) forwards;
}
@keyframes pcSlideIn {
  from { opacity: 0; transform: translateY(22px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes pcSlideOut {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to   { opacity: 0; transform: translateY(-16px) scale(0.97); }
}

/* slide indicator dots */
.pc-dots {
  display: flex; justify-content: center; gap: 7px;
  margin-top: 16px;
}
.pc-dot {
  height: 6px; width: 6px; border-radius: 3px;
  background: var(--color-border-active); border: none; padding: 0;
  cursor: pointer;
  transition: background 280ms, width 280ms, box-shadow 280ms;
}
.pc-dot.pc-dot-active {
  width: 22px; border-radius: 3px;
  background: var(--color-primary);
  box-shadow: 0 0 10px var(--color-primary-glow);
}

/* label pill above carousel */
.pc-template-label {
  text-align: center; margin-bottom: 10px;
  font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--color-text-muted);
  transition: opacity 200ms;
}

/* ── Minimal pass variant ── */
.pc-minimal {
  border-radius: 20px; overflow: hidden; width: 320px;
  background: #FFFFFF;
  box-shadow: 0 20px 60px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.07);
}
.pc-minimal-top {
  height: 136px; position: relative;
  background: linear-gradient(140deg, #F4F4FB 0%, #E8E8F8 100%);
  padding: 20px 24px;
  display: flex; flex-direction: column; justify-content: space-between;
  border-bottom: 1px solid rgba(0,0,0,0.055);
}
.pc-minimal-badge {
  display: inline-flex; align-items: center; gap: 4px;
  background: rgba(99,68,212,0.09); border: 1px solid rgba(99,68,212,0.18);
  border-radius: 50px; padding: 3px 10px;
  font-size: 10px; font-weight: 600; letter-spacing: 0.06em;
  color: #6344D4; text-transform: uppercase; width: fit-content;
}
.pc-minimal-event { font-family: "Space Grotesk", sans-serif; font-size: 18px; font-weight: 800; color: #0D0D12; letter-spacing: -0.02em; margin-top: 2px; }
.pc-minimal-meta { font-size: 10px; color: rgba(13,13,18,0.40); margin-top: 2px; display: flex; gap: 10px; }
.pc-minimal-perf {
  border-top: 2px dashed rgba(0,0,0,0.08); margin: 0 -1px; position: relative;
}
.pc-minimal-perf::before, .pc-minimal-perf::after {
  content: ''; position: absolute; top: -12px;
  width: 24px; height: 24px; border-radius: 50%; background: #ffffff;
}
.pc-minimal-perf::before { left: -13px; }
.pc-minimal-perf::after  { right: -13px; }
.pc-minimal-bottom {
  background: #FFFFFF; padding: 18px 20px 18px 24px;
  display: grid; grid-template-columns: 1fr auto; gap: 14px; align-items: end;
}
.pc-minimal-name { font-family: "Space Grotesk", sans-serif; font-size: 15px; font-weight: 700; color: #0D0D12; }
.pc-minimal-ticket {
  display: inline-flex; background: rgba(99,68,212,0.08); color: #6344D4;
  border-radius: 50px; padding: 2px 9px; font-size: 10px; font-weight: 600; margin-top: 3px;
}
.pc-minimal-info { font-size: 11px; color: rgba(13,13,18,0.33); margin-top: 10px; line-height: 1.7; }
.pc-minimal-id { font-family: "JetBrains Mono", monospace; font-size: 10px; color: rgba(13,13,18,0.22); margin-top: 6px; }
.pc-minimal-qr { background: #F4F4FB; border-radius: 10px; padding: 9px; border: 1px solid rgba(0,0,0,0.07); }

/* ── Vibrant pass variant ── */
.pc-vibrant {
  border-radius: 20px; overflow: hidden; width: 320px;
  box-shadow: 0 20px 60px rgba(123,92,240,0.28), 0 0 0 1px rgba(123,92,240,0.18);
}
.pc-vibrant-top {
  height: 136px; position: relative;
  background: linear-gradient(135deg, #7B5CF0 0%, #C026A6 60%, #E8186D 100%);
  padding: 20px 24px;
  display: flex; flex-direction: column; justify-content: space-between;
}
.pc-vibrant-badge {
  display: inline-flex; align-items: center; gap: 4px;
  background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.28);
  border-radius: 50px; padding: 3px 10px;
  font-size: 10px; font-weight: 600; letter-spacing: 0.06em;
  color: #fff; text-transform: uppercase; width: fit-content;
}
.pc-vibrant-event { font-family: "Space Grotesk", sans-serif; font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -0.02em; text-shadow: 0 2px 12px rgba(0,0,0,0.25); }
.pc-vibrant-meta { font-size: 10px; color: rgba(255,255,255,0.60); margin-top: 2px; display: flex; gap: 10px; }
.pc-vibrant-perf {
  border-top: 2px dashed rgba(255,255,255,0.18); margin: 0 -1px; position: relative;
}
.pc-vibrant-perf::before, .pc-vibrant-perf::after {
  content: ''; position: absolute; top: -12px;
  width: 24px; height: 24px; border-radius: 50%; background: #150C2A;
}
.pc-vibrant-perf::before { left: -13px; }
.pc-vibrant-perf::after  { right: -13px; }
.pc-vibrant-bottom {
  background: #150C2A; padding: 18px 20px 18px 24px;
  display: grid; grid-template-columns: 1fr auto; gap: 14px; align-items: end;
}
.pc-vibrant-name { font-family: "Space Grotesk", sans-serif; font-size: 15px; font-weight: 700; color: #fff; }
.pc-vibrant-ticket {
  display: inline-flex; background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.88);
  border-radius: 50px; padding: 2px 9px; font-size: 10px; font-weight: 600; margin-top: 3px;
}
.pc-vibrant-info { font-size: 11px; color: rgba(255,255,255,0.32); margin-top: 10px; line-height: 1.7; }
.pc-vibrant-id { font-family: "JetBrains Mono", monospace; font-size: 10px; color: rgba(255,255,255,0.20); margin-top: 6px; }
.pc-vibrant-qr { background: rgba(255,255,255,0.10); border-radius: 10px; padding: 9px; }

/* ══════════ DIVIDER / SECTION TRANSITION ══════════ */
.gw-slash-divider {
  position: relative; height: 120px; overflow: hidden;
  z-index: 1;
}
.gw-slash-divider::before {
  content: '';
  position: absolute; inset: 0;
  background: var(--bg, var(--color-bg));
  clip-path: polygon(0 0, 100% 30%, 100% 100%, 0 100%);
}

/* ══════════ SECTION BASE ══════════ */
.gw-section {
  position: relative; z-index: 1;
  padding: 160px 72px;
}
.gw-section-inner { max-width: 1296px; margin: 0 auto; }
.gw-eyebrow {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--color-primary);
  margin-bottom: 24px;
}
.gw-section-title {
  font-family: "Space Grotesk", sans-serif;
  font-size: clamp(36px, 5vw, 62px);
  font-weight: 800; line-height: 1.04;
  letter-spacing: -0.03em;
}
.gw-section-sub {
  font-size: 18px; line-height: 1.65; color: var(--color-text-secondary);
  max-width: 560px; margin-top: 22px;
}

/* ══════════ FEATURE GRID ══════════ */
.gw-features-bg { background: var(--color-surface-2); }
.gw-feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px; margin-top: 80px;
}
.gw-feat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px; padding: 40px;
  transition: border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease;
  cursor: default; position: relative; overflow: hidden;
}
.gw-feat-card::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(232,24,109,0.05) 0%, transparent 60%);
  opacity: 0; transition: opacity 200ms;
}
.gw-feat-card:hover::before { opacity: 1; }
.gw-feat-card:hover {
  border-color: rgba(232,24,109,0.25);
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.08), 0 0 0 1px rgba(232,24,109,0.15);
}
.gw-feat-icon {
  width: 52px; height: 52px; border-radius: 15px;
  background: var(--color-primary-soft);
  border: 1px solid rgba(232,24,109,0.2);
  display: flex; align-items: center; justify-content: center;
  color: var(--color-primary); margin-bottom: 28px;
  position: relative;
}
.gw-feat-title {
  font-family: "Space Grotesk", sans-serif; font-size: 18px; font-weight: 700;
  margin-bottom: 12px; letter-spacing: -0.015em;
}
.gw-feat-body { font-size: 15px; color: var(--color-text-secondary); line-height: 1.7; }

/* ══════════ HOW IT WORKS ══════════ */
.gw-how-layout {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 120px; margin-top: 88px; align-items: start;
}
.gw-steps { display: flex; flex-direction: column; gap: 0; }
.gw-step {
  display: flex; gap: 24px; position: relative;
  padding-bottom: 48px; cursor: default;
}
.gw-step:last-child { padding-bottom: 0; }
/* connector line */
.gw-step:not(:last-child)::after {
  content: ''; position: absolute;
  left: 22px; top: 46px; bottom: 0; width: 2px;
  background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-accent) 100%);
  opacity: 0.2; transition: opacity 300ms;
}
.gw-step.active-step::after { opacity: 0.8; }

.gw-step-ring {
  flex-shrink: 0;
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--color-surface-2);
  border: 2px solid var(--color-border-active);
  display: flex; align-items: center; justify-content: center;
  transition: border-color 300ms, box-shadow 300ms, background 300ms;
  color: var(--color-text-secondary);
}
.gw-step.active-step .gw-step-ring {
  border-color: var(--color-primary);
  box-shadow: 0 0 22px var(--color-primary-glow);
  background: var(--color-primary-soft);
  color: var(--color-primary);
}
.gw-step-body { padding-top: 8px; }
.gw-step-title {
  font-family: "Space Grotesk", sans-serif; font-size: 18px; font-weight: 700;
  margin-bottom: 8px; transition: color 300ms;
}
.gw-step.active-step .gw-step-title { color: var(--color-primary); }
.gw-step-desc { font-size: 15px; color: var(--color-text-secondary); line-height: 1.65; }
.gw-step-num {
  font-family: "JetBrains Mono", monospace; font-size: 10px;
  color: var(--color-text-muted); margin-bottom: 4px;
  letter-spacing: 0.05em;
}

/* right side — animated pass mockup in how-it-works */
.gw-how-visual {
  position: sticky; top: 120px;
  display: flex; flex-direction: column; gap: 16px;
  align-items: center;
}
.gw-how-screen {
  background: var(--color-surface);
  border: 1px solid var(--color-border-active);
  border-radius: 20px; padding: 24px;
  width: 100%; max-width: 380px;
  transition: transform 400ms cubic-bezier(.16,1,.3,1), opacity 400ms, box-shadow 400ms;
}
.gw-how-screen.active-screen {
  border-color: var(--color-primary);
  box-shadow: 0 0 28px rgba(232,24,109,0.18), 0 8px 32px rgba(0,0,0,0.08);
  transform: translateY(-4px);
}
.gw-how-screen-title {
  font-family: "Space Grotesk", sans-serif; font-size: 13px; font-weight: 700;
  color: var(--color-text-muted); text-transform: uppercase;
  letter-spacing: 0.07em; margin-bottom: 14px;
  display: flex; align-items: center; gap: 7px;
}
.gw-how-screen-title span {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 8px var(--color-primary-glow);
  display: inline-block;
}
/* mini form fields */
.gw-mini-field {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: 10px; padding: 10px 14px;
  font-size: 13px; color: var(--color-text-muted);
  margin-bottom: 10px; font-family: "DM Sans", sans-serif;
  display: flex; align-items: center; gap: 8px;
}
.gw-mini-field.filled { color: var(--color-text-primary); border-color: var(--color-border-active); }
.gw-mini-btn {
  width: 100%; background: var(--color-primary); color: #fff;
  border: none; border-radius: 10px; padding: 12px;
  font-family: "DM Sans", sans-serif; font-size: 14px; font-weight: 600;
  text-align: center; margin-top: 4px;
  box-shadow: 0 0 20px var(--color-primary-glow);
}
/* mini attendee rows */
.gw-mini-row {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 0; border-bottom: 1px solid var(--color-border);
}
.gw-mini-avatar {
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700;
  font-family: "DM Sans", sans-serif;
}
.gw-mini-row-name { font-size: 13px; color: var(--color-text-primary); }
.gw-mini-row-type { font-size: 11px; color: var(--color-text-muted); margin-left: auto; }
/* mini pass grid */
.gw-mini-passes {
  display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
}
.gw-mini-pass {
  background: var(--color-surface-2); border-radius: 10px; padding: 10px;
  border: 1px solid var(--color-border);
}
.gw-mini-pass-name { font-size: 12px; font-weight: 600; font-family: "Space Grotesk", sans-serif; }
.gw-mini-pass-id { font-family: "JetBrains Mono", monospace; font-size: 9px; color: var(--color-text-muted); margin-top: 2px; }
.gw-mini-pass-status {
  display: inline-flex; align-items: center; gap: 3px;
  margin-top: 6px; font-size: 10px; font-weight: 600;
  color: var(--color-success);
}
.gw-mini-pass-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--color-success); animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
/* verify screen */
.gw-verify-input {
  background: var(--color-surface-2); border: 1px solid var(--color-primary);
  border-radius: 10px; padding: 12px 14px;
  font-family: "JetBrains Mono", monospace; font-size: 13px;
  color: var(--color-text-primary); width: 100%; margin-bottom: 10px;
  box-shadow: 0 0 0 3px var(--color-primary-soft);
  display: flex; align-items: center; gap: 8px;
}
.gw-verify-result {
  background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3);
  border-radius: 12px; padding: 14px 16px;
  display: flex; align-items: center; gap: 12px;
}
.gw-verify-check {
  width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
  background: rgba(34,197,94,0.2); color: var(--color-success);
  display: flex; align-items: center; justify-content: center;
}
.gw-verify-name { font-family: "Space Grotesk", sans-serif; font-size: 14px; font-weight: 700; }
.gw-verify-sub { font-size: 12px; color: var(--color-text-secondary); margin-top: 2px; }

/* ══════════ STATS STRIP ══════════ */
.gw-stats {
  position: relative; z-index: 1;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
  padding: 0 72px;
  display: grid; grid-template-columns: repeat(4, 1fr);
  overflow: hidden;
}
.gw-stat-item {
  padding: 60px 32px;
  border-right: 1px solid var(--color-border);
  display: flex; flex-direction: column; gap: 4px;
  position: relative;
}
.gw-stat-item:last-child { border-right: none; }
.gw-stat-item::after {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0;
  width: 2px; background: var(--color-primary); opacity: 0;
  transition: opacity 200ms;
}
.gw-stat-item:hover::after { opacity: 1; }
.gw-stat-num {
  font-family: "Space Grotesk", sans-serif; font-size: 52px; font-weight: 800;
  letter-spacing: -0.04em; line-height: 1;
  background: linear-gradient(135deg, var(--color-stat-grad-start) 0%, var(--color-stat-grad-end) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.gw-stat-label { font-size: 14px; color: var(--color-text-muted); margin-top: 6px; }

/* ══════════ TEMPLATES ══════════ */
.gw-templates-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  flex-wrap: wrap; gap: 24px; margin-bottom: 80px;
}
.gw-template-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}
.gw-tpl-wrap {
  display: flex; flex-direction: column; gap: 14px; align-items: stretch;
}
.gw-tpl-card {
  border-radius: 18px; overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 0 0 1px var(--color-border);
  transition: transform 300ms cubic-bezier(.34,1.56,.64,1), box-shadow 300ms;
  cursor: default;
}
.gw-tpl-card:hover {
  transform: translateY(-6px) rotate(-0.5deg) scale(1.01);
  box-shadow: 0 20px 50px rgba(0,0,0,0.14), 0 0 0 1px rgba(232,24,109,0.2);
}
.gw-tpl-top { height: 110px; position: relative; overflow: hidden; }
.gw-tpl-bottom { padding: 16px 18px; display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center; }
.gw-tpl-name { font-family: "Space Grotesk", sans-serif; font-size: 14px; font-weight: 700; }
.gw-tpl-id { font-family: "JetBrains Mono", monospace; font-size: 9px; margin-top: 2px; }
.gw-tpl-qr { background: #fff; border-radius: 8px; padding: 6px; }
.gw-tpl-label {
  font-size: 13px; font-weight: 600; color: var(--color-text-muted);
  text-align: center; letter-spacing: 0.04em;
}
.gw-tpl-perf {
  border-top: 2px dashed rgba(255,255,255,0.12);
  margin: 0 -1px; position: relative;
}
.gw-tpl-perf::before, .gw-tpl-perf::after {
  content: ''; position: absolute; top: -12px;
  width: 24px; height: 24px; border-radius: 50%;
}

/* Classic — always dark card */
.tpl-classic .gw-tpl-top { background: #0D0D12; }
.tpl-classic .gw-tpl-top::after { content: ''; position: absolute; left: 0; inset-block: 0; width: 4px; background: var(--color-primary); box-shadow: 0 0 16px var(--color-primary-glow); }
.tpl-classic .gw-tpl-bottom { background: #15151E; }
.tpl-classic .gw-tpl-perf::before, .tpl-classic .gw-tpl-perf::after { background: #15151E; }
.tpl-classic .gw-tpl-name { color: #FFFFFF; }
.tpl-classic .gw-tpl-id { color: rgba(255,255,255,0.35); }

/* Minimal */
.tpl-minimal .gw-tpl-top { background: #FAFAFA; border-bottom: 1px solid #E8E8F0; }
.tpl-minimal .gw-tpl-bottom { background: #FFFFFF; }
.tpl-minimal .gw-tpl-perf { border-top-color: rgba(0,0,0,0.1); }
.tpl-minimal .gw-tpl-perf::before, .tpl-minimal .gw-tpl-perf::after { background: #F4F4F8; }
.tpl-minimal .gw-tpl-name { color: #0D0D12; }
.tpl-minimal .gw-tpl-id { color: rgba(13,13,18,0.35); }

/* Vibrant */
.tpl-vibrant .gw-tpl-top {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
}
.tpl-vibrant .gw-tpl-bottom { background: #fff; }
.tpl-vibrant .gw-tpl-perf::before, .tpl-vibrant .gw-tpl-perf::after { background: #f0f0f8; }
.tpl-vibrant .gw-tpl-name { color: #0D0D12; }
.tpl-vibrant .gw-tpl-id { color: rgba(13,13,18,0.35); }

/* ══════════ CTA SECTION ══════════ */
.gw-cta-section {
  position: relative; z-index: 1;
  padding: 200px 72px; text-align: center; overflow: hidden;
}
.gw-cta-radial {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 70% 60% at 50% 60%, rgba(232,24,109,0.06), transparent),
    radial-gradient(ellipse 40% 40% at 20% 40%, rgba(99,68,212,0.05), transparent);
}
/* editorial slash lines in CTA */
.gw-cta-slash-l, .gw-cta-slash-r {
  position: absolute; top: 0; bottom: 0; width: 1px;
  background: linear-gradient(180deg, transparent, rgba(232,24,109,0.12), transparent);
  opacity: 0.6;
}
.gw-cta-slash-l { left: 15%; transform: skewX(-8deg); }
.gw-cta-slash-r { right: 15%; transform: skewX(8deg); }

.gw-cta-title {
  font-family: "Space Grotesk", sans-serif;
  font-size: clamp(42px, 6.5vw, 80px); font-weight: 800;
  line-height: 1.02; letter-spacing: -0.035em;
  max-width: 900px; margin: 0 auto; position: relative; z-index: 1;
}
.gw-cta-grad {
  background: linear-gradient(120deg, var(--color-primary) 0%, #c4176a 50%, var(--color-accent) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.gw-cta-sub {
  font-size: 19px; color: var(--color-text-secondary);
  max-width: 520px; margin: 28px auto 0; line-height: 1.65;
  position: relative; z-index: 1;
}
.gw-cta-actions {
  display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;
  margin-top: 56px; position: relative; z-index: 1;
}
.gw-cta-checks {
  display: flex; align-items: center; justify-content: center; gap: 32px;
  margin-top: 36px; flex-wrap: wrap; position: relative; z-index: 1;
}
.gw-cta-check {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; color: var(--color-text-muted);
}

/* ══════════ FOOTER ══════════ */
.gw-footer {
  position: relative; z-index: 1;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  padding: 60px 72px;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 20px;
}
.gw-footer-logo {
  font-family: "Space Grotesk", sans-serif; font-size: 16px; font-weight: 800;
  color: var(--color-text-secondary);
  display: flex; align-items: center; gap: 8px;
}
.gw-footer-links {
  display: flex; gap: 24px; list-style: none;
}
.gw-footer-links a {
  font-size: 13px; color: var(--color-text-muted); text-decoration: none;
  transition: color 150ms;
}
.gw-footer-links a:hover { color: var(--color-text-primary); }

/* ══════════ REVEAL SYSTEM ══════════ */
.gw-reveal {
  opacity: 0; transform: translateY(36px);
  transition: opacity 0.75s cubic-bezier(.16,1,.3,1), transform 0.75s cubic-bezier(.16,1,.3,1);
}
.gw-reveal.gw-in { opacity: 1; transform: translateY(0); }
.gw-reveal-d1 { transition-delay: 0.08s; }
.gw-reveal-d2 { transition-delay: 0.16s; }
.gw-reveal-d3 { transition-delay: 0.24s; }
.gw-reveal-d4 { transition-delay: 0.32s; }
.gw-reveal-d5 { transition-delay: 0.40s; }

/* ══════════ HERO CITYSCAPE ══════════ */
.gw-cityscape {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  height: 52%;
}
.gw-cityscape svg {
  width: 100%; height: 100%;
  display: block;
}
/* ensure hero content sits above cityscape */
.gw-hero { position: relative; }
.gw-hero-left  { position: relative; z-index: 2; }
.gw-hero-right { position: relative; z-index: 2; }
.gw-scroll-hint { z-index: 3; }

/* ══════════ RESPONSIVE — TABLET ══════════ */
@media (max-width: 1023px) {
  .gw-nav { padding: 14px 20px; }
  .gw-nav-links { display: none; }
  .gw-nav-cta { padding: 10px 18px; font-size: 13px; }

  .gw-hero { grid-template-columns: 1fr; padding: 120px 24px 80px; text-align: center; }
  .gw-hero-left { align-items: center; }
  .gw-hero-right { margin-top: 48px; }
  .gw-hero-slash { display: none; }
  .gw-bg-letter { display: none; }
  .gw-sub { max-width: 100%; }

  .gw-how-layout { grid-template-columns: 1fr; gap: 48px; }
  .gw-how-visual { position: static; }

  .gw-stats { grid-template-columns: repeat(2, 1fr); padding: 0 24px; }
  .gw-template-grid { grid-template-columns: 1fr 1fr; }

  .gw-section { padding: 100px 40px; }
  .gw-cta-section { padding: 100px 40px; }
  .gw-footer { padding: 40px 40px; }
}

/* ══════════ RESPONSIVE — MOBILE ══════════ */
@media (max-width: 640px) {
  /* Nav — hamburger layout */
  .gw-nav { padding: 12px 16px; gap: 0; }
  .gw-nav-cta { display: none; }
  .gw-logo { font-size: 17px; flex: 1; }
  .gw-theme-toggle { display: none; }
  .gw-hamburger { display: flex; }
  .gw-mobile-menu { display: flex; }

  /* Hero */
  .gw-hero { padding: 90px 20px 60px; min-height: auto; }
  .gw-badge { margin-bottom: 24px; font-size: 10px; }
  .gw-headline { font-size: clamp(34px, 9vw, 52px); }
  .gw-sub { font-size: 16px; max-width: 100%; margin-top: 18px; }
  .gw-hero-ctas { flex-direction: column; width: 100%; margin-top: 32px; gap: 10px; }
  .btn-primary { width: 100%; justify-content: center; padding: 14px 24px; font-size: 14px; }
  .btn-ghost { width: 100%; justify-content: center; padding: 13px 24px; font-size: 14px; }
  .gw-hero-meta { gap: 12px; margin-top: 32px; }
  .gw-scroll-hint { left: 16px; }

  /* Stats — 2-col, compact */
  .gw-stats { grid-template-columns: 1fr 1fr; padding: 0; }
  .gw-stat-item { padding: 28px 16px; }
  .gw-stat-item:nth-child(2) { border-right: none; }
  .gw-stat-item:nth-child(3) { border-top: 1px solid var(--color-border); }
  .gw-stat-item:nth-child(4) { border-top: 1px solid var(--color-border); border-right: none; }
  .gw-stat-num { font-size: 32px; }
  .gw-stat-label { font-size: 12px; margin-top: 4px; }

  /* Sections */
  .gw-section { padding: 64px 20px; }
  .gw-section-sub { font-size: 16px; max-width: 100%; }

  /* Features */
  .gw-feature-grid { grid-template-columns: 1fr; gap: 16px; }
  .gw-feat-card { padding: 28px 24px; }

  /* How it works */
  .gw-how-layout { gap: 32px; }

  /* Templates */
  .gw-templates-header { flex-direction: column; align-items: flex-start; gap: 16px; }
  .gw-template-grid { grid-template-columns: 1fr; gap: 28px; }

  /* Pass card */
  .pc { width: min(280px, 88vw); }
  .pc-carousel { width: min(280px, 88vw); height: 300px; }
  .gw-pass-ghost { display: none; }
  .gw-pass-scene { display: flex; justify-content: center; }

  /* CTA */
  .gw-cta-section { padding: 72px 20px; }
  .gw-cta-sub { font-size: 16px; max-width: 100%; }
  .gw-cta-checks { gap: 16px; }
  .gw-cta-check { font-size: 12px; }

  /* Footer */
  .gw-footer { padding: 28px 20px; flex-direction: column; align-items: center; text-align: center; gap: 16px; }
  .gw-footer-links { flex-wrap: wrap; justify-content: center; gap: 14px; }
}

/* ══════════ RESPONSIVE — SMALL PHONES ══════════ */
@media (max-width: 390px) {
  .gw-nav { padding: 10px 12px; }
  .gw-nav-cta { padding: 8px 12px; font-size: 11px; }
  .gw-hero { padding: 80px 16px 48px; }
  .gw-headline { font-size: clamp(30px, 9vw, 44px); }
  .gw-stat-num { font-size: 26px; }
  .gw-stat-item { padding: 22px 12px; }
  .pc { width: min(260px, 90vw); }
  .pc-carousel { width: min(260px, 90vw); }
  .gw-section { padding: 52px 16px; }
}
`;

/* ══════════ CITYSCAPE SVG ══════════ */
function CityscapeSVG({ dark = false }: { dark?: boolean }) {
  const bFar  = dark ? "#0a0a0f" : "#D8D8E8";
  const bMid  = dark ? "#0D0D12" : "#C8C8DC";
  const bTall = dark ? "#0D0D12" : "#B8B8D0";
  const bSpire= dark ? "#0D0D12" : "#AEAEC8";
  const bAnt  = dark ? "#0D0D12" : "#9898B8";
  const bFore = dark ? "#0D0D12" : "#C0C0D8";
  return (
    <svg
      viewBox="0 0 1440 420"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        {/* fade-to-transparent gradient so cityscape blends into hero */}
        <linearGradient id="skyFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={dark ? "#0D0D12" : "#F8F8FC"} stopOpacity="0" />
          <stop offset="55%" stopColor={dark ? "#0D0D12" : "#F8F8FC"} stopOpacity="0.55" />
          <stop offset="100%" stopColor={dark ? "#0D0D12" : "#F8F8FC"} stopOpacity="1" />
        </linearGradient>
        {/* primary-color window glow */}
        <filter id="winGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="towerGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── Building silhouettes ── */}

      {/* Far background layer */}
      <rect x="0"   y="280" width="90"  height="140" fill={bFar} />
      <rect x="85"  y="300" width="60"  height="120" fill={bFar} />
      <rect x="140" y="260" width="80"  height="160" fill={bFar} />
      <rect x="215" y="295" width="50"  height="125" fill={bFar} />
      <rect x="260" y="270" width="70"  height="150" fill={bFar} />
      <rect x="1100" y="290" width="80"  height="130" fill={bFar} />
      <rect x="1175" y="265" width="65"  height="155" fill={bFar} />
      <rect x="1235" y="285" width="90"  height="135" fill={bFar} />
      <rect x="1320" y="270" width="60"  height="150" fill={bFar} />
      <rect x="1375" y="295" width="65"  height="125" fill={bFar} />

      {/* Mid layer — main body buildings */}
      <rect x="0"   y="220" width="100" height="200" fill={bMid} />
      <rect x="95"  y="240" width="75"  height="180" fill={bMid} />
      <rect x="165" y="200" width="55"  height="220" fill={bMid} />
      <rect x="215" y="230" width="85"  height="190" fill={bMid} />
      <rect x="295" y="210" width="65"  height="210" fill={bMid} />
      <rect x="355" y="250" width="90"  height="170" fill={bMid} />
      <rect x="440" y="230" width="55"  height="190" fill={bMid} />
      <rect x="490" y="260" width="70"  height="160" fill={bMid} />

      {/* Center cluster — tallest buildings */}
      <rect x="555" y="150" width="80"  height="270" fill={bTall} />
      <rect x="630" y="130" width="60"  height="290" fill={bTall} />
      {/* Central spire tower */}
      <rect x="685" y="60"  width="30"  height="360" fill={bSpire} />
      <polygon points="700,30 685,80 715,80" fill={bSpire} />
      {/* Antenna */}
      <rect x="698" y="10"  width="4"   height="50"  fill={bAnt} />
      {/* Tower observation deck */}
      <rect x="680" y="120" width="40"  height="18"  fill={bAnt} />
      <rect x="676" y="138" width="48"  height="8"   fill={bAnt} />

      <rect x="710" y="140" width="70"  height="280" fill={bTall} />
      <rect x="775" y="160" width="55"  height="260" fill={bTall} />
      <rect x="825" y="120" width="45"  height="300" fill={bTall} />
      {/* Slender skyscraper */}
      <rect x="865" y="80"  width="35"  height="340" fill={bSpire} />
      <polygon points="882,55 865,90 900,90" fill={bSpire} />
      <rect x="895" y="170" width="65"  height="250" fill={bTall} />

      {/* Right cluster */}
      <rect x="955" y="200" width="90"  height="220" fill={bMid} />
      <rect x="1040" y="220" width="70" height="200" fill={bMid} />
      <rect x="1105" y="190" width="80" height="230" fill={bMid} />
      <rect x="1180" y="215" width="60" height="205" fill={bMid} />
      <rect x="1235" y="230" width="95" height="190" fill={bMid} />
      <rect x="1325" y="210" width="65" height="210" fill={bMid} />
      <rect x="1385" y="240" width="55" height="180" fill={bMid} />

      {/* Foreground large base buildings */}
      <rect x="0"   y="300" width="130" height="120" fill={bFore} />
      <rect x="125" y="320" width="100" height="100" fill={bFore} />
      <rect x="1220" y="310" width="110" height="110" fill={bFore} />
      <rect x="1325" y="295" width="115" height="125" fill={bFore} />

      {/* Ground base fill */}
      <rect x="0" y="400" width="1440" height="20" fill={bFore} />

      {/* ── Windows — primary color glow ── */}
      {/* Left cluster windows */}
      {[20,40,60,80,100,120,140,160,180,200].map((y, i) =>
        [10,28,46,64].map((x, j) => (
          <rect key={`wl${i}-${j}`} x={x} y={y+225} width="8" height="5"
            fill="var(--color-primary)" opacity={((i+j)%3===0)?0.9:0.4}
            filter="url(#winGlow)" />
        ))
      )}
      {/* mid-left windows */}
      {[0,15,30,45,60,75,90].map((y, i) =>
        [170,185,200].map((x, j) => (
          <rect key={`wml${i}-${j}`} x={x} y={y+205} width="7" height="5"
            fill="var(--color-primary)" opacity={((i*j+i)%4===0)?1:0.35}
            filter="url(#winGlow)" />
        ))
      )}
      {/* Center tower windows */}
      {[0,20,40,60,80,100,120,140,160,180,200,220].map((y, i) =>
        [560,575,590,605,620].map((x, j) => (
          <rect key={`wc${i}-${j}`} x={x} y={y+155} width="7" height="6"
            fill="var(--color-primary)" opacity={((i+j)%3===0)?0.85:0.3}
            filter="url(#winGlow)" />
        ))
      )}
      {/* Tall spire lit windows */}
      {[0,18,36,54,72,90,108,126,144,162,180,200,220,240].map((y, i) =>
        [630,642,654].map((x, j) => (
          <rect key={`ws${i}-${j}`} x={x} y={y+135} width="6" height="5"
            fill="var(--color-primary)" opacity={((i+j)%2===0)?0.9:0.2}
            filter="url(#winGlow)" />
        ))
      )}
      {/* Antenna tip light */}
      <circle cx="700" cy="12" r="4" fill="var(--color-primary)" filter="url(#towerGlow)" opacity="0.95" />
      {/* Tower observation deck lights */}
      {[681,686,691,696,702,707,712,717].map((x,i) => (
        <rect key={`obs${i}`} x={x} y="122" width="4" height="4"
          fill="var(--color-primary)" opacity={i%2===0?1:0.5} filter="url(#winGlow)" />
      ))}

      {/* Right skyscraper lit windows */}
      {[0,16,32,48,64,80,96,112,128,144,160,180,200,220,240,260].map((y, i) =>
        [866,876,886].map((x, j) => (
          <rect key={`wsk${i}-${j}`} x={x} y={y+85} width="5" height="5"
            fill="var(--color-primary)" opacity={((i*2+j)%3===0)?0.9:0.25}
            filter="url(#winGlow)" />
        ))
      )}
      {/* Right cluster windows */}
      {[0,14,28,42,56,70,84,98,112,126,140,160,180].map((y, i) =>
        [960,975,990,1005,1020,1035].map((x, j) => (
          <rect key={`wr${i}-${j}`} x={x} y={y+205} width="7" height="5"
            fill="var(--color-primary)" opacity={((i+j*2)%4===0)?0.9:0.3}
            filter="url(#winGlow)" />
        ))
      )}
      {[0,14,28,42,56,70,84,98,112,126,140].map((y, i) =>
        [1110,1125,1140,1155,1170].map((x, j) => (
          <rect key={`wr2${i}-${j}`} x={x} y={y+195} width="7" height="5"
            fill="var(--color-primary)" opacity={((i+j)%3===0)?0.85:0.28}
            filter="url(#winGlow)" />
        ))
      )}

      {/* ── Street-level glow — subtle pink ground reflection ── */}
      <rect x="0" y="390" width="1440" height="30" fill="var(--color-primary)" opacity="0.03" />

      {/* ── Sky-to-transparent overlay so it blends into hero bg ── */}
      <rect x="0" y="0" width="1440" height="420" fill="url(#skyFade)" />
    </svg>
  );
}

/* ══════════ QR CODE COMPONENT ══════════ */
function QRCode({ size = 68, dark = true }) {
  const cols = [
    [1,1,1,1,1,1,1,0,0,1,0,1,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,1,1,0,0,1,1,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,1,0,0,0,0,0,0,0],
    [1,0,1,0,0,1,1,1,0,0,1,0,1,1,1,0,1,1,0,1,0],
    [0,1,0,1,1,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,1],
    [1,1,0,1,0,1,1,1,0,1,1,0,1,1,1,1,0,1,0,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,1,1,0],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,0,1,0,1,0],
    [1,0,0,0,0,0,1,0,0,1,0,0,0,1,0,1,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,1,0,0,1,0,1,0,1,1,0],
    [1,0,1,1,1,0,1,0,0,0,0,1,0,1,0,1,0,1,0,0,1],
    [1,0,1,1,1,0,1,1,0,1,1,0,1,0,1,1,0,0,1,0,0],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,0,1,1,0,1,0],
    [1,1,1,1,1,1,1,1,0,1,0,0,1,0,1,0,0,0,1,0,1],
  ];
  const cell = size / cols[0].length;
  const color = dark ? "#0D0D12" : "#0D0D12";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="pc-qr-svg">
      {cols.map((row, ri) =>
        row.map((c, ci) =>
          c ? <rect key={`${ri}-${ci}`} x={ci * cell} y={ri * cell} width={cell - 0.5} height={cell - 0.5} fill={color} rx="0.5" /> : null
        )
      )}
    </svg>
  );
}

/* ══════════ PASS CARD ══════════ */
function PassCard({ mini = false }) {
  const w = mini ? 240 : 320;
  return (
    <div className="pc" style={{ width: w }}>
      <div className="pc-top">
        <div className="pc-top-stripe" />
        <div className="pc-top-glow" />
        <div className="pc-top-inner">
          <div className="pc-tag"><Ticket size={9} />Conference</div>
          <div>
            <div className="pc-event-name">{mini ? "Neon Summit" : "Neon Summit '26"}</div>
            <div className="pc-event-meta">
              <span><MapPin size={9} />{mini ? "Lagos" : "Eko Hotel, Lagos"}</span>
              <span><Clock size={9} />21 Jun 2026</span>
            </div>
          </div>
        </div>
      </div>
      <div className="pc-perf" style={{ '--notch-bg': 'var(--color-bg)' } as React.CSSProperties} />
      <div className="pc-bottom">
        <div>
          <div className="pc-name">{mini ? "A. Osei-Bonsu" : "Amara Osei-Bonsu"}</div>
          <div className="pc-vip">✦ VIP</div>
          {!mini && <div className="pc-info">Seat A-12 · Row 1<br />General Entry · 18:00</div>}
          <div className="pc-id">EVT-AX9KD2-0042</div>
        </div>
        <div className="pc-qr">
          <QRCode size={mini ? 56 : 68} />
        </div>
      </div>
    </div>
  );
}

/* ══════════ MINIMAL PASS CARD ══════════ */
function MinimalPassCard() {
  return (
    <div className="pc-minimal">
      <div className="pc-minimal-top">
        <div className="pc-minimal-badge"><Sparkles size={8} />Workshop</div>
        <div>
          <div className="pc-minimal-event">Design Systems '26</div>
          <div className="pc-minimal-meta">
            <span><MapPin size={8} />Civic Centre, Nairobi</span>
            <span><Clock size={8} />14 Mar 2026</span>
          </div>
        </div>
      </div>
      <div className="pc-minimal-perf" />
      <div className="pc-minimal-bottom">
        <div>
          <div className="pc-minimal-name">Kofi Mensah-Bonsu</div>
          <div className="pc-minimal-ticket">Speaker Pass</div>
          <div className="pc-minimal-info">Stage B · Front Row<br />Doors open · 09:00</div>
          <div className="pc-minimal-id">EVT-DS9WX1-0077</div>
        </div>
        <div className="pc-minimal-qr"><QRCode size={68} /></div>
      </div>
    </div>
  );
}

/* ══════════ VIBRANT PASS CARD ══════════ */
function VibrantPassCard() {
  return (
    <div className="pc-vibrant">
      <div className="pc-vibrant-top">
        <div className="pc-vibrant-badge"><Star size={8} />Music Festival</div>
        <div>
          <div className="pc-vibrant-event">Electric Horizon</div>
          <div className="pc-vibrant-meta">
            <span><MapPin size={8} />Lekki Beach, Lagos</span>
            <span><Clock size={8} />31 Dec 2026</span>
          </div>
        </div>
      </div>
      <div className="pc-vibrant-perf" />
      <div className="pc-vibrant-bottom">
        <div>
          <div className="pc-vibrant-name">Adaeze Okonkwo</div>
          <div className="pc-vibrant-ticket">✦ VIP Backstage</div>
          <div className="pc-vibrant-info">Zone A · Gate 1<br />Early access · 17:00</div>
          <div className="pc-vibrant-id">EVT-EH7PK4-0003</div>
        </div>
        <div className="pc-vibrant-qr"><QRCode size={68} dark /></div>
      </div>
    </div>
  );
}

/* ══════════ HERO PASS CAROUSEL ══════════ */
const CAROUSEL_LABELS = ["Classic", "Minimal", "Vibrant"];

function HeroPassCarousel() {
  const [active, setActive] = useState(0);
  const [exiting, setExiting] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (next: number) => {
    if (next === active) return;
    setExiting(active);
    setTimeout(() => setExiting(null), 400);
    setActive(next);
    if (timerRef.current) { clearInterval(timerRef.current); startTimer(next); }
  };

  const startTimer = (from: number) => {
    let cur = from;
    timerRef.current = setInterval(() => {
      const next = (cur + 1) % 3;
      setExiting(cur);
      setTimeout(() => setExiting(null), 400);
      setActive(next);
      cur = next;
    }, 3600);
  };

  useEffect(() => {
    startTimer(0);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const slides = [<PassCard />, <MinimalPassCard />, <VibrantPassCard />];

  return (
    <div>
      <div className="pc-template-label">{CAROUSEL_LABELS[active]} Template</div>
      <div className="pc-carousel">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={[
              "pc-slide",
              i === active ? "pc-active" : "",
              i === exiting ? "pc-exiting" : "",
            ].join(" ").trim()}
          >
            {slide}
          </div>
        ))}
      </div>
      <div className="pc-dots">
        {[0, 1, 2].map(i => (
          <button
            key={i}
            className={`pc-dot ${i === active ? "pc-dot-active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}

/* ══════════ TEMPLATE CARD ══════════ */
function TemplatePassCard({ type }: { type: string }) {
  const isClassic = type === "classic";
  const isMinimal = type === "minimal";
  const isVibrant = type === "vibrant";
  const bgPerf = isMinimal ? "#F4F4F8" : isVibrant ? "#f0f0f8" : "var(--color-bg)";
  const names: Record<string, string> = { classic: "Classic Night", minimal: "Minimalist Gala", vibrant: "Electric Festival" };
  return (
    <div className={`gw-tpl-card tpl-${type}`}>
      <div className="gw-tpl-top">
        {isClassic && (
          <div style={{position:"absolute",inset:0,padding:"16px 20px 16px 24px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
            <div style={{fontFamily:"DM Sans",fontSize:"9px",letterSpacing:"0.08em",color:"rgba(232,24,109,0.8)",textTransform:"uppercase",fontWeight:600}}>Conference · 21 Jun</div>
            <div style={{fontFamily:"Space Grotesk",fontSize:"16px",fontWeight:800,color:"#fff",letterSpacing:"-0.02em"}}>{names[type]}</div>
          </div>
        )}
        {isMinimal && (
          <div style={{position:"absolute",inset:0,padding:"16px 20px 16px 22px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
            <div style={{fontFamily:"DM Sans",fontSize:"9px",letterSpacing:"0.08em",color:"rgba(13,13,18,0.4)",textTransform:"uppercase",fontWeight:600}}>Conference · 21 Jun</div>
            <div style={{fontFamily:"Space Grotesk",fontSize:"16px",fontWeight:800,color:"#0D0D12",letterSpacing:"-0.02em"}}>{names[type]}</div>
          </div>
        )}
        {isVibrant && (
          <div style={{position:"absolute",inset:0,padding:"16px 20px 16px 22px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
            <div style={{fontFamily:"DM Sans",fontSize:"9px",letterSpacing:"0.08em",color:"rgba(255,255,255,0.7)",textTransform:"uppercase",fontWeight:600}}>Conference · 21 Jun</div>
            <div style={{fontFamily:"Space Grotesk",fontSize:"16px",fontWeight:800,color:"#fff",letterSpacing:"-0.02em"}}>{names[type]}</div>
          </div>
        )}
      </div>
      {/* perforated divider */}
      <div className="gw-tpl-perf" style={{ '--notch-bg': bgPerf } as React.CSSProperties}>
        <div style={{position:"absolute",left:"-13px",top:"-12px",width:"24px",height:"24px",borderRadius:"50%",background: bgPerf}} />
        <div style={{position:"absolute",right:"-13px",top:"-12px",width:"24px",height:"24px",borderRadius:"50%",background: bgPerf}} />
      </div>
      <div className="gw-tpl-bottom">
        <div>
          <div className="gw-tpl-name">Alex Mensah</div>
          <div className="gw-tpl-id">EVT-BK3MZ9-0019</div>
        </div>
        <div className="gw-tpl-qr">
          <QRCode size={38} />
        </div>
      </div>
    </div>
  );
}

/* ══════════ HOW-IT-WORKS SCREEN MOCKUPS ══════════ */
function HowScreen({ step }: { step: number }) {
  const avatarColors = ["var(--color-primary-soft)","var(--color-accent-soft)","rgba(34,197,94,0.15)"];
  const avatarTextColors = ["var(--color-primary)","var(--color-accent)","var(--color-success)"];
  const attendees = [
    { init:"AO", name:"Amara Osei-Bonsu", type:"VIP" },
    { init:"JM", name:"James Mensah", type:"General" },
    { init:"FK", name:"Fatima Koné", type:"Speaker" },
  ];
  if (step === 0) return (
    <div>
      <div className="gw-how-screen-title"><span />Create Event</div>
      {[["Event name","Neon Summit '26",true],["Date","21 June 2026",true],["Venue","Eko Hotel, Lagos",true],["Template","Classic",false]].map(([label, val, filled]) => (
        <div key={label as string} className={`gw-mini-field ${filled ? "filled" : ""}`}>
          <span style={{fontSize:"10px",color:"var(--color-text-muted)",minWidth:"56px",fontFamily:"DM Sans"}}>{label}</span>
          <span style={{flex:1,fontSize:"12px"}}>{filled ? val : <span style={{color:"var(--color-text-muted)"}}>{val}</span>}</span>
        </div>
      ))}
      <div className="gw-mini-btn">Create Event →</div>
    </div>
  );
  if (step === 1) return (
    <div>
      <div className="gw-how-screen-title"><span />Add Attendees</div>
      {attendees.map((a, i) => (
        <div key={i} className="gw-mini-row">
          <div className="gw-mini-avatar" style={{background:avatarColors[i],color:avatarTextColors[i]}}>{a.init}</div>
          <div>
            <div className="gw-mini-row-name">{a.name}</div>
          </div>
          <div className="gw-mini-row-type">{a.type}</div>
        </div>
      ))}
      <div className="gw-mini-btn" style={{marginTop:"14px"}}>+ Add Attendee</div>
    </div>
  );
  if (step === 2) return (
    <div>
      <div className="gw-how-screen-title"><span />Generated Passes</div>
      <div className="gw-mini-passes">
        {attendees.concat([{init:"MK",name:"Michael K.",type:"General"}]).map((a, i) => (
          <div key={i} className="gw-mini-pass">
            <div className="gw-mini-pass-name">{a.init}</div>
            <div className="gw-mini-pass-id">EVT-{["AX9KD2","BK3MZ9","CL4NA1","DM5OB2"][i]}</div>
            <div className="gw-mini-pass-status"><div className="gw-mini-pass-dot" />Valid</div>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div>
      <div className="gw-how-screen-title"><span />Verify Entry</div>
      <div className="gw-verify-input">
        <span style={{color:"var(--color-text-muted)",fontFamily:"DM Sans",fontSize:"11px"}}>Pass ID</span>
        <span>EVT-AX9KD2-0042</span>
      </div>
      <div className="gw-verify-result">
        <div className="gw-verify-check"><CheckCircle size={18} /></div>
        <div>
          <div className="gw-verify-name">Amara Osei-Bonsu</div>
          <div className="gw-verify-sub">VIP · Seat A-12 · ✅ Valid</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════ MAIN EXPORT ══════════ */
export default function GatewayLanding() {
  const [activeStep, setActiveStep] = useState(0);
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem("gw-theme") === "dark"; } catch { return false; }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const revealRefs = useRef<Element[]>([]);
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggleTheme = () => {
    setIsDark(d => {
      const next = !d;
      try { localStorage.setItem("gw-theme", next ? "dark" : "light"); } catch {}
      return next;
    });
  };

  // Apply theme attribute to <html> so CSS vars cascade from :root correctly
  useEffect(() => {
    document.documentElement.setAttribute("data-gw-theme", isDark ? "dark" : "light");
    return () => { document.documentElement.removeAttribute("data-gw-theme"); };
  }, [isDark]);

  // auto-advance steps
  useEffect(() => {
    stepTimerRef.current = setInterval(() => setActiveStep(s => (s + 1) % 4), 2200);
    return () => { if (stepTimerRef.current) clearInterval(stepTimerRef.current); };
  }, []);

  // intersection observer reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("gw-in"); }),
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
    );
    revealRefs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const ref = (el: Element | null) => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

  const features = [
    { icon: <Calendar size={20}/>, title: "Event setup in 3 minutes", body: "Name your event, set the date, upload a banner, pick your template and brand color. Done." },
    { icon: <Users size={20}/>, title: "Bulk attendee import", body: "Drop in a CSV with hundreds of guests and get all passes generated in one batch with live progress." },
    { icon: <QrCode size={20}/>, title: "Real scannable QR codes", body: "Every pass gets a unique, verifiable QR code. Not a static image — encoded with live attendee data." },
    { icon: <Shield size={20}/>, title: "Instant entry verification", body: "Scan or manually enter a pass ID at the door to confirm validity and mark the guest as checked in." },
    { icon: <Download size={20}/>, title: "PNG & PDF downloads", body: "Guests download their pass as a crisp PNG or print-ready A6 PDF — works on every major browser." },
    { icon: <Sparkles size={20}/>, title: "Three premium templates", body: "Classic, Minimal, or Vibrant. Each with perforated detailing, brand color, and real QR codes." },
  ];

  const steps = [
    { icon: <Calendar size={20}/>, title: "Create your event", desc: "Add event details, upload a banner, choose a pass template and your brand color. Live preview included." },
    { icon: <Users size={20}/>, title: "Add attendees", desc: "Add guests one by one or bulk upload via CSV. Each attendee gets their own pass ID automatically." },
    { icon: <QrCode size={20}/>, title: "Generate passes", desc: "Passes are generated instantly — each with a unique QR code. Download or share a direct link." },
    { icon: <ScanLine size={20}/>, title: "Verify at the door", desc: "Scan QR codes or manually enter pass IDs at entry. Mark guests as checked in in real time." },
  ];

  const stats = [
    { num: "12,000+", label: "Passes generated" },
    { num: "800+",    label: "Events created" },
    { num: "< 5 min", label: "Avg. onboarding time" },
    { num: "3",       label: "Premium templates" },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── Background ── */}
      <div className="gw-bg">
        <div className="gw-orb gw-orb-1" />
        <div className="gw-orb gw-orb-2" />
        <div className="gw-orb gw-orb-3" />
        <div className="gw-diag-lines" />
        {[0,1,2,3,4].map(i => (
          <div key={i} className="gw-streak" style={{
            width: `${280 + i * 100}px`,
            top: `${10 + i * 18}%`,
            '--spd': `${6 + i * 1.4}s`,
            '--del': `${i * 2.1}s`,
          } as React.CSSProperties} />
        ))}
      </div>

      {/* ── Nav ── */}
      {/* Mobile menu panel — slides down behind nav bar */}
      <div className={`gw-mobile-menu${menuOpen ? " open" : ""}`}>
        <div className="gw-mobile-menu-spacer" />
        <ul className="gw-mobile-menu-links">
          <li><a href="#features" onClick={() => setMenuOpen(false)}>Features</a></li>
          <li><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a></li>
          <li><a href="#templates" onClick={() => setMenuOpen(false)}>Templates</a></li>
        </ul>
        <div className="gw-mobile-menu-footer">
          <span className="gw-mobile-menu-label">{isDark ? "Dark mode" : "Light mode"}</span>
          <button className="gw-theme-toggle" onClick={toggleTheme} title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      <nav className="gw-nav">
        <a className="gw-logo" href="#">
          <div className="gw-logo-mark">
            <QrCode size={16} color="#fff" />
          </div>
          Gateway
        </a>
        <ul className="gw-nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How it works</a></li>
          <li><a href="#templates">Templates</a></li>
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="gw-theme-toggle" onClick={toggleTheme} title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            className={`gw-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
          <a href="/sign-up" className="gw-nav-cta">
            Get Started <ArrowUpRight size={14} />
          </a>
        </div>
      </nav>

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section style={{ position: "relative", zIndex: 1 }}>
        {/* cityscape background layer */}
        <div className="gw-cityscape">
          <CityscapeSVG dark={isDark} />
        </div>
        <div className="gw-hero">
          {/* left */}
          <div className="gw-hero-left">
            <div className="gw-bg-letter font-syne">G</div>
            <div className="gw-badge"><Zap size={10} />Free for all events</div>
            <h1 className="gw-headline font-syne">
              Beautiful Event<br />
              Passes. <span className="grad">Generated</span><br />
              in Minutes.
            </h1>
            <p className="gw-sub">
              Create branded QR passes for any event — weddings, conferences, workshops, or private parties.
            </p>
            <div className="gw-hero-ctas">
              <a href="/sign-up" className="btn-primary">Get Started — Free <ArrowRight size={16} /></a>
              <a href="/passes/demo" className="btn-ghost"><QrCode size={16} />See a Demo Pass</a>
            </div>
            <div className="gw-hero-meta">
              {[
                [<CheckCircle size={13}/>, "No credit card"],
                [<Shield size={13}/>, "Data stays local"],
                [<Zap size={13}/>, "Works instantly"],
              ].map(([icon, txt], i) => (
                <div key={i} className="gw-hero-meta-item" style={{ color: "var(--color-success)" }}>
                  {icon}
                  <span style={{ color: "var(--color-text-muted)" }}>{txt as string}</span>
                </div>
              ))}
            </div>
          </div>

          {/* right — floating pass */}
          <div className="gw-hero-right">
            <div className="gw-hero-slash" />
            <div className="gw-pass-scene">
              <div className="gw-pass-aura" />
              {/* main pass carousel */}
              <div className="gw-pass-main" style={{ filter: "drop-shadow(0 32px 72px rgba(232,24,109,0.22))" }}>
                <HeroPassCarousel />
              </div>
            </div>
          </div>
        </div>

        <div className="gw-scroll-hint">
          <div className="gw-scroll-line" />
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ════════════════════════════════
          STATS STRIP
      ════════════════════════════════ */}
      <div className="gw-stats">
        {stats.map((s, i) => (
          <div key={i} className="gw-stat-item gw-reveal" ref={ref} style={{ transitionDelay: `${i * 0.07}s` }}>
            <div className="gw-stat-num font-syne">{s.num}</div>
            <div className="gw-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════
          FEATURES
      ════════════════════════════════ */}
      <section className="gw-section gw-features-bg" id="features">
        <div className="gw-section-inner">
          <div className="gw-reveal" ref={ref}>
            <div className="gw-eyebrow"><Sparkles size={10} />Everything you need</div>
            <h2 className="gw-section-title font-syne">A pass generator that<br />respects your brand.</h2>
            <p className="gw-section-sub">No more ugly generic tickets. Gateway gives independent organizers the tools that used to cost thousands.</p>
          </div>
          <div className="gw-feature-grid">
            {features.map((f, i) => (
              <div key={i} className={`gw-feat-card gw-reveal gw-reveal-d${(i % 3) + 1}`} ref={ref}>
                <div className="gw-feat-icon">{f.icon}</div>
                <div className="gw-feat-title font-syne">{f.title}</div>
                <p className="gw-feat-body">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════ */}
      <section className="gw-section" id="how-it-works" style={{ background: "var(--color-bg)" }}>
        <div className="gw-section-inner">
          <div className="gw-reveal" ref={ref}>
            <div className="gw-eyebrow"><Zap size={10} />The Gateway flow</div>
            <h2 className="gw-section-title font-syne">Four steps. One seamless<br />event experience.</h2>
            <p className="gw-section-sub">From first pass created to verified guest at the door — designed for non-technical organizers.</p>
          </div>

          <div className="gw-how-layout">
            {/* steps list */}
            <div className="gw-steps gw-reveal" ref={ref}>
              {steps.map((s, i) => (
                <div
                  key={i}
                  className={`gw-step ${activeStep === i ? "active-step" : ""}`}
                  onClick={() => {
                    setActiveStep(i);
                    if (stepTimerRef.current) clearInterval(stepTimerRef.current);
                    stepTimerRef.current = setInterval(() => setActiveStep(prev => (prev + 1) % 4), 2200);
                  }}
                >
                  <div className="gw-step-ring">{s.icon}</div>
                  <div className="gw-step-body">
                    <div className="gw-step-num font-mono">0{i + 1}</div>
                    <div className="gw-step-title font-syne">{s.title}</div>
                    <p className="gw-step-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* right — screen mockup */}
            <div className="gw-how-visual gw-reveal gw-reveal-d2" ref={ref}>
              {steps.map((_, i) => (
                <div key={i} className={`gw-how-screen ${activeStep === i ? "active-screen" : ""}`}
                  style={{ display: activeStep === i ? "block" : "none" }}>
                  <HowScreen step={i} />
                </div>
              ))}
              {/* pass card peek below */}
              <div style={{
                opacity: activeStep === 2 ? 1 : 0.4,
                transform: `scale(${activeStep === 2 ? 1 : 0.95})`,
                transition: "all 400ms cubic-bezier(.16,1,.3,1)",
                marginTop: 16,
              }}>
                <PassCard mini />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          TEMPLATES
      ════════════════════════════════ */}
      <section className="gw-section" id="templates" style={{ background: "var(--color-surface)" }}>
        <div className="gw-section-inner">
          <div className="gw-templates-header gw-reveal" ref={ref}>
            <div>
              <div className="gw-eyebrow"><Star size={10} />Three pass styles</div>
              <h2 className="gw-section-title font-syne">Pick the look that<br />fits your event.</h2>
            </div>
            <p className="gw-section-sub" style={{ marginTop: 0, maxWidth: 320 }}>
              Every template ships with perforated detailing, real scannable QR codes, and full brand color customization.
            </p>
          </div>
          <div className="gw-template-grid">
            {[
              { type: "classic", label: "Classic" },
              { type: "minimal", label: "Minimal" },
              { type: "vibrant", label: "Vibrant" },
            ].map((t, i) => (
              <div key={t.type} className={`gw-tpl-wrap gw-reveal gw-reveal-d${i + 1}`} ref={ref}>
                <TemplatePassCard type={t.type} />
                <div className="gw-tpl-label">{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          CTA
      ════════════════════════════════ */}
      <div className="gw-cta-section" style={{ background: "var(--color-bg)" }}>
        <div className="gw-cta-radial" />
        <div className="gw-cta-slash-l" />
        <div className="gw-cta-slash-r" />
        <div className="gw-reveal" ref={ref}>
          <h2 className="gw-cta-title font-syne">
            Your next event deserves<br />
            <span className="gw-cta-grad">passes that impress.</span>
          </h2>
          <p className="gw-cta-sub">
            Join hundreds of organizers creating beautiful, branded QR passes — no design skills needed.
          </p>
          <div className="gw-cta-actions">
            <a href="/sign-up" className="btn-primary">Get Started — Free <ArrowRight size={16} /></a>
            <a href="/passes/demo" className="btn-ghost"><QrCode size={16} />See a Demo Pass</a>
          </div>
          <div className="gw-cta-checks">
            {[
              [<CheckCircle size={13}/>, "No credit card required"],
              [<Shield size={13}/>, "Your data stays private"],
              [<Zap size={13}/>, "Ready in under 5 minutes"],
            ].map(([icon, txt], i) => (
              <div key={i} className="gw-cta-check">
                <span style={{ color: "var(--color-success)" }}>{icon}</span>
                {txt as string}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════
          FOOTER
      ════════════════════════════════ */}
      <footer className="gw-footer">
        <div className="gw-footer-logo">
          <div className="gw-logo-mark" style={{ width: 24, height: 24, borderRadius: 7 }}>
            <QrCode size={12} color="#fff" />
          </div>
          Gateway
        </div>
        <ul className="gw-footer-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How it works</a></li>
          <li><a href="#templates">Templates</a></li>
          <li><a href="#">Privacy</a></li>
        </ul>
        <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
          © {new Date().getFullYear()} Gateway. All rights reserved.
        </div>
      </footer>
    </>
  );
}
