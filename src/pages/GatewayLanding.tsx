import { useState, useEffect, useRef } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import {
  Zap, QrCode, Users, CheckCircle, ArrowRight, Sparkles,
  Calendar, Shield, Download, Star, ChevronDown,
  Clock, MapPin, Ticket, ScanLine, Mail, Globe, ArrowUpRight,
  Sun, Moon, Mic, Heart, Music2, Wrench, Briefcase
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
.dark {
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
  background: rgba(232,24,109,0.04); --dur: 22s;
}
.gw-orb-2 {
  width: 450px; height: 450px; bottom: 20%; left: -140px;
  background: rgba(99,68,212,0.03); --dur: 28s;
  animation-delay: -10s;
}
.gw-orb-3 {
  width: 350px; height: 350px; bottom: -80px; right: 15%;
  background: rgba(232,24,109,0.03); --dur: 24s;
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
  background: linear-gradient(90deg, transparent, rgba(232,24,109,0.05), transparent);
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
.dark .gw-orb-1 { background: rgba(232,24,109,0.30); }
.dark .gw-orb-2 { background: rgba(99,68,212,0.20); }
.dark .gw-orb-3 { background: rgba(232,24,109,0.18); }

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

/* ══════════ HERO V2 — CENTERED ══════════ */
.gw-hero {
  position: relative; z-index: 1;
  min-height: 100vh;
  padding: 200px 24px 80px;
  display: flex; flex-direction: column; align-items: center;
  text-align: center;
}
/* smooth bottom fade into the next section */
.gw-hero::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 120px;
  background: linear-gradient(to bottom, transparent 0%, var(--color-bg) 100%);
  z-index: 3;
  pointer-events: none;
}
.gw-hero-text {
  max-width: 860px; width: 100%;
  display: flex; flex-direction: column; align-items: center;
  position: relative; z-index: 3;
}
.gw-hero-left, .gw-hero-right, .gw-hero-slash, .gw-bg-letter { display: none; }

.gw-badge {
  display: inline-flex; align-items: center; gap: 7px;
  background: var(--color-primary-soft);
  border: 1px solid rgba(232,24,109,0.3);
  border-radius: 50px; padding: 6px 16px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.07em;
  color: var(--color-primary); text-transform: uppercase;
  margin-bottom: 32px;
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

.gw-sub {
  font-size: 19px; font-weight: 400; line-height: 1.65;
  color: var(--color-text-secondary);
  max-width: 580px; margin: 28px auto 0;
  animation: fadeUp 0.5s 0.16s ease both;
}
.gw-hero-ctas {
  display: flex; gap: 14px; flex-wrap: wrap;
  justify-content: center;
  margin-top: 48px;
  animation: fadeUp 0.5s 0.24s ease both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ══════════ SCROLL SHOWCASE ══════════ */
.gw-showcase-track {
  position: relative; z-index: 1;
  height: 270vh;
}
.gw-showcase-track::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 100px;
  background: linear-gradient(to bottom, var(--color-bg) 0%, transparent 100%);
  z-index: 10;
  pointer-events: none;
}
.gw-showcase-sticky {
  position: sticky; top: 0;
  height: 100vh;
  display: flex; align-items: center; padding-top: 0; justify-content: center;
  overflow: hidden;
}
.gw-showcase-inner {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  perspective: 1400px;
  perspective-origin: 50% 40%;
}
/* ── Pass card wrap ── */
.gw-card-wrap {
  filter: drop-shadow(0 32px 64px rgba(0,0,0,0.22)) drop-shadow(0 8px 20px rgba(232,24,109,0.10));
  transform-style: preserve-3d;
}
/* ── (phone CSS removed) ── */
.gw-phone-UNUSED {
  width: 276px; height: 564px;
  border-radius: 46px;
  background: #0e0e16;
  border: 2px solid rgba(255,255,255,0.09);
  box-shadow:
    0 0 0 6px #1a1a26,
    0 0 0 9px rgba(255,255,255,0.04),
    0 60px 120px rgba(0,0,0,0.65),
    0 0 80px rgba(232,24,109,0.14);
  position: relative; overflow: hidden;
  transform-origin: 50% 30%;
  will-change: transform;
}
.gw-phone::after {
  content: '';
  position: absolute; inset: 0; border-radius: 46px;
  background: linear-gradient(140deg, rgba(232,24,109,0.07) 0%, transparent 55%);
  pointer-events: none; z-index: 3;
}
.gw-phone-notch {
  position: absolute; top: 14px; left: 50%;
  transform: translateX(-50%);
  width: 82px; height: 24px;
  background: #0e0e16;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.07);
  z-index: 10;
}
.gw-phone-screen {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  padding: 60px 14px 22px;
  background: var(--color-bg);
  overflow: hidden;
}
/* side buttons */
.gw-phone-btn-r {
  position: absolute; right: -10px; top: 130px;
  width: 4px; height: 60px; border-radius: 2px;
  background: #1c1c28; border: 1px solid rgba(255,255,255,0.05);
}
.gw-phone-btn-l1 {
  position: absolute; left: -10px; top: 110px;
  width: 4px; height: 36px; border-radius: 2px;
  background: #1c1c28; border: 1px solid rgba(255,255,255,0.05);
}
.gw-phone-btn-l2 {
  position: absolute; left: -10px; top: 158px;
  width: 4px; height: 52px; border-radius: 2px;
  background: #1c1c28; border: 1px solid rgba(255,255,255,0.05);
}
/* ── Feature bubbles ── */
.gw-bubble {
  position: absolute;
  background: var(--color-surface);
  border: 1px solid var(--color-border-active);
  border-radius: 40px;
  padding: 9px 15px 9px 10px;
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 500; color: var(--color-text-primary);
  white-space: nowrap;
  box-shadow: 0 8px 28px rgba(0,0,0,0.14), 0 0 0 1px rgba(232,24,109,0.07);
  opacity: 0;
  transform: scale(0.82) translateY(12px);
  transition: opacity 500ms cubic-bezier(.16,1,.3,1), transform 500ms cubic-bezier(.16,1,.3,1);
  pointer-events: none; z-index: 10;
}
.gw-bubble.gw-bubble-visible {
  opacity: 1; transform: scale(1) translateY(0);
}
.gw-bubble-icon {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
/* Bubble positions — base (320px wide card) */
.gw-bubble-0 { left: calc(50% - 320px); top: calc(50% - 115px); }
.gw-bubble-1 { left: calc(50% + 162px); top: calc(50% - 135px); }
.gw-bubble-2 { left: calc(50% - 305px); top: calc(50% + 75px); }
.gw-bubble-3 { left: calc(50% + 152px); top: calc(50% + 95px); }
/* ── Showcase tagline ── */
.gw-showcase-tagline {
  position: relative; z-index: 1;
  text-align: center;
  padding: 80px 24px 120px;
}
.gw-showcase-tagline-text {
  font-family: "Space Grotesk", sans-serif;
  font-size: clamp(28px, 4.5vw, 52px);
  font-weight: 800; line-height: 1.1; letter-spacing: -0.03em;
  max-width: 700px; margin: 0 auto;
}
.gw-showcase-tagline-sub {
  font-size: 18px; color: var(--color-text-secondary);
  max-width: 480px; margin: 20px auto 0; line-height: 1.65;
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
    rgba(232,24,109,0.05) 0%,
    rgba(99,68,212,0.03) 45%,
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

/* ── Desktop: larger pass showcase ── */
@media (min-width: 641px) {
  .pc { width: 390px; }
  .pc-top { height: 162px; }
  .gw-showcase-track { height: 300vh; }
  .gw-bubble-0 { left: calc(50% - 390px); top: calc(50% - 128px); }
  .gw-bubble-1 { left: calc(50% + 198px); top: calc(50% - 148px); }
  .gw-bubble-2 { left: calc(50% - 372px); top: calc(50% + 86px); }
  .gw-bubble-3 { left: calc(50% + 188px); top: calc(50% + 108px); }
}
.pc-top-stripe {
  position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
  background: var(--color-primary);
  box-shadow: 0 0 18px var(--color-primary-glow);
}
.pc-top-glow {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(232,24,109,0.08), transparent);
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

/* ══════════ CTA SECTION — EVENT SHOWCASE ══════════ */
.gw-cta-section {
  position: relative; z-index: 1;
  padding: 120px 72px; overflow: hidden;
  background: #0a0812;
}
/* Cinematic dark background — blurred orbs */
.gw-cta-bg-orb-1 {
  position: absolute; width: 700px; height: 700px;
  border-radius: 50%; pointer-events: none;
  top: -180px; right: -100px;
  background: rgba(123,92,240,0.18);
  filter: blur(120px);
}
.gw-cta-bg-orb-2 {
  position: absolute; width: 500px; height: 500px;
  border-radius: 50%; pointer-events: none;
  bottom: -120px; left: -80px;
  background: rgba(232,24,109,0.12);
  filter: blur(110px);
}
.gw-cta-bg-orb-3 {
  position: absolute; width: 320px; height: 320px;
  border-radius: 50%; pointer-events: none;
  top: 40%; left: 30%;
  background: rgba(99,68,212,0.10);
  filter: blur(90px);
}
.gw-cta-radial {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 55% 60% at 70% 50%, rgba(123,92,240,0.07), transparent),
    radial-gradient(ellipse 40% 40% at 25% 40%, rgba(232,24,109,0.05), transparent);
}
.gw-cta-inner {
  max-width: 1200px; margin: 0 auto;
  display: grid; grid-template-columns: 5fr 6fr;
  gap: 64px; align-items: center;
  position: relative; z-index: 1;
}
.gw-cta-left {}
.gw-cta-title {
  font-family: "Space Grotesk", sans-serif;
  font-size: clamp(36px, 4.2vw, 62px); font-weight: 800;
  line-height: 1.05; letter-spacing: -0.035em;
  margin-bottom: 20px;
  color: #ffffff;
}
.gw-cta-grad {
  background: linear-gradient(120deg, #e8186d 0%, #c4176a 50%, #7b5cf0 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.gw-cta-sub {
  font-size: 16px; color: rgba(255,255,255,0.55);
  line-height: 1.7; max-width: 440px; margin-bottom: 32px;
}
/* ── Event pills — SolCard dark glass style ── */
.gw-event-pills {
  display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 40px;
}
.gw-event-pill {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 18px; border-radius: 50px;
  border: 1px solid rgba(255,255,255,0.13);
  background: rgba(255,255,255,0.07);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.60);
  cursor: pointer;
  transition: all 260ms cubic-bezier(.16,1,.3,1);
  user-select: none;
}
.gw-event-pill:hover {
  border-color: rgba(255,255,255,0.30);
  color: rgba(255,255,255,0.90);
  background: rgba(255,255,255,0.12);
}
.gw-event-pill.active {
  background: rgba(255,255,255,0.92);
  border-color: rgba(255,255,255,0.95);
  color: #0a0812;
  font-weight: 600;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.2), 0 4px 20px rgba(0,0,0,0.35);
}
.gw-cta-actions {
  display: flex; gap: 14px; flex-wrap: wrap;
}
/* Force ghost button to look good on the always-dark CTA background */
.gw-cta-section .btn-ghost {
  color: rgba(255,255,255,0.85);
  border-color: rgba(255,255,255,0.22);
}
.gw-cta-section .btn-ghost:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.45);
  color: #fff;
}
.gw-cta-checks {
  display: flex; align-items: center; gap: 28px;
  margin-top: 24px; flex-wrap: wrap;
}
.gw-cta-check {
  display: flex; align-items: center; gap: 6px;
  font-size: 12px; color: rgba(255,255,255,0.38);
}
/* Right — event card with SolCard-style glow border */
.gw-cta-right {
  display: flex; align-items: center; justify-content: flex-end;
}
/* Outer glow wrapper */
.gw-event-card-wrap {
  position: relative; border-radius: 26px;
  padding: 3px;
  width: 100%; max-width: 520px;
  background: linear-gradient(135deg, rgba(123,92,240,0.80) 0%, rgba(232,24,109,0.55) 55%, rgba(123,92,240,0.40) 100%);
  box-shadow:
    0 0 40px rgba(123,92,240,0.40),
    0 0 80px rgba(123,92,240,0.18),
    0 24px 60px rgba(0,0,0,0.60);
  transition: box-shadow 400ms ease;
}
.gw-event-card-wrap:hover {
  box-shadow:
    0 0 60px rgba(123,92,240,0.55),
    0 0 110px rgba(123,92,240,0.25),
    0 28px 70px rgba(0,0,0,0.65);
}
.gw-event-card {
  width: 100%; border-radius: 24px;
  overflow: hidden;
  transition: opacity 220ms ease, transform 220ms ease;
}
.gw-event-card.switching {
  opacity: 0; transform: scale(0.97) translateY(8px);
}
/* Single full-height visual area — fixed size so cards never shift */
.gw-ec-area {
  height: 380px; position: relative; overflow: hidden;
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 22px;
}
/* Cross-fade photo layers */
.gw-ec-photo {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover; object-position: center;
  opacity: 0;
  transition: opacity 700ms cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}
