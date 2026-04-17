export function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full h-full flex items-center justify-center"
      style={{
        minHeight: 380,
        maskImage: "radial-gradient(closest-side at 55% 50%, #000 55%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(closest-side at 55% 50%, #000 55%, transparent 100%)",
        opacity: 0.82,
      }}
    >
      <svg
        viewBox="0 0 400 400"
        width="100%"
        height="100%"
        style={{ maxWidth: 500, filter: "drop-shadow(0 0 40px rgb(16 185 129 / .12))" }}
      >
        <defs>
          <radialGradient id="hv-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#10b981" stopOpacity=".22" />
            <stop offset="60%"  stopColor="#10b981" stopOpacity=".02" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hv-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#34d399" stopOpacity=".6" />
            <stop offset="100%" stopColor="#34d399" stopOpacity=".05" />
          </linearGradient>
        </defs>

        {/* soft glow */}
        <circle cx="200" cy="200" r="180" fill="url(#hv-glow)" />

        {/* concentric orbit rings */}
        <g fill="none" stroke="#3f3f46" strokeWidth="1">
          <circle cx="200" cy="200" r="70"  strokeDasharray="2 4" opacity=".55" />
          <circle cx="200" cy="200" r="115" strokeDasharray="2 6" opacity=".45" />
          <circle cx="200" cy="200" r="165" strokeDasharray="2 8" opacity=".35" />
        </g>

        {/* connection lines */}
        <g stroke="url(#hv-line)" strokeWidth="1" fill="none">
          <path d="M200,200 L 90, 90" />
          <path d="M200,200 L 310, 90" />
          <path d="M200,200 L 90,310" />
          <path d="M200,200 L 310,310" />
          <path d="M200,200 L 55,200" />
          <path d="M200,200 L 345,200" />
        </g>

        {/* agents = emerald squares */}
        <rect x="82"  y="82"  width="16" height="16" fill="#10b981" />
        <rect x="302" y="302" width="16" height="16" fill="#10b981" />
        <rect x="47"  y="192" width="16" height="16" fill="#10b981" opacity=".7" />
        <rect x="337" y="192" width="16" height="16" fill="#10b981" opacity=".7" />

        {/* humans = zinc circles with ring */}
        <circle cx="310" cy="90"  r="9" fill="none" stroke="#a1a1aa" strokeWidth="1.5" />
        <circle cx="310" cy="90"  r="3" fill="#a1a1aa" />
        <circle cx="90"  cy="310" r="9" fill="none" stroke="#a1a1aa" strokeWidth="1.5" />
        <circle cx="90"  cy="310" r="3" fill="#a1a1aa" />

        {/* central handoff glyph */}
        <g fontFamily="ui-monospace, monospace" fontSize="48" fontWeight="700" textAnchor="middle">
          <text x="170" y="215" fill="#52525b">{"{"}</text>
          <text x="200" y="215" fill="#34d399">·</text>
          <text x="230" y="215" fill="#52525b">{"}"}</text>
        </g>

        {/* terminal corner crop marks */}
        <g stroke="#3f3f46" strokeWidth="1" fill="none">
          <path d="M20,20 L 40,20 M 20,20 L 20,40" />
          <path d="M380,20 L 360,20 M 380,20 L 380,40" />
          <path d="M20,380 L 40,380 M 20,380 L 20,360" />
          <path d="M380,380 L 360,380 M 380,380 L 380,360" />
        </g>

        {/* tiny mono labels */}
        <g fontFamily="ui-monospace, monospace" fontSize="9" fill="#52525b" letterSpacing="1">
          <text x="20" y="18">HUMAN_NET</text>
          <text x="380" y="18" textAnchor="end">v1.0</text>
        </g>
      </svg>
    </div>
  );
}
