import React, { useState } from 'react';
import { Lock, Fingerprint, Delete, ShieldAlert } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface AppLockScreenProps {
  correctPin: string;
  onUnlock: () => void;
}

export const AppLockScreen: React.FC<AppLockScreenProps> = ({ correctPin, onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      soundFx.playPop();
      const newPin = pin + digit;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        if (newPin === correctPin) {
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 800);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((p) => p.slice(0, -1));
    setError(false);
  };

  const handleBiometricSim = () => {
    soundFx.playReceived();
    onUnlock();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070709] flex flex-col items-center justify-between p-8 safe-area-pb animate-in fade-in">
      {/* Top Header */}
      <div className="text-center space-y-2 mt-8">
        <div className="w-16 h-16 rounded-3xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto shadow-2xl">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">ChatNova is Locked</h2>
        <p className="text-xs text-slate-400">Enter your 4-digit security PIN</p>
      </div>

      {/* PIN Dots */}
      <div className="flex items-center gap-4 my-8">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all ${
              error
                ? 'bg-rose-500 scale-110'
                : i < pin.length
                ? 'bg-violet-500 scale-110 shadow-lg shadow-violet-500/50'
                : 'bg-[#1E1E28]'
            }`}
          />
        ))}
      </div>

      {error && (
        <span className="text-xs font-semibold text-rose-400 -mt-4 animate-bounce">
          Incorrect PIN. Try again.
        </span>
      )}

      {/* Keypad */}
      <div className="w-full max-w-xs grid grid-cols-3 gap-4 mb-4">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigit(digit)}
            className="w-18 h-18 mx-auto rounded-full bg-[#121218] hover:bg-[#1A1A24] text-white text-xl font-bold transition-all active:scale-90 flex items-center justify-center border border-[#1E1E26] shadow-md cursor-pointer"
          >
            {digit}
          </button>
        ))}

        {/* Biometrics */}
        <button
          onClick={handleBiometricSim}
          className="w-18 h-18 mx-auto rounded-full bg-[#121218] hover:bg-violet-950/40 text-violet-400 text-sm font-semibold transition-all active:scale-90 flex items-center justify-center border border-[#1E1E26] cursor-pointer"
          title="Simulate Biometric FaceID / TouchID"
        >
          <Fingerprint className="w-6 h-6" />
        </button>

        {/* Zero */}
        <button
          onClick={() => handleDigit('0')}
          className="w-18 h-18 mx-auto rounded-full bg-[#121218] hover:bg-[#1A1A24] text-white text-xl font-bold transition-all active:scale-90 flex items-center justify-center border border-[#1E1E26] shadow-md cursor-pointer"
        >
          0
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="w-18 h-18 mx-auto rounded-full bg-[#121218] hover:bg-[#1A1A24] text-slate-400 hover:text-white transition-all active:scale-90 flex items-center justify-center border border-[#1E1E26] cursor-pointer"
          title="Backspace"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>

      {/* Hint */}
      <div className="text-[11px] text-slate-500 font-mono text-center">
        Tip: Default seed PIN is <strong className="text-slate-300">1234</strong> or tap fingerprint icon.
      </div>
    </div>
  );
};