.gw-ec-photo.active {
  opacity: 1;
}
/* Dark gradient overlay so text stays readable over any photo */
.gw-ec-photo-overlay {
  position: absolute; inset: 0; pointer-events: none; z-index: 1;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.52) 0%,
    rgba(0,0,0,0.18) 40%,
    rgba(0,0,0,0.62) 100%
  );
}
.gw-ec-header-glow {
  position: absolute; inset: 0; pointer-events: none; z-index: 2;
}
.gw-ec-grid {
  position: absolute; inset: 0; z-index: 3;
  background-image:
    linear-gradient(rgba(255,255,255,0.032) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.032) 1px, transparent 1px);
  background-size: 28px 28px;
}
.gw-ec-blob {
  position: absolute; border-radius: 50%;
  filter: blur(60px); pointer-events: none;
  width: 220px; height: 220px;
  top: 5%; right: -30px; opacity: 0.22;
  z-index: 3;
  transition: background 300ms ease;
}
.gw-ec-blob-2 {
  position: absolute; border-radius: 50%;
  filter: blur(80px); pointer-events: none;
  width: 160px; height: 160px;
  bottom: 10%; left: -20px; opacity: 0.14;
  z-index: 3;
  transition: background 300ms ease;
}
.gw-ec-topbar {
  position: relative; z-index: 4;
  display: flex; align-items: center; justify-content: space-between;
}
.gw-ec-logo-row {
  display: flex; align-items: center; gap: 8px;
  font-family: "Space Grotesk", sans-serif; font-weight: 800;
  font-size: 15px; color: #fff;
}
.gw-ec-tag {
  display: inline-flex; align-items: center; gap: 5px;
  border-radius: 50px; padding: 5px 13px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
  text-transform: uppercase;
  border-width: 1px; border-style: solid;
  transition: color 300ms ease, border-color 300ms ease, background 300ms ease;
}
/* Middle content */
.gw-ec-content {
  position: relative; z-index: 4; flex: 1;
  display: flex; flex-direction: column; justify-content: flex-end;
  padding-bottom: 18px;
}
.gw-ec-name {
  font-family: "Space Grotesk", sans-serif;
  font-size: 24px; font-weight: 800; letter-spacing: -0.02em;
  color: #fff; margin-bottom: 8px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.gw-ec-meta {
  display: flex; gap: 18px; flex-wrap: wrap;
}
.gw-ec-meta span {
  display: flex; align-items: center; gap: 4px;
  font-size: 12px; color: rgba(255,255,255,0.45);
}
/* Bottom pill bar — SolCard "Supermarket 89.32 USD" style */
.gw-ec-bar {
  position: relative; z-index: 2;
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 50px; padding: 12px 12px 12px 22px;
  border: 1px solid rgba(255,255,255,0.09);
  gap: 16px;
}
.gw-ec-bar-seat {
  font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.80);
  display: flex; align-items: center; gap: 10px;
  flex: 1; min-width: 0;
}
.gw-ec-bar-badge {
  display: inline-flex; align-items: center; gap: 7px;
  border-radius: 50px; padding: 9px 20px;
  font-size: 13px; font-weight: 600;
  border-width: 1px; border-style: solid;
  transition: color 300ms ease, border-color 300ms ease, background 300ms ease;
  white-space: nowrap; flex-shrink: 0;
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
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
  height: 62%;
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
  .gw-nav-cta { padding: 10px 18px; font-size: 13px; }

  .gw-hero { grid-template-columns: 1fr; padding: 120px 24px 20px; text-align: center; }
  .gw-hero-left { align-items: center; }
  .gw-hero-right { margin-top: 48px; }
  .gw-hero-slash { display: none; }
  .gw-bg-letter { display: none; }
  .gw-sub { max-width: 100%; }

  .gw-how-layout { grid-template-columns: 1fr; gap: 48px; }
  .gw-how-visual { position: static; }

  .gw-template-grid { grid-template-columns: 1fr 1fr; }

  .gw-section { padding: 100px 40px; }
  .gw-cta-section { padding: 100px 40px; }
  .gw-footer { padding: 40px 40px; }
}

