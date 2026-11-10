'use client';

import { useState, useEffect } from 'react';

export default function LogisticsDeliveryAnimation() {
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);
  const [isManual, setIsManual] = useState(false);

  // Auto-advance through the 4 phases
  useEffect(() => {
    if (isManual) return;

    const durations: Record<number, number> = {
      1: 3600, // Phase 1: Surplus Lot Packing & Sealed Inspection (3.6s)
      2: 3800, // Phase 2: Godown Shutter Roll-up & Truck Dispatch (3.8s)
      3: 4600, // Phase 3: High-Speed Parallax Highway Transit (4.6s)
      4: 3800, // Phase 4: Retailer Arrival & Hydraulic Stop (3.8s)
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
        
        {/* Bulletproof CSS Animations: All Y coordinates baked directly into SVG geometry */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Wheel Rotation: Rotates rim spokes precisely around local (0, 0) */
          @keyframes spinWheelRims {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .wheel-rim-spin {
            transform-origin: 0 0;
            animation: spinWheelRims 0.55s linear infinite;
          }
          .wheel-rim-spin-fast {
            transform-origin: 0 0;
            animation: spinWheelRims 0.36s linear infinite;
          }

          /* Phase 1: Cardboard Box Drop onto Table */
          @keyframes p1BoxDrop {
            0% { transform: translateY(-70px); opacity: 0; }
            30%, 100% { transform: translateY(0); opacity: 1; }
          }
          .p1-box-drop {
            transform-origin: 0 0;
            animation: p1BoxDrop 3.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }

          /* Phase 1: Flaps Folding */
          @keyframes p1FlapL {
            0%, 25% { transform: rotate(-75deg); }
            48%, 100% { transform: rotate(0deg); }
          }
          .p1-flap-l {
            transform-origin: 0 0;
            animation: p1FlapL 3.6s ease-in-out forwards;
          }

          @keyframes p1FlapR {
            0%, 28% { transform: rotate(75deg); }
            52%, 100% { transform: rotate(0deg); }
          }
          .p1-flap-r {
            transform-origin: 0 0;
            animation: p1FlapR 3.6s ease-in-out forwards;
          }

          /* Phase 1: Sealing Tape */
          @keyframes p1TapeRoll {
            0%, 50% { width: 0; }
            75%, 100% { width: 100px; }
          }
          .p1-tape {
            animation: p1TapeRoll 3.6s ease-out forwards;
          }

          /* Phase 1: Verified Pop */
          @keyframes p1BadgePop {
            0%, 68% { transform: scale(0); opacity: 0; }
            80% { transform: scale(1.22); opacity: 1; }
            90% { transform: scale(0.95); opacity: 1; }
            96%, 100% { transform: scale(1); opacity: 1; }
          }
          .p1-badge {
            transform-origin: 0 0;
            animation: p1BadgePop 3.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }

          /* Phase 2: Shutter Rolls UP into Godown Lintel */
          @keyframes p2ShutterUp {
            0%, 15% { transform: translateY(0); }
            45%, 100% { transform: translateY(-108px); }
          }
          .p2-shutter-door {
            animation: p2ShutterUp 3.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          /* Phase 2: Truck Drives Forward out of Godown (Firmly on road at Y = 260) */
          @keyframes p2TruckDrive {
            0%, 35% { transform: translateX(0); }
            100% { transform: translateX(270px); }
          }
          .p2-truck-motion {
            animation: p2TruckDrive 3.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }

          /* Phase 3: Parallax Road Line Rushing Backward */
          @keyframes p3RoadMoving {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: 44; }
          }
          .p3-road-rush {
            animation: p3RoadMoving 0.36s linear infinite;
          }

          /* Phase 3: Parallax Trees Rushing Backward (Hardcoded Y=260 on ground) */
          @keyframes p3TreeScroll1 {
            0% { transform: translateX(430px); }
            100% { transform: translateX(-60px); }
          }
          .p3-tree-1 {
            animation: p3TreeScroll1 2.2s linear infinite;
          }

          @keyframes p3TreeScroll2 {
            0% { transform: translateX(440px); }
            100% { transform: translateX(-70px); }
          }
          .p3-tree-2 {
            animation: p3TreeScroll2 3.4s linear infinite -1.4s;
          }

          @keyframes p3MilestoneScroll {
            0% { transform: translateX(430px); }
            100% { transform: translateX(-50px); }
          }
          .p3-milestone {
            animation: p3MilestoneScroll 1.8s linear infinite -0.6s;
          }

          @keyframes p3CloudScroll {
            0% { transform: translateX(440px); }
            100% { transform: translateX(-120px); }
          }
          .p3-clouds {
            animation: p3CloudScroll 7s linear infinite;
          }

          /* Phase 3: Truck Engine Idle Bounce (ONLY cabin bounces, wheels grounded) */
          @keyframes p3TruckVibe {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          .p3-engine-vibe {
            animation: p3TruckVibe 0.28s ease-in-out infinite;
          }

          /* Phase 4: Truck Arrives from Left and Brakes to a Complete Stop */
          @keyframes p4TruckArrival {
            0% { transform: translateX(-240px); }
            72% { transform: translateX(4px); }
            86% { transform: translateX(-3px); }
            100% { transform: translateX(0px); }
          }
          .p4-truck-arrival {
            animation: p4TruckArrival 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          /* Phase 4: Delivery Checkmark Badge Pop */
          @keyframes p4BadgePop {
            0%, 65% { transform: scale(0); opacity: 0; }
            80% { transform: scale(1.22); opacity: 1; }
            90% { transform: scale(0.95); opacity: 1; }
            96%, 100% { transform: scale(1); opacity: 1; }
          }
          .p4-badge {
            transform-origin: 0 0;
            animation: p4BadgePop 3.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
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
              <clipPath id="p1-box-clip">
                <rect x="0" y="0" width="400" height="400" rx="16" />
              </clipPath>
            </defs>

            <g clipPath="url(#p1-box-clip)">
              {/* Sky background */}
              <rect x="0" y="0" width="400" height="400" fill="#FBFBFA" />

              {/* Floor */}
              <rect x="0" y="310" width="400" height="90" fill="#F1F0EC" />
              <line x1="0" y1="310" x2="400" y2="310" stroke="#E2E0D8" strokeWidth="1.5" />

              {/* Warehouse Inspection Table Base (Hardcoded coordinates) */}
              <ellipse cx="200" cy="276" rx="136" ry="10" fill="rgba(0,0,0,0.06)" />
              <rect x="68" y="262" width="264" height="14" rx="4" fill="#D6D3D1" />
              <rect x="68" y="276" width="264" height="4" fill="#A8A29E" />
              <rect x="95" y="280" width="12" height="70" rx="2" fill="#78716C" />
              <rect x="293" y="280" width="12" height="70" rx="2" fill="#78716C" />
              <rect x="95" y="320" width="210" height="4" fill="#A8A29E" />

              {/* Center Box Drop-in */}
              <g transform="translate(200, 220)">
                <g className="p1-box-drop">
                  {/* Shadow beneath box */}
                  <ellipse cx="0" cy="44" rx="55" ry="7" fill="rgba(0,0,0,0.12)" />

                  {/* Kraft Cardboard Box */}
                  <rect x="-50" y="-45" width="100" height="90" rx="4" fill="#EF9F27" />
                  <rect x="-50" y="0" width="100" height="45" rx="4" fill="#D97706" opacity="0.25" />

                  {/* Left Flap */}
                  <g transform="translate(-50, -45)">
                    <rect className="p1-flap-l" x="0" y="-14" width="50" height="14" rx="2" fill="#BA7517" />
                  </g>

                  {/* Right Flap */}
                  <g transform="translate(50, -45)">
                    <rect className="p1-flap-r" x="-50" y="-14" width="50" height="14" rx="2" fill="#9A5B0B" />
                  </g>

                  {/* Orange Sealing Tape Rolling Across */}
                  <g transform="translate(-50, -6)">
                    <rect className="p1-tape" x="0" y="0" width="100" height="12" rx="1" fill="#e65c00" />
                  </g>

                  {/* Minimal Shipping / Inspection Label */}
                  <rect x="-38" y="12" width="38" height="24" rx="2" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.5" />
                  <line x1="-32" y1="18" x2="-8" y2="18" stroke="#444441" strokeWidth="2" strokeDasharray="3 2" />
                  <line x1="-32" y1="24" x2="-14" y2="24" stroke="#888780" strokeWidth="1.5" />
                  <line x1="-32" y1="30" x2="-6" y2="30" stroke="#e65c00" strokeWidth="1.8" />

                  {/* Upright Handle Arrows */}
                  <path d="M22 28 L22 14 M18 18 L22 14 L26 18" stroke="#e65c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <circle cx="34" cy="21" r="2.5" fill="#e65c00" />
                </g>
              </g>

              {/* Orange Verified Quality Stamp Pop */}
              <g transform="translate(200, 150)">
                <g className="p1-badge">
                  <circle cx="0" cy="0" r="23" fill="#e65c00" />
                  <circle cx="0" cy="0" r="28" fill="none" stroke="#FB923C" strokeWidth="2" strokeDasharray="4 2" />
                  <path d="M-9 0 L-2 7 L10 -5" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </g>
            </g>
          </svg>
        )}

        {/* ======================================================== */}
        {/* PHASE 2: GODOWN DISPATCH (TRUCK STAYS LOCKED ON ROAD)    */}
        {/* ======================================================== */}
        {phase === 2 && (
          <svg
            key="phase-2"
            viewBox="0 0 400 400"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <clipPath id="p2-full-clip">
                <rect x="0" y="0" width="400" height="400" rx="16" />
              </clipPath>
              {/* Shutter doorway boundary: strictly clips slats within the lintel */}
              <clipPath id="p2-shutter-clip">
                <rect x="42" y="152" width="116" height="108" />
              </clipPath>
            </defs>

            <g clipPath="url(#p2-full-clip)">
              {/* Sky background */}
              <rect x="0" y="0" width="400" height="400" fill="#FBFBFA" />

              {/* Factory Chimney with smoke */}
              <rect x="62" y="94" width="16" height="40" fill="#52514E" rx="1" />
              <rect x="58" y="90" width="24" height="5" fill="#2C2C2A" rx="1" />
              <circle cx="70" cy="82" r="6" fill="#A8A29E" opacity="0.6" />
              <circle cx="76" cy="74" r="8" fill="#D6D3D1" opacity="0.5" />
              <circle cx="82" cy="64" r="10" fill="#E7E5E4" opacity="0.3" />

              {/* Godown Building Wall */}
              <rect x="16" y="124" width="168" height="136" fill="#EAE9E4" stroke="#D6D3D1" strokeWidth="1" />
              <rect x="16" y="120" width="168" height="7" fill="#e65c00" />
              {/* Sawtooth Industrial Roof */}
              <polygon points="16,120 56,100 56,120 102,100 102,120 148,100 148,120 184,100 184,120" fill="#78716C" />

              {/* Shutter Doorway Cavity (Dark Interior) */}
              <rect x="42" y="152" width="116" height="108" fill="#20201F" rx="2" />

              {/* Roll-up Shutter Slats (Nested properly: outer holds X=42, Y=152; inner animates) */}
              <g clipPath="url(#p2-shutter-clip)">
                <g transform="translate(42, 152)">
                  <g className="p2-shutter-door">
                    <rect x="0" y="0" width="116" height="108" fill="#B4B2A9" />
                    {[12, 24, 36, 48, 60, 72, 84, 96].map((y) => (
                      <line key={y} x1="0" y1={y} x2="116" y2={y} stroke="#78716C" strokeWidth="1.5" />
                    ))}
                    <rect x="0" y="104" width="116" height="4" fill="#52514E" />
                  </g>
                </g>
              </g>

              {/* Asphalt Road Ground Level: Exactly at Y = 260 */}
              <rect x="0" y="260" width="400" height="140" fill="#2C2C2A" />
              <line x1="0" y1="260" x2="400" y2="260" stroke="#5F5E5A" strokeWidth="2" />
              <line x1="0" y1="318" x2="400" y2="318" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="18 14" />

              {/* ==================================================== */}
              {/* DEPARTING TRUCK: Y COORDINATES FIRMLY GROUNDED AT 260 */}
              {/* ONLY translateX ANIMATES - ZERO VERTICAL FLYING     */}
              {/* ==================================================== */}
              <g className="p2-truck-motion">
                {/* Translucent Headlight Beam */}
                <polygon points="164,228 252,214 252,252 164,238" fill="rgba(251,146,60,0.22)" />

                {/* Orange Cargo Trailer: Height 58px, Bottom sits on chassis at y=240 */}
                <rect x="20" y="184" width="98" height="58" rx="4" fill="#e65c00" />
                {/* Minimalist Geometric Ribs (No text) */}
                <rect x="30" y="196" width="20" height="24" rx="2" fill="#FFEDD5" />
                <rect x="56" y="196" width="20" height="24" rx="2" fill="#FFEDD5" />
                <rect x="82" y="196" width="20" height="24" rx="2" fill="#FFEDD5" />
                <line x1="20" y1="226" x2="118" y2="226" stroke="#C2410C" strokeWidth="1.5" />

                {/* Truck Cab Front (Dark Orange #C2410C) */}
                <path d="M118 196 L144 196 L166 218 L166 242 L118 242 Z" fill="#C2410C" />
                <polygon points="142,200 160,218 134,218 134,200" fill="#FFEDD5" />
                <rect x="162" y="222" width="5" height="8" rx="1" fill="#FEF08A" />

                {/* Under-chassis rail */}
                <rect x="20" y="240" width="144" height="6" fill="#444441" />

                {/* Wheels: Radius 10, Hub at Y=250 -> Touches Road at exactly Y=260 */}
                {/* Wheel 1 (Rear) */}
                <g transform="translate(48, 250)">
                  <circle cx="0" cy="0" r="10" fill="#2C2C2A" />
                  <circle cx="0" cy="0" r="4" fill="#B4B2A9" />
                  <g className="wheel-rim-spin">
                    <line x1="-8" y1="0" x2="8" y2="0" stroke="#B4B2A9" strokeWidth="1.5" />
                    <line x1="0" y1="-8" x2="0" y2="8" stroke="#B4B2A9" strokeWidth="1.5" />
                  </g>
                </g>

                {/* Wheel 2 (Mid) */}
                <g transform="translate(92, 250)">
                  <circle cx="0" cy="0" r="10" fill="#2C2C2A" />
                  <circle cx="0" cy="0" r="4" fill="#B4B2A9" />
                  <g className="wheel-rim-spin">
                    <line x1="-8" y1="0" x2="8" y2="0" stroke="#B4B2A9" strokeWidth="1.5" />
                    <line x1="0" y1="-8" x2="0" y2="8" stroke="#B4B2A9" strokeWidth="1.5" />
                  </g>
                </g>

                {/* Wheel 3 (Front Cab) */}
                <g transform="translate(148, 250)">
                  <circle cx="0" cy="0" r="10" fill="#2C2C2A" />
                  <circle cx="0" cy="0" r="4" fill="#B4B2A9" />
                  <g className="wheel-rim-spin">
                    <line x1="-8" y1="0" x2="8" y2="0" stroke="#B4B2A9" strokeWidth="1.5" />
                    <line x1="0" y1="-8" x2="0" y2="8" stroke="#B4B2A9" strokeWidth="1.5" />
                  </g>
                </g>
              </g>
            </g>
          </svg>
        )}

        {/* ======================================================== */}
        {/* PHASE 3: HIGHWAY PARALLAX (TREES & TRUCK FIRMLY GROUNDED)*/}
        {/* ======================================================== */}
        {phase === 3 && (
          <svg
            key="phase-3"
            viewBox="0 0 400 400"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <clipPath id="p3-highway-clip">
                <rect x="0" y="0" width="400" height="400" rx="16" />
              </clipPath>
            </defs>

            <g clipPath="url(#p3-highway-clip)">
              {/* Sky background */}
              <rect x="0" y="0" width="400" height="400" fill="#FBFBFA" />

              {/* Parallax Clouds Drift (Y coordinates baked into ellipses) */}
              <g className="p3-clouds">
                <ellipse cx="0" cy="95" rx="36" ry="12" fill="#E7E5E4" opacity="0.65" />
                <ellipse cx="16" cy="87" rx="22" ry="14" fill="#E7E5E4" opacity="0.65" />
              </g>

              {/* ==================================================== */}
              {/* PARALLAX TREES: TRUNKS SIT FIRMLY AT Y = 260 GROUND  */}
              {/* NO transform="translate" on group -> ZERO FLYING     */}
              {/* ==================================================== */}
              {/* Parallax Tree 1: Oak tree grounded at Y = 260 */}
              <g className="p3-tree-1">
                {/* Trunk: from Y=215 down to 260 */}
                <rect x="-4" y="215" width="8" height="45" rx="1" fill="#78350F" />
                {/* Foliage crown */}
                <circle cx="0" cy="195" r="24" fill="#65A30D" />
                <circle cx="-12" cy="188" r="17" fill="#84CC16" />
                <circle cx="12" cy="188" r="17" fill="#4D7C0F" />
              </g>

              {/* Parallax Pine Tree 2: Grounded at Y = 260 */}
              <g className="p3-tree-2">
                {/* Trunk: from Y=222 down to 260 */}
                <rect x="-3" y="222" width="6" height="38" rx="1" fill="#78350F" />
                {/* Pine foliage triangles */}
                <polygon points="0,170 -20,228 20,228" fill="#15803D" />
                <polygon points="0,154 -15,204 15,204" fill="#16A34A" />
              </g>

              {/* Parallax Highway Milestone Marker: Grounded at Y = 260 */}
              <g className="p3-milestone">
                <rect x="-2" y="234" width="4" height="26" fill="#78716C" />
                <rect x="-12" y="222" width="24" height="14" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
                <circle cx="0" cy="229" r="3" fill="#e65c00" />
              </g>

              {/* Asphalt Road: Exactly at Y = 260 */}
              <rect x="0" y="260" width="400" height="140" fill="#2C2C2A" />
              <line x1="0" y1="260" x2="400" y2="260" stroke="#5F5E5A" strokeWidth="2" />

              {/* Rushing Road Dashed Center Line (Backward Motion) */}
              <line
                x1="-60"
                y1="318"
                x2="460"
                y2="318"
                stroke="#e65c00"
                strokeWidth="4"
                strokeDasharray="22 22"
                className="p3-road-rush"
              />
              <line x1="0" y1="375" x2="400" y2="375" stroke="#444441" strokeWidth="2" strokeDasharray="10 10" />

              {/* ==================================================== */}
              {/* TRUCK CENTERED (X: 115) - WHEELS HARDCODED AT Y=250   */}
              {/* ONLY CABIN ENGINE VIBRATES, WHEELS STAY ON GROUND   */}
              {/* ==================================================== */}
              <g transform="translate(115, 0)">
                {/* Aerodynamic Speed Lines */}
                <line x1="174" y1="210" x2="204" y2="210" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                <line x1="180" y1="220" x2="218" y2="220" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                <line x1="172" y1="232" x2="200" y2="232" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

                {/* Vibrating Engine Body */}
                <g className="p3-engine-vibe">
                  {/* Trailer: Height 62px, sits on chassis at Y=240 */}
                  <rect x="0" y="178" width="112" height="62" rx="4" fill="#e65c00" />
                  {/* Minimalist Paneling (No text) */}
                  <rect x="12" y="190" width="24" height="26" rx="2" fill="#FFEDD5" />
                  <rect x="44" y="190" width="24" height="26" rx="2" fill="#FFEDD5" />
                  <rect x="76" y="190" width="24" height="26" rx="2" fill="#FFEDD5" />
                  <line x1="0" y1="222" x2="112" y2="222" stroke="#C2410C" strokeWidth="2" />

                  {/* Cab Front (Dark Orange #C2410C) */}
                  <path d="M112 190 L140 190 L166 214 L166 240 L112 240 Z" fill="#C2410C" />
                  <polygon points="138,194 160,214 128,214 128,194" fill="#FFEDD5" />
                  <rect x="116" y="198" width="10" height="14" rx="1" fill="#FFEDD5" opacity="0.8" />

                  {/* Headlight beam */}
                  <rect x="162" y="220" width="5" height="8" rx="1" fill="#FEF08A" />
                  <polygon points="167,222 248,206 248,238 167,230" fill="rgba(254,240,138,0.22)" />

                  {/* Under-chassis rail */}
                  <rect x="4" y="240" width="156" height="6" fill="#1C1917" />

                  {/* Exhaust Pipe & Smoke */}
                  <rect x="-4" y="200" width="4" height="28" fill="#78716C" rx="1" />
                  <circle cx="-10" cy="204" r="4" fill="#D6D3D1" opacity="0.6" />
                  <circle cx="-18" cy="200" r="6" fill="#E7E5E4" opacity="0.4" />
                </g>

                {/* Wheel 1 (Rear Left): Grounded at Y=250 */}
                <g transform="translate(24, 250)">
                  <circle cx="0" cy="0" r="10" fill="#2C2C2A" />
                  <circle cx="0" cy="0" r="4" fill="#B4B2A9" />
                  <g className="wheel-rim-spin-fast">
                    <line x1="-8" y1="0" x2="8" y2="0" stroke="#B4B2A9" strokeWidth="1.5" />
                    <line x1="0" y1="-8" x2="0" y2="8" stroke="#B4B2A9" strokeWidth="1.5" />
                  </g>
                </g>

                {/* Wheel 2 (Rear Right): Grounded at Y=250 */}
                <g transform="translate(70, 250)">
                  <circle cx="0" cy="0" r="10" fill="#2C2C2A" />
                  <circle cx="0" cy="0" r="4" fill="#B4B2A9" />
                  <g className="wheel-rim-spin-fast">
                    <line x1="-8" y1="0" x2="8" y2="0" stroke="#B4B2A9" strokeWidth="1.5" />
                    <line x1="0" y1="-8" x2="0" y2="8" stroke="#B4B2A9" strokeWidth="1.5" />
                  </g>
                </g>

                {/* Wheel 3 (Front Cab): Grounded at Y=250 */}
                <g transform="translate(144, 250)">
                  <circle cx="0" cy="0" r="10" fill="#2C2C2A" />
                  <circle cx="0" cy="0" r="4" fill="#B4B2A9" />
                  <g className="wheel-rim-spin-fast">
                    <line x1="-8" y1="0" x2="8" y2="0" stroke="#B4B2A9" strokeWidth="1.5" />
                    <line x1="0" y1="-8" x2="0" y2="8" stroke="#B4B2A9" strokeWidth="1.5" />
                  </g>
                </g>
              </g>
            </g>
          </svg>
        )}

        {/* ======================================================== */}
        {/* PHASE 4: RETAILER ARRIVAL & STOP (GROUNDED, NO BOX EJECT)*/}
        {/* ======================================================== */}
        {phase === 4 && (
          <svg
            key="phase-4"
            viewBox="0 0 400 400"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <clipPath id="p4-arrival-clip">
                <rect x="0" y="0" width="400" height="400" rx="16" />
              </clipPath>
            </defs>

            <g clipPath="url(#p4-arrival-clip)">
              {/* Sky background */}
              <rect x="0" y="0" width="400" height="400" fill="#FBFBFA" />

              {/* Asphalt Road Surface & Retailer Sidewalk Curb */}
              <rect x="0" y="260" width="400" height="140" fill="#2C2C2A" />
              <line x1="0" y1="260" x2="400" y2="260" stroke="#5F5E5A" strokeWidth="2" />
              <rect x="230" y="254" width="170" height="10" fill="#D6D3D1" rx="1" />

              {/* Retailer Storefront (Right Side - Sleek Architectural, NO text) */}
              <g transform="translate(245, 114)">
                {/* Store Wall */}
                <rect x="0" y="20" width="145" height="122" fill="#EAE9E4" stroke="#D6D3D1" strokeWidth="1" />

                {/* Minimalist Crown Lintel (Clean charcoal header, no cheap text) */}
                <rect x="-4" y="10" width="153" height="20" fill="#2C2C2A" rx="2" />

                {/* Striped Orange & White Awning (#e65c00 & #FFFFFF) */}
                <g transform="translate(-6, 30)">
                  <polygon points="0,0 157,0 148,24 9,24" fill="#e65c00" />
                  {[20, 50, 80, 110, 140].map((x) => (
                    <polygon key={x} points={`${x},0 ${x + 14},0 ${x + 11},24 ${x - 3},24`} fill="#FFFFFF" />
                  ))}
                  <rect x="9" y="23" width="139" height="3" fill="#BA7517" />
                </g>

                {/* Illuminated Display Window */}
                <rect x="15" y="66" width="52" height="52" rx="3" fill="#FFEDD5" stroke="#FDBA74" strokeWidth="1" />
                <line x1="18" y1="74" x2="42" y2="108" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />

                {/* Glass Entrance Door */}
                <rect x="76" y="66" width="48" height="74" rx="2" fill="#2C2C2A" />
                <rect x="82" y="72" width="36" height="42" rx="1" fill="#FFEDD5" opacity="0.75" />
                <circle cx="83" cy="108" r="2.5" fill="#FEF08A" />
              </g>

              {/* ==================================================== */}
              {/* TRUCK BRAKES IN FRONT OF SHOP: HARDCODED AT Y = 260 */}
              {/* ONLY translateX ANIMATES - ZERO VERTICAL FLYING     */}
              {/* NO BOX EJECTED, WHEELS FULLY STOPPED                */}
              {/* ==================================================== */}
              <g className="p4-truck-arrival">
                {/* Truck Trailer in Orange #e65c00 (Sits on chassis at Y=240) */}
                <rect x="75" y="182" width="98" height="58" rx="4" fill="#e65c00" />
                <rect x="85" y="194" width="22" height="22" rx="2" fill="#FFEDD5" />
                <rect x="113" y="194" width="22" height="22" rx="2" fill="#FFEDD5" />
                <rect x="141" y="194" width="22" height="22" rx="2" fill="#FFEDD5" />

                {/* Truck Cab Front (Dark Orange #C2410C) */}
                <path d="M173 194 L199 194 L220 216 L220 240 L173 240 Z" fill="#C2410C" />
                <polygon points="197,198 213,216 189,216 189,198" fill="#FFEDD5" />
                <rect x="215" y="220" width="5" height="8" rx="1" fill="#FEF08A" />

                {/* Under-chassis rail */}
                <rect x="75" y="240" width="144" height="6" fill="#444441" />

                {/* Stationary Wheels: Firmly Grounded at Y=250 (Touched at 260) */}
                <g transform="translate(99, 250)">
                  <circle cx="0" cy="0" r="10" fill="#2C2C2A" />
                  <circle cx="0" cy="0" r="4" fill="#B4B2A9" />
                  <line x1="-8" y1="0" x2="8" y2="0" stroke="#B4B2A9" strokeWidth="1.5" />
                  <line x1="0" y1="-8" x2="0" y2="8" stroke="#B4B2A9" strokeWidth="1.5" />
                </g>
                <g transform="translate(143, 250)">
                  <circle cx="0" cy="0" r="10" fill="#2C2C2A" />
                  <circle cx="0" cy="0" r="4" fill="#B4B2A9" />
                  <line x1="-8" y1="0" x2="8" y2="0" stroke="#B4B2A9" strokeWidth="1.5" />
                  <line x1="0" y1="-8" x2="0" y2="8" stroke="#B4B2A9" strokeWidth="1.5" />
                </g>
                <g transform="translate(201, 250)">
                  <circle cx="0" cy="0" r="10" fill="#2C2C2A" />
                  <circle cx="0" cy="0" r="4" fill="#B4B2A9" />
                  <line x1="-8" y1="0" x2="8" y2="0" stroke="#B4B2A9" strokeWidth="1.5" />
                  <line x1="0" y1="-8" x2="0" y2="8" stroke="#B4B2A9" strokeWidth="1.5" />
                </g>
              </g>

              {/* Verified Delivered Checkmark Badge Pop */}
              <g transform="translate(295, 160)">
                <g className="p4-badge">
                  <circle cx="0" cy="0" r="23" fill="#e65c00" />
                  <circle cx="0" cy="0" r="28" fill="none" stroke="#FB923C" strokeWidth="2" strokeDasharray="4 2" />
                  <path d="M-9 0 L-2 7 L10 -5" fill="none" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
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