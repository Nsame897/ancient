import React from 'react';
import { Sliders, Palette, Wallpaper, Volume2, Type, Sparkles, X, Check } from 'lucide-react';
import { ThemeSettings } from '../../types/chatnova';
import { WALLPAPER_PRESETS } from '../../data/mockData';
import { soundFx } from '../../utils/audio';

interface ThemeCustomizerProps {
  theme: ThemeSettings;
  onUpdateTheme: (updated: Partial<ThemeSettings>) => void;
  onClose: () => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  theme,
  onUpdateTheme,
  onClose,
}) => {
  const presets = [
    { id: 'obsidian', name: 'Obsidian AMOLED', bg: 'bg-[#070709]', border: 'border-violet-500', desc: 'True Black for OLED batteries' },
    { id: 'violet', name: 'Cyber Violet', bg: 'bg-[#120826]', border: 'border-purple-500', desc: 'Deep violet glow aesthetic' },
    { id: 'cyan', name: 'Neon Cyan', bg: 'bg-[#061826]', border: 'border-cyan-500', desc: 'Electric terminal feel' },
    { id: 'emerald', name: 'Stealth Emerald', bg: 'bg-[#061a14]', border: 'border-emerald-500', desc: 'Matrix green minimal' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-lg max-h-[90vh] bg-[#0D0D12] border border-[#1E1E26] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E26] bg-[#070709]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Theme & Wallpaper Studio</h3>
              <p className="text-[11px] text-slate-400">Personalize your ChatNova experience</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
          {/* Section 1: AMOLED Preset Themes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Theme Presets (OLED Optimized)
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onUpdateTheme({ preset: p.id as any })}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                    theme.preset === p.id
                      ? 'border-violet-500 bg-[#161622] ring-1 ring-violet-500/30'
                      : 'border-[#1E1E26] bg-[#111116] hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white">{p.name}</span>
                    {theme.preset === p.id && <Check className="w-4 h-4 text-violet-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Chat Wallpapers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Wallpaper className="w-3.5 h-3.5" />
              Chat Background Wallpaper
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {WALLPAPER_PRESETS.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => onUpdateTheme({ wallpaperId: wp.id })}
                  className={`h-20 rounded-xl p-2.5 border text-left flex flex-col justify-end transition-all relative overflow-hidden cursor-pointer ${
                    theme.wallpaperId === wp.id
                      ? 'border-cyan-400 ring-2 ring-cyan-500/20'
                      : 'border-[#1E1E26] hover:border-slate-700'
                  }`}
                  style={wp.style}
                >
                  <span className="text-[11px] font-semibold text-white drop-shadow-md z-10">
                    {wp.name}
                  </span>
                  {theme.wallpaperId === wp.id && (
                    <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Typography Scaling */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              Message Font Size
            </h4>

            <div className="grid grid-cols-3 gap-2 p-3 bg-[#14141B] rounded-2xl border border-[#1E1E26]">
              {(['small', 'medium', 'large'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => onUpdateTheme({ fontSize: sz })}
                  className={`py-2 rounded-xl capitalize font-semibold transition-colors ${
                    theme.fontSize === sz
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-[#1C1C26] text-slate-400 hover:text-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Audio Notifications */}
          <div className="flex items-center justify-between p-3.5 bg-[#14141B] rounded-2xl border border-[#1E1E26]">
            <div className="space-y-0.5">
              <span className="font-semibold text-white block">Message Sounds</span>
              <p className="text-[11px] text-slate-400">
                Play subtle synthesizer pop when sending and receiving
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => soundFx.playReceived()}
                className="px-2.5 py-1 text-[11px] bg-[#1E1E28] hover:bg-[#2A2A38] text-cyan-300 rounded-lg"
              >
                Test Sound
              </button>
              <button
                onClick={() => onUpdateTheme({ soundEnabled: !theme.soundEnabled })}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  theme.soundEnabled ? 'bg-cyan-600' : 'bg-[#2A2A38]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    theme.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#070709] border-t border-[#1E1E26] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl cursor-pointer"
          >
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  );
};