/* ══════════ RESPONSIVE — MOBILE ══════════ */
@media (max-width: 640px) {
  /* Nav — hamburger layout */
  .gw-nav { padding: 12px 16px; gap: 0; }
  .gw-nav-links { display: none; }
  .gw-nav-cta { display: none; }
  .gw-logo { font-size: 17px; flex: 1; }
  .gw-nav .gw-theme-toggle { display: none; }
  .gw-hamburger { display: flex; }
  .gw-mobile-menu { display: flex; }

  /* Hero */
  .gw-hero { padding: 90px 20px 16px; min-height: auto; }
  .gw-badge { margin-bottom: 20px; font-size: 10px; }
  .gw-headline { font-size: clamp(34px, 9vw, 52px); }
  .gw-sub { font-size: 16px; max-width: 100%; margin-top: 18px; }
  .gw-hero-ctas { flex-direction: column; width: 100%; margin-top: 32px; gap: 10px; }
  .btn-primary { width: 100%; justify-content: center; padding: 14px 24px; font-size: 14px; }
  .btn-ghost { width: 100%; justify-content: center; padding: 13px 24px; font-size: 14px; }
  .gw-scroll-hint { left: 50%; transform: translateX(-50%); }

  /* Showcase — mobile */
  .gw-showcase-track { height: 300vh; }
  .gw-showcase-sticky { height: 100svh; padding-top: 8svh; }
  /* full-width inner so right:4px bubbles pin to viewport edge */
  .gw-showcase-inner { width: 100%; height: 100%; }
  /* Pass card — mobile: scale down slightly so bubbles have room */
  .gw-card-wrap { zoom: 0.88; }
  /* Bubbles pin to viewport edges */
  .gw-bubble { font-size: 11px; padding: 7px 11px 7px 8px; gap: 6px; white-space: nowrap; }
  .gw-bubble-icon { width: 22px; height: 22px; }
  .gw-bubble-0 { left: 4px;  top: calc(50% - 205px); }
  .gw-bubble-1 { left: auto; right: 4px; top: calc(50% - 222px); }
  .gw-bubble-2 { left: 4px;  top: calc(50% + 168px); }
  .gw-bubble-3 { left: auto; right: 4px; top: calc(50% + 152px); }
  .gw-showcase-tagline { padding: 48px 20px 80px; }
  .gw-showcase-tagline-sub { font-size: 15px; }

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
  .gw-cta-sub { font-size: 15px; max-width: 100%; }
  .gw-cta-checks { gap: 16px; }
  .gw-event-card { width: 100%; max-width: 100%; }
  .gw-cta-right { justify-content: flex-start; }

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
  const bFar  = dark ? "#0a0a0f" : "#E6E5F2";
  const bMid  = dark ? "#0D0D12" : "#DDDCEC";
  const bTall = dark ? "#0D0D12" : "#D4D2E6";
  const bSpire= dark ? "#0D0D12" : "#CCCADF";
  const bAnt  = dark ? "#0D0D12" : "#C4C2D8";
  const bFore = dark ? "#0D0D12" : "#DDDBE8";
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
          <stop offset="70%" stopColor={dark ? "#0D0D12" : "#F8F8FC"} stopOpacity="0.25" />
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
  const [activeEvent, setActiveEvent] = useState(0);
  const [eventSwitching, setEventSwitching] = useState(false);
  const pillsHoveredRef = useRef(false);
  const eventAutoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth <= 640);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const revealRefs = useRef<Element[]>([]);
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // auto-advance steps
  useEffect(() => {
    stepTimerRef.current = setInterval(() => setActiveStep(s => (s + 1) % 4), 2200);
    return () => { if (stepTimerRef.current) clearInterval(stepTimerRef.current); };
  }, []);

  // auto-rotate event pills (pause on hover)
  useEffect(() => {
    const NUM_EVENTS = 6;
    eventAutoRef.current = setInterval(() => {
      if (pillsHoveredRef.current) return;
      setActiveEvent(prev => {
        const next = (prev + 1) % NUM_EVENTS;
        setEventSwitching(true);
        setTimeout(() => setEventSwitching(false), 220);
        return next;
      });
    }, 2800);
    return () => { if (eventAutoRef.current) clearInterval(eventAutoRef.current); };
  }, []);

  // scroll progress for showcase + isMobile resize
  useEffect(() => {
    const onScroll = () => {
      if (!showcaseRef.current) return;
      const rect = showcaseRef.current.getBoundingClientRect();
      const trackH = showcaseRef.current.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.min(1, Math.max(0, scrolled / (trackH || 1)));
      setScrollProgress(p);
    };
    const onResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
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
          HERO — CENTERED
      ════════════════════════════════ */}
      <section style={{ position: "relative", zIndex: 1 }}>
        <div className="gw-hero">
          {isDark && <div className="gw-cityscape"><CityscapeSVG dark={isDark} /></div>}
          <div className="gw-hero-text">
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
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          SCROLL SHOWCASE — Phone mockup
      ════════════════════════════════ */}
      {(() => {
        // phone tilt: first 55% of scroll = tilt → flat; less dramatic on mobile
        const tilt  = Math.max(0, 1 - scrollProgress / 0.55);
        const rotX  = (isMobile ? 16 : 32) * tilt;
        const rotZ  = (isMobile ? -3 : -6) * tilt;
        const sc    = (isMobile ? 0.88 : 0.76) + (isMobile ? 0.12 : 0.24) * (1 - tilt);
        const ty    = (isMobile ? -14 : -28) * tilt;
        const phoneStyle: React.CSSProperties = {
          transform: `rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${sc}) translateY(${ty}px)`,
          transition: "transform 60ms linear",
        };
        const bubbles = [
          { icon: <QrCode size={14}/>,      label: "QR verified entry",  threshold: 0.42, x: -230, y: -90,  delay: 0   },
          { icon: <Zap size={14}/>,         label: "Instant delivery",   threshold: 0.52, x:  185, y: -110, delay: 80  },
          { icon: <Star size={14}/>,        label: "Custom branding",    threshold: 0.64, x: -215, y:  80,  delay: 160 },
          { icon: <Shield size={14}/>,      label: "Any event type",     threshold: 0.74, x:  175, y:  100, delay: 240 },
        ];
        return (
          <>
            <div className="gw-showcase-track" ref={showcaseRef}>
              <div className="gw-showcase-sticky">
                <div className="gw-showcase-inner">
                  {/* Pass card */}
                  <div className="gw-card-wrap" style={phoneStyle}>
                    <HeroPassCarousel />
                  </div>
                  {/* Feature bubbles */}
                  {bubbles.map((b, i) => (
                    <div
                      key={i}
                      className={`gw-bubble gw-bubble-${i}${scrollProgress >= b.threshold ? " gw-bubble-visible" : ""}`}
                      style={{
                        transitionDelay: scrollProgress >= b.threshold ? `${b.delay}ms` : "0ms",
                      }}
                    >
                      <div className="gw-bubble-icon">{b.icon}</div>
                      {b.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tagline below showcase */}
            <div className="gw-showcase-tagline gw-reveal" ref={ref}>
              <p className="gw-showcase-tagline-text font-syne">
                Gateway makes your passes<br />
                <span style={{ color: "var(--color-primary)" }}>professional in minutes.</span>
              </p>
              <p className="gw-showcase-tagline-sub">
                Every pass is scan-ready, beautifully branded, and delivered instantly to your guests.
              </p>
            </div>
          </>
        );
      })()}

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
          CTA — EVENT SHOWCASE
      ════════════════════════════════ */}
      {(() => {
        const eventTypes = [
          { icon: <Mic size={13}/>, label: "Conference", color: "#E8186D", accent: "#7B5CF0",
            bg: "linear-gradient(135deg, #1a0a12 0%, #2d0d20 60%, #160a1f 100%)",
            photo: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=75",
            tag: "CONFERENCE", eventName: "Tech Summit '26",
            location: "Convention Centre", date: "14 Mar 2026",
            seat: "Hall B · Row 3", entry: "09:00 · General Entry" },
          { icon: <Heart size={13}/>, label: "Wedding", color: "#F59E0B", accent: "#EC4899",
            bg: "linear-gradient(135deg, #1a1205 0%, #2a1a06 60%, #1a0a14 100%)",
            photo: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=75",
            tag: "WEDDING", eventName: "Smith & Davies",
            location: "Grand Pavilion", date: "21 Jun 2026",
            seat: "Table 7 · Seat 2", entry: "16:00 · Ceremony" },
          { icon: <Music2 size={13}/>, label: "Festival", color: "#8B5CF6", accent: "#3B82F6",
            bg: "linear-gradient(135deg, #0d0a1f 0%, #150d2e 60%, #0a0f1f 100%)",
            photo: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=75",
            tag: "FESTIVAL", eventName: "Neon Beats '26",
            location: "Lakeside Arena", date: "5 Aug 2026",
            seat: "GA · Zone A", entry: "12:00 · All Day" },
          { icon: <Wrench size={13}/>, label: "Workshop", color: "#10B981", accent: "#6366F1",
            bg: "linear-gradient(135deg, #051a12 0%, #0a2a1a 60%, #080f1a 100%)",
            photo: "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?auto=format&fit=crop&w=800&q=75",
            tag: "WORKSHOP", eventName: "Design Sprint",
            location: "Studio Hub · 4F", date: "3 Apr 2026",
            seat: "Seat 12", entry: "10:00 · Full Day" },
          { icon: <Briefcase size={13}/>, label: "Corporate", color: "#3B82F6", accent: "#6366F1",
            bg: "linear-gradient(135deg, #050d1a 0%, #0a152e 60%, #08091f 100%)",
            photo: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=75",
            tag: "CORPORATE", eventName: "Annual Summit",
            location: "HQ Tower · 22F", date: "18 Nov 2026",
            seat: "Boardroom A", entry: "08:30 · Staff Only" },
          { icon: <Sparkles size={13}/>, label: "Party", color: "#F43F5E", accent: "#FB923C",
            bg: "linear-gradient(135deg, #1a050c 0%, #2a0a10 60%, #1a0a05 100%)",
            photo: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=75",
            tag: "PARTY", eventName: "Year-End Bash",
            location: "Rooftop Lounge", date: "31 Dec 2026",
            seat: "Open · VIP", entry: "20:00 · Open Bar" },
        ];
        const ev = eventTypes[activeEvent];
        const switchEvent = (idx: number) => {
          if (idx === activeEvent) return;
          setEventSwitching(true);
          setTimeout(() => { setActiveEvent(idx); setEventSwitching(false); }, 200);
        };
        return (
          <div className="gw-cta-section">
            <div className="gw-cta-bg-orb-1" />
            <div className="gw-cta-bg-orb-2" />
            <div className="gw-cta-bg-orb-3" />
            <div className="gw-cta-radial" />
            <div className="gw-cta-inner gw-reveal" ref={ref}>
              {/* Left */}
              <div className="gw-cta-left">
                <h2 className="gw-cta-title font-syne">
                  Gateway: for<br />
                  <span className="gw-cta-grad">every event.</span>
                </h2>
                <p className="gw-cta-sub">
                  Whether it's a global conference or a backyard party — generate beautiful, scan-ready QR passes in minutes. No design skills needed.
                </p>
                <div
                  className="gw-event-pills"
                  onMouseEnter={() => { pillsHoveredRef.current = true; }}
                  onMouseLeave={() => { pillsHoveredRef.current = false; }}
                >
                  {eventTypes.map((et, i) => (
                    <button
                      key={i}
                      className={`gw-event-pill${activeEvent === i ? " active" : ""}`}
                      onClick={() => switchEvent(i)}
                    >
                      {et.icon}
                      {et.label}
                    </button>
                  ))}
                </div>
                <div className="gw-cta-actions">
                  <a href="/sign-up" className="btn-primary">Get Started — Free <ArrowRight size={16} /></a>
                  <a href="/passes/demo" className="btn-ghost"><QrCode size={16} />See a Demo Pass</a>
                </div>
              </div>
              {/* Right — animated event card with SolCard glow border */}
              <div className="gw-cta-right">
                <div
                  className="gw-event-card-wrap"
                  style={{
                    background: `linear-gradient(135deg, ${ev.color}99 0%, ${ev.accent}77 55%, ${ev.color}55 100%)`,
                    boxShadow: `0 0 40px ${ev.color}55, 0 0 80px ${ev.color}22, 0 24px 60px rgba(0,0,0,0.65)`,
                  }}
                >
                <div
                  className={`gw-event-card${eventSwitching ? " switching" : ""}`}
                >
                  <div className="gw-ec-area" style={{ background: ev.bg }}>
                    {/* All photos stacked — cross-fade by toggling .active */}
                    {eventTypes.map((et, i) => (
                      <img
                        key={i}
                        src={et.photo}
                        alt=""
                        className={`gw-ec-photo${activeEvent === i ? " active" : ""}`}
                      />
                    ))}
                    {/* Readability overlay */}
                    <div className="gw-ec-photo-overlay" />
                    {/* Depth blobs */}
                    <div className="gw-ec-blob" style={{ background: ev.color }} />
                    <div className="gw-ec-blob-2" style={{ background: ev.accent }} />
                    {/* Grid overlay */}
                    <div className="gw-ec-header-glow"
                      style={{ background: `radial-gradient(ellipse 90% 70% at 15% 60%, ${ev.color}22, transparent 65%)` }}
                    />
                    <div className="gw-ec-grid" />
                    {/* Top bar — logo + tag */}
                    <div className="gw-ec-topbar">
                      <div className="gw-ec-logo-row">
                        <div className="gw-logo-mark" style={{ width: 28, height: 28, borderRadius: 9 }}>
                          <QrCode size={14} color="#fff" />
                        </div>
                        Gateway
                      </div>
                      <div className="gw-ec-tag" style={{ color: ev.color, borderColor: `${ev.color}45`, background: `${ev.color}1a` }}>
                        {ev.icon}{ev.tag}
                      </div>
                    </div>
                    {/* Middle — event info */}
                    <div className="gw-ec-content">
                      <h3 className="gw-ec-name font-syne">{ev.eventName}</h3>
                      <div className="gw-ec-meta">
                        <span><MapPin size={11} />{ev.location}</span>
                        <span><Calendar size={11} />{ev.date}</span>
                      </div>
                    </div>
                    {/* Bottom bar — like "Booking 148.59 USD" */}
                    <div className="gw-ec-bar">
                      <div className="gw-ec-bar-seat">
                        <QrCode size={14} color="rgba(255,255,255,0.45)" />
                        {ev.seat}
                      </div>
                      <div className="gw-ec-bar-badge" style={{ color: ev.color, borderColor: `${ev.color}40`, background: `${ev.color}1a` }}>
                        <Clock size={11} />{ev.entry}
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

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
