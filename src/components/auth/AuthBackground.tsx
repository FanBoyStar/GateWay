export function AuthBackground() {
  return (
    <div className="auth-bg-root">
      {/* Orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      {/* Diagonal grid lines */}
      <div className="auth-diag-lines" />

      {/* Kinetic streaks */}
      <div className="auth-streak" style={{ top: '18%', width: '55vw', '--spd': '9s', '--del': '0s' } as React.CSSProperties} />
      <div className="auth-streak" style={{ top: '42%', width: '40vw', '--spd': '13s', '--del': '-4s' } as React.CSSProperties} />
      <div className="auth-streak" style={{ top: '67%', width: '60vw', '--spd': '8s', '--del': '-7s' } as React.CSSProperties} />

      {/* Cityscape */}
      <div className="auth-cityscape">
        <svg
          viewBox="0 0 1440 420"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax meet"
        >
          <defs>
            <linearGradient id="authSkyFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0D0D12" stopOpacity="0" />
              <stop offset="50%" stopColor="#0D0D12" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0D0D12" stopOpacity="1" />
            </linearGradient>
            <filter id="authWinGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="authTowerGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Far background layer */}
          <rect x="0"   y="280" width="90"  height="140" fill="#0a0a0f" />
          <rect x="85"  y="300" width="60"  height="120" fill="#0a0a0f" />
          <rect x="140" y="260" width="80"  height="160" fill="#0a0a0f" />
          <rect x="215" y="295" width="50"  height="125" fill="#0a0a0f" />
          <rect x="260" y="270" width="70"  height="150" fill="#0a0a0f" />
          <rect x="1100" y="290" width="80"  height="130" fill="#0a0a0f" />
          <rect x="1175" y="265" width="65"  height="155" fill="#0a0a0f" />
          <rect x="1235" y="285" width="90"  height="135" fill="#0a0a0f" />
          <rect x="1320" y="270" width="60"  height="150" fill="#0a0a0f" />
          <rect x="1375" y="295" width="65"  height="125" fill="#0a0a0f" />

          {/* Mid layer */}
          <rect x="0"   y="220" width="100" height="200" fill="#0D0D12" />
          <rect x="95"  y="240" width="75"  height="180" fill="#0D0D12" />
          <rect x="165" y="200" width="55"  height="220" fill="#0D0D12" />
          <rect x="215" y="230" width="85"  height="190" fill="#0D0D12" />
          <rect x="295" y="210" width="65"  height="210" fill="#0D0D12" />
          <rect x="355" y="250" width="90"  height="170" fill="#0D0D12" />
          <rect x="440" y="230" width="55"  height="190" fill="#0D0D12" />
          <rect x="490" y="260" width="70"  height="160" fill="#0D0D12" />

          {/* Center cluster */}
          <rect x="555" y="150" width="80"  height="270" fill="#0D0D12" />
          <rect x="630" y="130" width="60"  height="290" fill="#0D0D12" />
          {/* Central spire */}
          <rect x="685" y="60"  width="30"  height="360" fill="#0D0D12" />
          <polygon points="700,30 685,80 715,80" fill="#0D0D12" />
          <rect x="698" y="10"  width="4"   height="50"  fill="#0D0D12" />
          <rect x="680" y="120" width="40"  height="18"  fill="#0D0D12" />
          <rect x="676" y="138" width="48"  height="8"   fill="#0D0D12" />

          <rect x="710" y="140" width="70"  height="280" fill="#0D0D12" />
          <rect x="775" y="160" width="55"  height="260" fill="#0D0D12" />
          <rect x="825" y="120" width="45"  height="300" fill="#0D0D12" />
          <rect x="865" y="80"  width="35"  height="340" fill="#0D0D12" />
          <polygon points="882,55 865,90 900,90" fill="#0D0D12" />
          <rect x="895" y="170" width="65"  height="250" fill="#0D0D12" />

          {/* Right cluster */}
          <rect x="955"  y="200" width="90"  height="220" fill="#0D0D12" />
          <rect x="1040" y="220" width="70"  height="200" fill="#0D0D12" />
          <rect x="1105" y="190" width="80"  height="230" fill="#0D0D12" />
          <rect x="1180" y="215" width="60"  height="205" fill="#0D0D12" />
          <rect x="1235" y="230" width="95"  height="190" fill="#0D0D12" />
          <rect x="1325" y="210" width="65"  height="210" fill="#0D0D12" />
          <rect x="1385" y="240" width="55"  height="180" fill="#0D0D12" />

          {/* Foreground base */}
          <rect x="0"    y="300" width="130" height="120" fill="#0D0D12" />
          <rect x="125"  y="320" width="100" height="100" fill="#0D0D12" />
          <rect x="1220" y="310" width="110" height="110" fill="#0D0D12" />
          <rect x="1325" y="295" width="115" height="125" fill="#0D0D12" />
          <rect x="0"    y="400" width="1440" height="20" fill="#0D0D12" />

          {/* Windows — left cluster */}
          {[20,40,60,80,100,120,140,160,180,200].map((y, i) =>
            [10,28,46,64].map((x, j) => (
              <rect key={`wl${i}-${j}`} x={x} y={y+225} width="8" height="5"
                fill="var(--neon-primary)" opacity={((i+j)%3===0)?0.9:0.4}
                filter="url(#authWinGlow)" />
            ))
          )}
          {[0,15,30,45,60,75,90].map((y, i) =>
            [170,185,200].map((x, j) => (
              <rect key={`wml${i}-${j}`} x={x} y={y+205} width="7" height="5"
                fill="var(--neon-primary)" opacity={((i*j+i)%4===0)?1:0.35}
                filter="url(#authWinGlow)" />
            ))
          )}
          {/* Center tower windows */}
          {[0,20,40,60,80,100,120,140,160,180,200,220].map((y, i) =>
            [560,575,590,605,620].map((x, j) => (
              <rect key={`wc${i}-${j}`} x={x} y={y+155} width="7" height="6"
                fill="var(--neon-primary)" opacity={((i+j)%3===0)?0.85:0.3}
                filter="url(#authWinGlow)" />
            ))
          )}
          {[0,18,36,54,72,90,108,126,144,162,180,200,220,240].map((y, i) =>
            [630,642,654].map((x, j) => (
              <rect key={`ws${i}-${j}`} x={x} y={y+135} width="6" height="5"
                fill="var(--neon-primary)" opacity={((i+j)%2===0)?0.9:0.2}
                filter="url(#authWinGlow)" />
            ))
          )}
          {/* Antenna tip + observation deck */}
          <circle cx="700" cy="12" r="4" fill="var(--neon-primary)" filter="url(#authTowerGlow)" opacity="0.95" />
          {[681,686,691,696,702,707,712,717].map((x,i) => (
            <rect key={`obs${i}`} x={x} y="122" width="4" height="4"
              fill="var(--neon-primary)" opacity={i%2===0?1:0.5} filter="url(#authWinGlow)" />
          ))}
          {/* Right skyscraper windows */}
          {[0,16,32,48,64,80,96,112,128,144,160,180,200,220,240,260].map((y, i) =>
            [866,876,886].map((x, j) => (
              <rect key={`wsk${i}-${j}`} x={x} y={y+85} width="5" height="5"
                fill="var(--neon-primary)" opacity={((i*2+j)%3===0)?0.9:0.25}
                filter="url(#authWinGlow)" />
            ))
          )}
          {/* Right cluster windows */}
          {[0,14,28,42,56,70,84,98,112,126,140,160,180].map((y, i) =>
            [960,975,990,1005,1020,1035].map((x, j) => (
              <rect key={`wr${i}-${j}`} x={x} y={y+205} width="7" height="5"
                fill="var(--neon-primary)" opacity={((i+j*2)%4===0)?0.9:0.3}
                filter="url(#authWinGlow)" />
            ))
          )}
          {[0,14,28,42,56,70,84,98,112,126,140].map((y, i) =>
            [1110,1125,1140,1155,1170].map((x, j) => (
              <rect key={`wr2${i}-${j}`} x={x} y={y+195} width="7" height="5"
                fill="var(--neon-primary)" opacity={((i+j)%3===0)?0.85:0.28}
                filter="url(#authWinGlow)" />
            ))
          )}

          {/* Ground glow + sky fade overlay */}
          <rect x="0" y="390" width="1440" height="30" fill="var(--neon-primary)" opacity="0.04" />
          <rect x="0" y="0" width="1440" height="420" fill="url(#authSkyFade)" />
        </svg>
      </div>

      <style>{`
        .auth-bg-root {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          background: #0D0D12;
        }
        .auth-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          animation: authOrbFloat 22s ease-in-out infinite alternate;
        }
        .auth-orb-1 {
          width: 600px; height: 600px;
          top: -200px; right: -120px;
          background: rgba(232,24,109,0.08);
          animation-duration: 22s;
        }
        .auth-orb-2 {
          width: 480px; height: 480px;
          bottom: 10%; left: -150px;
          background: rgba(123,92,240,0.07);
          animation-duration: 28s;
          animation-delay: -10s;
        }
        .auth-orb-3 {
          width: 340px; height: 340px;
          bottom: -80px; right: 20%;
          background: rgba(232,24,109,0.05);
          animation-duration: 24s;
          animation-delay: -5s;
        }
        @keyframes authOrbFloat {
          0%   { transform: translate(0,0) scale(1); }
          40%  { transform: translate(40px,-60px) scale(1.06); }
          70%  { transform: translate(-28px,38px) scale(0.96); }
          100% { transform: translate(16px,-14px) scale(1.02); }
        }
        .auth-diag-lines {
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            -32deg,
            transparent,
            transparent 140px,
            rgba(232,24,109,0.010) 140px,
            rgba(232,24,109,0.010) 141px
          );
        }
        .auth-streak {
          position: absolute;
          height: 1px;
          pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(232,24,109,0.06), transparent);
          animation: authStreak var(--spd, 9s) linear infinite;
          animation-delay: var(--del, 0s);
        }
        @keyframes authStreak {
          0%   { transform: translateX(-120vw) skewX(-18deg); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 0.4; }
          100% { transform: translateX(200vw) skewX(-18deg); opacity: 0; }
        }
        .auth-cityscape {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 48%;
          pointer-events: none;
          overflow: hidden;
        }
        .auth-cityscape svg {
          width: 100%; height: 100%;
          display: block;
        }
      `}</style>
    </div>
  );
}
