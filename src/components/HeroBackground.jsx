export default function HeroBackground() {
  const trailDots = [
    [53, 193, 0.1], [143, 113, 0.3], [233, 53, 0.5], [323, 113, 0.7], [413, 193, 0.9],
    [563, 113, 1.1], [653, 53, 1.3], [743, 113, 1.5], [893, 113, 1.7], [983, 53, 1.9],
  ];

  return (
    <>
      <div className="court-lines absolute inset-0 opacity-[0.35] pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="blob-yellow absolute -top-24 -left-16 h-96 w-96 rounded-full bg-yellow-300 opacity-30 blur-[100px]" />
        <div className="blob-green absolute bottom-[-6rem] right-[-3rem] h-[28rem] w-[28rem] rounded-full bg-green-400 opacity-20 blur-[110px]" />
      </div>

      <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice">
        <defs>
          <symbol id="pickleball" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="11" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
            <ellipse cx="8.5" cy="8" rx="4.5" ry="3" fill="#fff7c2" opacity="0.5" />
            <circle cx="12" cy="12" r="1.1" fill="#ca8a04" opacity="0.75" />
            <circle cx="8" cy="7.5" r="1" fill="#ca8a04" opacity="0.7" />
            <circle cx="16" cy="7.5" r="1" fill="#ca8a04" opacity="0.7" />
            <circle cx="6" cy="13" r="1" fill="#ca8a04" opacity="0.7" />
            <circle cx="18" cy="13" r="1" fill="#ca8a04" opacity="0.7" />
            <circle cx="9" cy="17.5" r="1" fill="#ca8a04" opacity="0.7" />
            <circle cx="15" cy="17.5" r="1" fill="#ca8a04" opacity="0.7" />
            <circle cx="12" cy="5.5" r="0.9" fill="#ca8a04" opacity="0.65" />
            <circle cx="12" cy="18.5" r="0.9" fill="#ca8a04" opacity="0.65" />
          </symbol>
        </defs>

        {trailDots.map(([x, y, delay], i) => (
          <use
            key={i}
            href="#pickleball"
            className="trail-dot"
            x={x}
            y={y}
            width="14"
            height="14"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}

        <use href="#pickleball" x="-19" y="-19" width="38" height="38">
          <animateMotion
            dur="4.8s"
            repeatCount="indefinite"
            rotate="auto"
            path="M 60,200 Q 150,20 240,60 Q 330,20 420,200 Q 480,340 480,420
                  Q 570,20 660,60 Q 750,20 810,420
                  Q 900,20 990,60 Q 1050,20 1140,200"
          />
        </use>
      </svg>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(254,252,232,0.55) 0%, rgba(254,252,232,0.15) 45%, transparent 70%)",
        }}
      />
    </>
  );
}
