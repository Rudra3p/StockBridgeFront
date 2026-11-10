'use client';

import { useState, useEffect } from 'react';

export interface ColorTheme {
  id: string;
  name: string;
  description: string;
  // 60% Dominant (Canvas & Background Family)
  canvas: string;          // Main page background
  canvasSubtle: string;    // Section backgrounds (in same color family)
  canvasCard: string;      // Card / Container background
  canvasMuted: string;     // Gray block / canvas placeholder
  // 30% Secondary (Typography & Structural Family)
  textMain: string;        // Headings & primary text
  textBody: string;        // Paragraphs & reading text
  textMuted: string;       // Subtle metadata & captions
  borderSubtle: string;    // Borders & dividers
  // 10% Accent (High-Impact Brand Green & Focus)
  accentMain: string;      // "Factory Surplus" highlight & primary button
  accentHover: string;     // Hover state
  accentLight: string;     // Pill badges & highlight backgrounds
  accentBorder: string;    // Border around accent badges
  accentContrast: string;  // Text on accent button
}

export const PRESET_THEMES: ColorTheme[] = [
  {
    id: 'stockbridge-orange',
    name: '1. StockBridge Signature (Orange & Pure Black)',
    description: 'Your chosen 60-30-10 palette (60% White/Slate-50, 30% Pure Black/Charcoal, 10% Vibrant Orange)',
    canvas: '#ffffff',
    canvasSubtle: '#f8fafc',
    canvasCard: '#ffffff',
    canvasMuted: '#f1f5f9',
    textMain: '#000000',
    textBody: '#333333',
    textMuted: '#666666',
    borderSubtle: '#e2e8f0',
    accentMain: '#e65c00',
    accentHover: '#cc5200',
    accentLight: '#fff7ed',
    accentBorder: '#fed7aa',
    accentContrast: '#ffffff',
  },
  {
    id: 'forest-ivory',
    name: '2. Deep Forest & Warm Ivory',
    description: 'Institutional trust & financial heritage (60% Warm Ivory/Sand, 30% Deep Stone, 10% Forest Green)',
    canvas: '#faf8f5',
    canvasSubtle: '#f3efea',
    canvasCard: '#ffffff',
    canvasMuted: '#e7e2d8',
    textMain: '#1c1917',
    textBody: '#57534e',
    textMuted: '#78716c',
    borderSubtle: '#e7e5e4',
    accentMain: '#15803d',
    accentHover: '#166534',
    accentLight: '#f0fdf4',
    accentBorder: '#bbf7d0',
    accentContrast: '#ffffff',
  },
  {
    id: 'nordic-zinc',
    name: '3. Vibrant Jade & Nordic Zinc',
    description: 'Modern tech-forward architecture (60% Zinc-50/100, 30% Pure Zinc, 10% Jade Emerald)',
    canvas: '#fafafa',
    canvasSubtle: '#f4f4f5',
    canvasCard: '#ffffff',
    canvasMuted: '#e4e4e7',
    textMain: '#18181b',
    textBody: '#52525b',
    textMuted: '#71717a',
    borderSubtle: '#e4e4e7',
    accentMain: '#059669',
    accentHover: '#047857',
    accentLight: '#ecfdf5',
    accentBorder: '#a7f3d0',
    accentContrast: '#ffffff',
  },
  {
    id: 'british-ice',
    name: '4. British Pine & Cool Ice',
    description: 'Private wealth & banking clarity (60% Cool Ice/Glacier, 30% Midnight Navy, 10% Deep British Pine)',
    canvas: '#f8fafc',
    canvasSubtle: '#edf2f7',
    canvasCard: '#ffffff',
    canvasMuted: '#cbd5e1',
    textMain: '#0b132b',
    textBody: '#3a506b',
    textMuted: '#5c677d',
    borderSubtle: '#cbd5e1',
    accentMain: '#0d6e4f',
    accentHover: '#094c37',
    accentLight: '#e6f7f0',
    accentBorder: '#a3e6cb',
    accentContrast: '#ffffff',
  },
  {
    id: 'electric-charcoal',
    name: '5. Electric Mint & Cyber Charcoal',
    description: 'High-contrast venture trade (60% Crisp White/Gray-100, 30% Charcoal-900, 10% High-Energy Mint)',
    canvas: '#ffffff',
    canvasSubtle: '#f3f4f6',
    canvasCard: '#ffffff',
    canvasMuted: '#e5e7eb',
    textMain: '#111827',
    textBody: '#4b5563',
    textMuted: '#6b7280',
    borderSubtle: '#e5e7eb',
    accentMain: '#10b981',
    accentHover: '#059669',
    accentLight: '#ecfdf5',
    accentBorder: '#6ee7b7',
    accentContrast: '#ffffff',
  },
];

