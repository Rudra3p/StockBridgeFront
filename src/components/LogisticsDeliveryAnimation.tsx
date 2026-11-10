'use client';

import { useState, useEffect } from 'react';

export default function LogisticsDeliveryAnimation() {
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);
  const [isManual, setIsManual] = useState(false);

  // Seamless auto-advance across the 4 stages of B2B delivery
  useEffect(() => {
    if (isManual) return;

    const durations: Record<number, number> = {
      1: 3600, // Phase 1: Surplus Lot Packing & Sealed Inspection (3.6s)
      2: 3800, // Phase 2: Godown Shutter Roll-up & Truck Dispatch (3.8s)
      3: 4600, // Phase 3: High-Speed Parallax Highway Transit (4.6s)
      4: 3800, // Phase 4: Retailer Arrival, Hydraulic Stop & Settled (3.8s)
    };

    const timer = setTimeout(() => {
      setPhase((prev) => (prev === 4 ? 1 : ((prev + 1) as 1 | 2 | 3 | 4)));
    }, durations[phase]);

    return () => clearTimeout(timer);
  }, [phase, isManual]);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* ======================================================== */}
      {/* SQUARE FRAME: BORDERLESS, OVERFLOW-HIDDEN, CENTERED     */}
      {/* ======================================================== */}
      <div className="relative w-full max-w-[390px] aspect-square rounded-2xl overflow-hidden bg-[#FBFBFA] flex items-center justify-center select-none shadow-xs border-0 outline-none">
        
        {/* Scoped CSS animations for 100% bug-free rendering (No SMIL leaks or flying elements) */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spinWheel {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .wheel-rot {
            transform-box: fill-box;
            transform-origin: center;
            animation: spinWheel 0.45s linear infinite;
          }
          .wheel-rot-fast {
            transform-box: fill-box;
            transform-origin: center;
            animation: spinWheel 0.35s linear infinite;
          }
          @keyframes roadDash {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: 44; }
          }
          .road-moving {
            animation: roadDash 0.4s linear infinite;
          }
          @keyframes treeScroll1 {
            0% { transform: translateX(430px); }
            100% { transform: translateX(-60px); }
          }
          .tree-fast {
            animation: treeScroll1 2.2s linear infinite;
          }
          @keyframes treeScroll2 {
            0% { transform: translateX(450px); }
            100% { transform: translateX(-80px); }
          }
          .tree-slow {
            animation: treeScroll2 3.4s linear infinite -1.4s;
          }
          @keyframes milestoneScroll {
            0% { transform: translateX(430px); }
            100% { transform: translateX(-50px); }
          }
          .milestone-fast {
            animation: milestoneScroll 1.8s linear infinite -0.6s;
          }
          @keyframes cloudScroll {
            0% { transform: translateX(440px); }
            100% { transform: translateX(-120px); }
          }
          .cloud-drift {
            animation: cloudScroll 7s linear infinite;
          }
          @keyframes truckIdleBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          .truck-engine {
            animation: truckIdleBounce 0.28s ease-in-out infinite;
          }
          @keyframes shutterSlideUp {
            0%, 12% { transform: translateY(0); }
            40%, 100% { transform: translateY(-112px); }
          }
          .shutter-slider {
            animation: shutterSlideUp 3.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          @keyframes dispatchTruckExit {
            0%, 30% { transform: translateX(-30px); }
            100% { transform: translateX(290px); }
          }
          .dispatch-truck {
            animation: dispatchTruckExit 3.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }
          @keyframes arrivalTruckStop {
            0% { transform: translateX(-240px); }
            70% { transform: translateX(2px); }
            85% { transform: translateX(-4px); }
            100% { transform: translateX(0px); }
          }
          .arrival-truck {
            animation: arrivalTruckStop 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes popCheckBadge {
            0% { transform: scale(0); opacity: 0; }
            65% { transform: scale(1.22); opacity: 1; }
            85% { transform: scale(0.94); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .pop-badge {
            transform-box: fill-box;
            transform-origin: center;
            animation: popCheckBadge 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
          @keyframes boxDropIn {
            0% { transform: translateY(-60px); opacity: 0; }
            35% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .box-drop {
            animation: boxDropIn 3.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
          @keyframes flapLeftFold {
            0%, 20% { transform: rotate(-75deg); }
            45%, 100% { transform: rotate(0deg); }
          }
          .flap-left {
            transform-box: fill-box;
            transform-origin: 0% 100%;
            animation: flapLeftFold 3.6s ease-in-out forwards;
          }
          @keyframes flapRightFold {
            0%, 24% { transform: rotate(75deg); }
            48%, 100% { transform: rotate(0deg); }
          }
          .flap-right {
            transform-box: fill-box;
            transform-origin: 100% 100%;
            animation: flapRightFold 3.6s ease-in-out forwards;
          }
          @keyframes tapeRollOut {
            0%, 48% { width: 0; }
            72%, 100% { width: 100px; }
          }
          .tape-roll {
            animation: tapeRollOut 3.6s ease-out forwards;
          }
        `}} />

        {/* Phase Indicator Top Tag */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/95 px-3.5 py-1 rounded-full shadow-xs border border-slate-200/80">
          <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-slate-900 tracking-wider">
            {phase === 1 && '01. PACKING SURPLUS LOT'}
            {phase === 2 && '02. GODOWN DISPATCH'}
            {phase === 3 && '03. HIGHWAY TRANSIT'}
            {phase === 4 && '04. RETAILER ARRIVAL'}
          </span>
        </div>

        {/* ======================================================== */}
        {/* PHASE 1: BOX PACKING IN CENTER                           */}
        {/* ======================================================== */}
        {phase === 1 && (
          <svg
            key="phase-1"
            viewBox="0 0 400 400"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <clipPath id="p1-clip">
                <rect x="0" y="0" width="400" height="400" rx="16" />
              </clipPath>
            </defs>

            <g clipPath="url(#p1-clip)">
              {/* Background Sky Canvas */}
              <rect x="0" y="0" width="400" height="400" fill="#FBFBFA" />

              {/* Warehouse Floor Depth Line */}
              <rect x="0" y="310" width="400" height="90" fill="#F1F0EC" />
              <line x1="0" y1="310" x2="400" y2="310" stroke="#E2E0D8" strokeWidth="1.5" />

              {/* Clean Inspection / Packing Table Base */}
              <g transform="translate(200, 268)">
                {/* Table shadow */}
                <ellipse cx="0" cy="8" rx="136" ry="10" fill="rgba(0,0,0,0.06)" />
                {/* Tabletop Slab */}
                <rect x="-132" y="-6" width="264" height="14" rx="4" fill="#D6D3D1" />
                <rect x="-132" y="8" width="264" height="4" fill="#A8A29E" />
                {/* Table Legs */}
                <rect x="-105" y="12" width="12" height="74" rx="2" fill="#78716C" />
                <rect x="93" y="12" width="12" height="74" rx="2" fill="#78716C" />
                <rect x="-105" y="52" width="210" height="4" fill="#A8A29E" />
              </g>

              {/* Center Cardboard Box Drop-in */}
              <g className="box-drop" transform="translate(200, 225)">
                {/* Box Body Shadow */}
                <ellipse cx="0" cy="46" rx="55" ry="7" fill="rgba(0,0,0,0.12)" />

                {/* Box Kraft Body (#EF9F27 / #D97706) */}
                <rect x="-50" y="-45" width="100" height="90" rx="4" fill="#EF9F27" />
                <rect x="-50" y="0" width="100" height="45" rx="4" fill="#D97706" opacity="0.25" />

                {/* Left Flap Folding Down */}
                <g transform="translate(-50, -45)">
                  <rect className="flap-left" x="0" y="-14" width="50" height="14" rx="2" fill="#BA7517" />
                </g>

                {/* Right Flap Folding Down */}
                <g transform="translate(50, -45)">
                  <rect className="flap-right" x="-50" y="-14" width="50" height="14" rx="2" fill="#9A5B0B" />
                </g>

                {/* Orange Sealing Tape Rolling Across (#e65c00) */}
                <g transform="translate(-50, -6)">
                  <rect className="tape-roll" x="0" y="0" width="100" height="12" rx="1" fill="#e65c00" />
                </g>

                {/* Quality / Shipping Label */}
                <rect x="-38" y="12" width="38" height="24" rx="2" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
                <line x1="-32" y1="18" x2="-8" y2="18" stroke="#444441" strokeWidth="2" strokeDasharray="3 2" />
                <line x1="-32" y1="24" x2="-14" y2="24" stroke="#888780" strokeWidth="1.5" />
                <line x1="-32" y1="30" x2="-6" y2="30" stroke="#e65c00" strokeWidth="1.8" />

                {/* Handle / Fragile Symbols */}
                <path d="M22 28 L22 14 M18 18 L22 14 L26 18" stroke="#e65c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="34" cy="21" r="2.5" fill="#e65c00" />
              </g>

              {/* Orange Verified Quality Stamp Pop */}
              <g className="pop-badge" style={{ animationDelay: '2.4s' }} transform="translate(200, 155)">
                <circle cx="0" cy="0" r="23" fill="#e65c00" shadow-sm="true" />
                <circle cx="0" cy="0" r="28" fill="none" stroke="#FB923C" strokeWidth="2" strokeDasharray="4 2" />
                <path d="M-9 0 L-2 7 L10 -5" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </g>
          </svg>
        )}

        {/* ======================================================== */}
        {/* PHASE 2: GODOWN DISPATCH (SHUTTER ROLLS UP, TRUCK EXITS) */}
        {/* ======================================================== */}
        {phase === 2 && (
          <svg
            key="phase-2"
            viewBox="0 0 400 400"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <clipPath id="p2-clip">
                <rect x="0" y="0" width="400" height="400" rx="16" />
              </clipPath>
              {/* Clamping the shutter strictly to the doorway opening */}
              <clipPath id="shutter-doorway-clip">
                <rect x="36" y="152" width="128" height="114" />
              </clipPath>
            </defs>

            <g clipPath="url(#p2-clip)">
              {/* Background Sky */}
              <rect x="0" y="0" width="400" height="400" fill="#FBFBFA" />

              {/* Factory Chimney with smoke */}
              <rect x="62" y="94" width="16" height="40" fill="#52514E" rx="1" />
              <rect x="58" y="90" width="24" height="5" fill="#2C2C2A" rx="1" />
              <circle cx="70" cy="82" r="6" fill="#A8A29E" opacity="0.6" />
              <circle cx="76" cy="74" r="8" fill="#D6D3D1" opacity="0.5" />
              <circle cx="82" cy="64" r="10" fill="#E7E5E4" opacity="0.3" />

              {/* Godown Building Wall */}
              <rect x="16" y="126" width="168" height="140" fill="#EAE9E4" stroke="#D6D3D1" strokeWidth="1" />
              <rect x="16" y="122" width="168" height="7" fill="#e65c00" />
              {/* Sawtooth Roof Profile */}
              <polygon points="16,122 56,102 56,122 102,102 102,122 148,102 148,122 184,102 184,122" fill="#78716C" />

              {/* Shutter Door Interior Cavity (Dark) */}
              <rect x="36" y="152" width="128" height="114" fill="#20201F" rx="2" />

              {/* Roll-up Shutter (Clipped inside doorway, sliding UP smoothly) */}
              <g clipPath="url(#shutter-doorway-clip)">
                <g className="shutter-slider" transform="translate(36, 152)">
                  <rect x="0" y="0" width="128" height="114" fill="#B4B2A9" />
                  {[12, 24, 36, 48, 60, 72, 84, 96, 108].map((y) => (
                    <line key={y} x1="0" y1={y} x2="128" y2={y} stroke="#78716C" strokeWidth="1.5" />
                  ))}
                  <rect x="0" y="110" width="128" height="4" fill="#52514E" />
                </g>
              </g>

              {/* Ground & Asphalt Road */}
              <rect x="0" y="266" width="400" height="134" fill="#2C2C2A" />
              <line x1="0" y1="266" x2="400" y2="266" stroke="#5F5E5A" strokeWidth="2" />
              <line x1="0" y1="322" x2="400" y2="322" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="18 14" />

              {/* Departing Orange Truck (Exits smoothly from godown, NO text labels) */}
              <g className="dispatch-truck" transform="translate(-30, 194)">
                {/* Headlight beam */}
                <polygon points="162,48 250,34 250,72 162,58" fill="rgba(251,146,60,0.22)" />

                {/* Truck Cargo Trailer in Accent Orange (#e65c00) */}
                <rect x="18" y="10" width="98" height="58" rx="4" fill="#e65c00" />
                {/* Minimalist container door ribs (Clean, premium geometric design) */}
                <rect x="28" y="20" width="20" height="26" rx="2" fill="#FFEDD5" />
                <rect x="54" y="20" width="20" height="26" rx="2" fill="#FFEDD5" />
                <rect x="80" y="20" width="20" height="26" rx="2" fill="#FFEDD5" />
                <line x1="18" y1="52" x2="116" y2="52" stroke="#C2410C" strokeWidth="1.5" />

                {/* Truck Cab Front (Darker Orange #C2410C) */}
                <path d="M116 22 L142 22 L164 44 L164 68 L116 68 Z" fill="#C2410C" />
                <polygon points="140,26 158,44 132,44 132,26" fill="#FFEDD5" />
                <rect x="160" y="48" width="5" height="8" rx="1" fill="#FEF08A" />

                {/* Chassis rail */}
                <rect x="18" y="66" width="144" height="6" fill="#444441" />

                {/* Wheel 1 (Rear) - Spinning around its exact center */}
                <g transform="translate(42, 74)">
                  <circle cx="0" cy="0" r="10" fill="#2C2C2A" />
                  <circle cx="0" cy="0" r="4" fill="#B4B2A9" />
                  <g className="wheel-rot">
                    <line x1="-8" y1="0" x2="8" y2="0" stroke="#B4B2A9" strokeWidth="1.5" />
                    <line x1="0" y1="-8" x2="0" y2="8" stroke="#B4B2A9" strokeWidth="1.5" />
                  </g>
                </g>

                {/* Wheel 2 (Mid) */}
                <g transform="translate(86, 74)">
                  <circle cx="0" cy="0" r="10" fill="#2C2C2A" />
                  <circle cx="0" cy="0" r="4" fill="#B4B2A9" />
                  <g className="wheel-rot">
                    <line x1="-8" y1="0" x2="8" y2="0" stroke="#B4B2A9" strokeWidth="1.5" />
                    <line x1="0" y1="-8" x2="0" y2="8" stroke="#B4B2A9" strokeWidth="1.5" />
                  </g>
                </g>

                {/* Wheel 3 (Front Cab) */}
                <g transform="translate(144, 74)">
                  <circle cx="0" cy="0" r="10" fill="#2C2C2A" />
                  <circle cx="0" cy="0" r="4" fill="#B4B2A9" />
                  <g className="wheel-rot">
                    <line x1="-8" y1="0" x2="8" y2="0" stroke="#B4B2A9" strokeWidth="1.5" />
                    <line x1="0" y1="-8" x2="0" y2="8" stroke="#B4B2A9" strokeWidth="1.5" />
                  </g>
                </g>
              </g>
            </g>
          </svg>
        )}

        {/* ======================================================== */}
        {/* PHASE 3: TRUCK IN CENTER + ROAD & TREES MOVE BACKWARD   */}
        {/* (The Continuous Parallax Forward-Travel Illusion)        */}
        {/* ======================================================== */}
        {phase === 3 && (
          <svg
            key="phase-3"
            viewBox="0 0 400 400"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <clipPath id="p3-clip">
                <rect x="0" y="0" width="400" height="400" rx="16" />
              </clipPath>
            </defs>

            <g clipPath="url(#p3-clip)">
              {/* Background Sky */}
              <rect x="0" y="0" width="400" height="400" fill="#FBFBFA" />

              {/* Parallax Clouds (Slow Drift Backward) */}
              <g className="cloud-drift" transform="translate(0, 105)">
                <ellipse cx="0" cy="0" rx="36" ry="12" fill="#E7E5E4" opacity="0.65" />
                <ellipse cx="16" cy="-8" rx="22" ry="14" fill="#E7E5E4" opacity="0.65" />
              </g>

              {/* Parallax Background Tree 1 (Moves Fast Right to Left) */}
              <g className="tree-fast" transform="translate(0, 192)">
                <rect x="-3" y="24" width="6" height="46" fill="#78350F" rx="1" />
                <circle cx="0" cy="16" r="22" fill="#65A30D" />
                <circle cx="-10" cy="10" r="16" fill="#84CC16" />
                <circle cx="10" cy="10" r="16" fill="#4D7C0F" />
              </g>

              {/* Parallax Background Pine Tree 2 (Different Timing) */}
              <g className="tree-slow" transform="translate(0, 202)">
                <rect x="-3" y="20" width="6" height="42" fill="#78350F" rx="1" />
                <polygon points="0,0 -20,38 20,38" fill="#15803D" />
                <polygon points="0,-10 -16,22 16,22" fill="#16A34A" />
              </g>

              {/* Parallax Highway Milestone Marker */}
              <g className="milestone-fast" transform="translate(0, 226)">
                <rect x="-2" y="10" width="4" height="30" fill="#78716C" />
                <rect x="-12" y="-2" width="24" height="14" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
                <circle cx="0" cy="5" r="3" fill="#e65c00" />
              </g>

              {/* Road Surface */}
              <rect x="0" y="260" width="400" height="140" fill="#2C2C2A" />
              <line x1="0" y1="260" x2="400" y2="260" stroke="#5F5E5A" strokeWidth="2" />

              {/* Road Dashed Line Rushing Backward (Moving Left) */}
              <line
                x1="-60"
                y1="320"
                x2="460"
                y2="320"
                stroke="#e65c00"
                strokeWidth="4"
                strokeDasharray="22 22"
                className="road-moving"
              />
              <line x1="0" y1="375" x2="400" y2="375" stroke="#444441" strokeWidth="2" strokeDasharray="10 10" />

              {/* ==================================================== */}
              {/* TRUCK LOCKED IN DEAD CENTER (X: 118) - NO TEXT       */}
              {/* ==================================================== */}
              <g transform="translate(118, 186)">
                
                {/* Aerodynamic Speed Lines */}
                <line x1="172" y1="24" x2="204" y2="24" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                <line x1="178" y1="34" x2="216" y2="34" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                <line x1="170" y1="46" x2="198" y2="46" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

                {/* Truck Cabin & Body with Engine Idle Bounce */}
                <g className="truck-engine">
                  {/* Truck Trailer in Vibrant Accent Orange (#e65c00) */}
                  <rect x="0" y="8" width="112" height="64" rx="4" fill="#e65c00" />
                  
                  {/* Clean Minimalist Geometric Paneling (No cheap brand text) */}
                  <rect x="12" y="20" width="24" height="28" rx="2" fill="#FFEDD5" />
                  <rect x="44" y="20" width="24" height="28" rx="2" fill="#FFEDD5" />
                  <rect x="76" y="20" width="24" height="28" rx="2" fill="#FFEDD5" />
                  <line x1="0" y1="56" x2="112" y2="56" stroke="#C2410C" strokeWidth="2" />

                  {/* Truck Cab Front (Dark Orange #C2410C) */}
                  <path d="M112 20 L140 20 L166 44 L166 72 L112 72 Z" fill="#C2410C" />
                  <polygon points="138,24 160,44 128,44 128,24" fill="#FFEDD5" />
                  <rect x="116" y="28" width="10" height="14" rx="1" fill="#FFEDD5" opacity="0.8" />

                  {/* Headlight beam */}
                  <rect x="162" y="50" width="5" height="8" rx="1" fill="#FEF08A" />
                  <polygon points="167,52 248,36 248,68 167,60" fill="rgba(254,240,138,0.22)" />

                  {/* Under-chassis bar */}
                  <rect x="4" y="70" width="156" height="6" fill="#1C1917" />

                  {/* Exhaust Pipe & Smoke Puffs */}
                  <rect x="-4" y="30" width="4" height="28" fill="#78716C" rx="1" />
                  <circle cx="-10" cy="34" r="4" fill="#D6D3D1" opacity="0.6" />
                  <circle cx="-18" cy="30" r="6" fill="#E7E5E4" opacity="0.4" />
                </g>

                {/* Wheel 1 (Rear Left) - Perfectly spinning on its hub (0, 0) */}
                <g transform="translate(24, 76)">
                  <circle cx="0" cy="0" r="11" fill="#2C2C2A" />
                  <circle cx="0" cy="0" r="4" fill="#B4B2A9" />
                  <g className="wheel-rot-fast">
                    <line x1="-9" y1="0" x2="9" y2="0" stroke="#B4B2A9" strokeWidth="1.5" />
                    <line x1="0" y1="-9" x2="0" y2="9" stroke="#B4B2A9" strokeWidth="1.5" />
                  </g>
                </g>

                {/* Wheel 2 (Rear Right) */}
                <g transform="translate(70, 76)">
                  <circle cx="0" cy="0" r="11" fill="#2C2C2A" />
                  <circle cx="0" cy="0" r="4" fill="#B4B2A9" />
                  <g className="wheel-rot-fast">
                    <line x1="-9" y1="0" x2="9" y2="0" stroke="#B4B2A9" strokeWidth="1.5" />
                    <line x1="0" y1="-9" x2="0" y2="9" stroke="#B4B2A9" strokeWidth="1.5" />
                  </g>
                </g>

                {/* Wheel 3 (Front Cab) */}
                <g transform="translate(144, 76)">
                  <circle cx="0" cy="0" r="11" fill="#2C2C2A" />
                  <circle cx="0" cy="0" r="4" fill="#B4B2A9" />
                  <g className="wheel-rot-fast">
                    <line x1="-9" y1="0" x2="9" y2="0" stroke="#B4B2A9" strokeWidth="1.5" />
                    <line x1="0" y1="-9" x2="0" y2="9" stroke="#B4B2A9" strokeWidth="1.5" />
                  </g>
                </g>

              </g>
            </g>
          </svg>
        )}

        {/* ======================================================== */}
        {/* PHASE 4: RETAILER ARRIVAL, BRAKE STOP & SETTLED          */}
        {/* (No box coming outside, no cheap shop/truck names)      */}
        {/* ======================================================== */}
        {phase === 4 && (
          <svg
            key="phase-4"
            viewBox="0 0 400 400"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <clipPath id="p4-clip">
                <rect x="0" y="0" width="400" height="400" rx="16" />
              </clipPath>
            </defs>

            <g clipPath="url(#p4-clip)">
              {/* Background Sky */}
              <rect x="0" y="0" width="400" height="400" fill="#FBFBFA" />

              {/* Road Surface & Retailer Sidewalk Curb */}
              <rect x="0" y="264" width="400" height="136" fill="#2C2C2A" />
              <line x1="0" y1="264" x2="400" y2="264" stroke="#5F5E5A" strokeWidth="2" />
              <rect x="230" y="258" width="170" height="10" fill="#D6D3D1" rx="1" />

              {/* Retailer Storefront (Right Side - Sleek Architectural, NO text) */}
              <g transform="translate(245, 114)">
                {/* Store Wall */}
                <rect x="0" y="20" width="145" height="126" fill="#EAE9E4" stroke="#D6D3D1" strokeWidth="1" />

                {/* Store Crown Header (Clean charcoal lintel without cheap text) */}
                <rect x="-4" y="10" width="153" height="20" fill="#2C2C2A" rx="2" />

                {/* Striped Orange & White Awning (#e65c00 & #FFFFFF) */}
                <g transform="translate(-6, 30)">
                  <polygon points="0,0 157,0 148,24 9,24" fill="#e65c00" />
                  {[20, 50, 80, 110, 140].map((x) => (
                    <polygon key={x} points={`${x},0 ${x + 14},0 ${x + 11},24 ${x - 3},24`} fill="#FFFFFF" />
                  ))}
                  <rect x="9" y="23" width="139" height="3" fill="#BA7517" />
                </g>

                {/* Storefront Display Window */}
                <rect x="15" y="66" width="52" height="52" rx="3" fill="#FFEDD5" stroke="#FDBA74" strokeWidth="1" />
                <line x1="18" y1="74" x2="42" y2="108" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />

                {/* Glass Entrance Door */}
                <rect x="76" y="66" width="48" height="78" rx="2" fill="#2C2C2A" />
                <rect x="82" y="72" width="36" height="44" rx="1" fill="#FFEDD5" opacity="0.75" />
                <circle cx="83" cy="110" r="2.5" fill="#FEF08A" />
              </g>

              {/* Truck Drives in and comes to a full, smooth stop (NO text, NO box eject) */}
              <g className="arrival-truck" transform="translate(85, 192)">
                {/* Truck Trailer in Orange #e65c00 */}
                <rect x="0" y="10" width="98" height="58" rx="4" fill="#e65c00" />
                <rect x="10" y="22" width="22" height="22" rx="2" fill="#FFEDD5" />
                <rect x="38" y="22" width="22" height="22" rx="2" fill="#FFEDD5" />
                <rect x="66" y="22" width="22" height="22" rx="2" fill="#FFEDD5" />

                {/* Truck Cab Front (Dark Orange #C2410C) */}
                <path d="M98 22 L124 22 L145 44 L145 68 L98 68 Z" fill="#C2410C" />
                <polygon points="122,26 138,44 114,44 114,26" fill="#FFEDD5" />
                <rect x="140" y="48" width="5" height="8" rx="1" fill="#FEF08A" />

                {/* Chassis rail */}
                <rect x="0" y="66" width="142" height="6" fill="#444441" />

                {/* Stationary Wheels (Completely still upon full brake stop) */}
                <g transform="translate(24, 74)">
                  <circle cx="0" cy="0" r="10" fill="#2C2C2A" />
                  <circle cx="0" cy="0" r="4" fill="#B4B2A9" />
                  <line x1="-8" y1="0" x2="8" y2="0" stroke="#B4B2A9" strokeWidth="1.5" />
                  <line x1="0" y1="-8" x2="0" y2="8" stroke="#B4B2A9" strokeWidth="1.5" />
                </g>
                <g transform="translate(68, 74)">
                  <circle cx="0" cy="0" r="10" fill="#2C2C2A" />
                  <circle cx="0" cy="0" r="4" fill="#B4B2A9" />
                  <line x1="-8" y1="0" x2="8" y2="0" stroke="#B4B2A9" strokeWidth="1.5" />
                  <line x1="0" y1="-8" x2="0" y2="8" stroke="#B4B2A9" strokeWidth="1.5" />
                </g>
                <g transform="translate(126, 74)">
                  <circle cx="0" cy="0" r="10" fill="#2C2C2A" />
                  <circle cx="0" cy="0" r="4" fill="#B4B2A9" />
                  <line x1="-8" y1="0" x2="8" y2="0" stroke="#B4B2A9" strokeWidth="1.5" />
                  <line x1="0" y1="-8" x2="0" y2="8" stroke="#B4B2A9" strokeWidth="1.5" />
                </g>
              </g>

              {/* Verified Delivered Checkmark Badge Pop (Celebrates Successful Delivery) */}
              <g className="pop-badge" style={{ animationDelay: '1.6s' }} transform="translate(295, 175)">
                <circle cx="0" cy="0" r="23" fill="#e65c00" />
                <circle cx="0" cy="0" r="28" fill="none" stroke="#FB923C" strokeWidth="2" strokeDasharray="4 2" />
                <path d="M-9 0 L-2 7 L10 -5" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </g>
          </svg>
        )}

        {/* ======================================================== */}
        {/* INTERACTIVE PHASE SWITCHER CONTROLS                      */}
        {/* ======================================================== */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-white/95 px-2.5 py-1 rounded-full shadow-xs border border-slate-200/80">
          {([1, 2, 3, 4] as const).map((stepNum) => (
            <button
              key={stepNum}
              type="button"
              onClick={() => {
                setIsManual(true);
                setPhase(stepNum);
                setTimeout(() => setIsManual(false), 9000);
              }}
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer ${
                phase === stepNum
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              P{stepNum}
            </button>
          ))}
          <span className="text-[9px] font-mono text-slate-400 pl-1 border-l border-slate-200">
            {isManual ? 'Manual' : 'Auto'}
          </span>
        </div>

      </div>
    </div>
  );
}