export default function ColorStudio() {
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(PRESET_THEMES[0]);
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  // Apply theme to document CSS variables in real time
  const applyTheme = (theme: ColorTheme) => {
    const root = document.documentElement;
    root.style.setProperty('--color-canvas', theme.canvas);
    root.style.setProperty('--color-canvas-subtle', theme.canvasSubtle);
    root.style.setProperty('--color-canvas-card', theme.canvasCard);
    root.style.setProperty('--color-canvas-muted', theme.canvasMuted);

    root.style.setProperty('--color-text-main', theme.textMain);
    root.style.setProperty('--color-text-body', theme.textBody);
    root.style.setProperty('--color-text-muted', theme.textMuted);
    root.style.setProperty('--color-border-subtle', theme.borderSubtle);

    root.style.setProperty('--color-accent-main', theme.accentMain);
    root.style.setProperty('--color-accent-hover', theme.accentHover);
    root.style.setProperty('--color-accent-light', theme.accentLight);
    root.style.setProperty('--color-accent-border', theme.accentBorder);
    root.style.setProperty('--color-accent-contrast', theme.accentContrast);
  };

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Handle manual color picker changes
  const handleColorChange = (key: keyof ColorTheme, value: string) => {
    const updated = { ...currentTheme, [key]: value };
    setCurrentTheme(updated);
    applyTheme(updated);
  };

  const copyCssVariables = () => {
    const css = `:root {
  /* 60% Dominant (Canvas & Background Family) */
  --color-canvas: ${currentTheme.canvas};
  --color-canvas-subtle: ${currentTheme.canvasSubtle};
  --color-canvas-card: ${currentTheme.canvasCard};
  --color-canvas-muted: ${currentTheme.canvasMuted};

  /* 30% Secondary (Typography & Structural Family) */
  --color-text-main: ${currentTheme.textMain};
  --color-text-body: ${currentTheme.textBody};
  --color-text-muted: ${currentTheme.textMuted};
  --color-border-subtle: ${currentTheme.borderSubtle};

  /* 10% Accent (High-Impact Brand Green Family) */
  --color-accent-main: ${currentTheme.accentMain};
  --color-accent-hover: ${currentTheme.accentHover};
  --color-accent-light: ${currentTheme.accentLight};
  --color-accent-border: ${currentTheme.accentBorder};
  --color-accent-contrast: ${currentTheme.accentContrast};
}`;
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        
        {/* Top Toggle Strip */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 font-quicksand">
                60-30-10 Color Rule Studio
              </span>
              <span className="text-[11px] text-slate-500 hidden md:inline">
                (60% Canvas & Family Backgrounds • 30% Typography & Borders • 10% Accent Green)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyCssVariables}
              className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1"
            >
              {copied ? '✓ Copied CSS!' : '📋 Copy CSS'}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              {isOpen ? 'Close Studio ▲' : 'Open Palette Studio ▼'}
            </button>
          </div>
        </div>

        {/* Studio Content Panel */}
        {isOpen && (
          <div className="mt-3 pt-3 border-t border-slate-200 space-y-4 text-xs font-quicksand">
            
            {/* Visual 60-30-10 Meter */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm border border-slate-300" style={{ backgroundColor: currentTheme.canvasSubtle }} />
                  60% Dominant Canvas ({currentTheme.canvasSubtle})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm border border-slate-400" style={{ backgroundColor: currentTheme.textMain }} />
                  30% Hierarchy & Text ({currentTheme.textMain})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: currentTheme.accentMain }} />
                  10% Accent Green ({currentTheme.accentMain})
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full overflow-hidden flex border border-slate-200 shadow-inner">
                <div className="w-[60%] h-full transition-all duration-300" style={{ backgroundColor: currentTheme.canvasSubtle }} title="60% Background & Section Family" />
                <div className="w-[30%] h-full transition-all duration-300" style={{ backgroundColor: currentTheme.textMain }} title="30% Typography & Borders" />
                <div className="w-[10%] h-full transition-all duration-300" style={{ backgroundColor: currentTheme.accentMain }} title="10% Accent Brand Green" />
              </div>
            </div>

            {/* Presets Row */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-2">
              <span className="font-bold text-slate-900 min-w-[130px]">
                Curated Presets:
              </span>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {PRESET_THEMES.map((theme) => {
                  const isSelected = currentTheme.id === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setCurrentTheme(theme)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs ring-2 ring-slate-900 ring-offset-1'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-0.5">
                        <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ backgroundColor: theme.canvasSubtle }} />
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.textMain }} />
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.accentMain }} />
                      </span>
                      <span>{theme.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Manual Color Customizer Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/80">
              
              {/* 60% Controls */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">60% Canvas & Sections</span>
                  <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                    Dominant
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[11px] text-slate-600">Base Canvas:</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={currentTheme.canvas}
                      onChange={(e) => handleColorChange('canvas', e.target.value)}
                      className="w-6 h-6 rounded border border-slate-300 cursor-pointer"
                    />
                    <span className="font-mono text-[11px] text-slate-500 uppercase">{currentTheme.canvas}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[11px] text-slate-600">Section Tint (Family):</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={currentTheme.canvasSubtle}
                      onChange={(e) => handleColorChange('canvasSubtle', e.target.value)}
                      className="w-6 h-6 rounded border border-slate-300 cursor-pointer"
                    />
                    <span className="font-mono text-[11px] text-slate-500 uppercase">{currentTheme.canvasSubtle}</span>
                  </div>
                </div>
              </div>

              {/* 30% Controls */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">30% Typography & Structure</span>
                  <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                    Secondary
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[11px] text-slate-600">Headings Text:</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={currentTheme.textMain}
                      onChange={(e) => handleColorChange('textMain', e.target.value)}
                      className="w-6 h-6 rounded border border-slate-300 cursor-pointer"
                    />
                    <span className="font-mono text-[11px] text-slate-500 uppercase">{currentTheme.textMain}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[11px] text-slate-600">Paragraphs Text:</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={currentTheme.textBody}
                      onChange={(e) => handleColorChange('textBody', e.target.value)}
                      className="w-6 h-6 rounded border border-slate-300 cursor-pointer"
                    />
                    <span className="font-mono text-[11px] text-slate-500 uppercase">{currentTheme.textBody}</span>
                  </div>
                </div>
              </div>

              {/* 10% Controls */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">10% Accent Green</span>
                  <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Accent
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[11px] text-slate-600">Primary Green:</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={currentTheme.accentMain}
                      onChange={(e) => handleColorChange('accentMain', e.target.value)}
                      className="w-6 h-6 rounded border border-slate-300 cursor-pointer"
                    />
                    <span className="font-mono text-[11px] text-slate-500 uppercase">{currentTheme.accentMain}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[11px] text-slate-600">Badge Tint (Light):</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={currentTheme.accentLight}
                      onChange={(e) => handleColorChange('accentLight', e.target.value)}
                      className="w-6 h-6 rounded border border-slate-300 cursor-pointer"
                    />
                    <span className="font-mono text-[11px] text-slate-500 uppercase">{currentTheme.accentLight}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}
