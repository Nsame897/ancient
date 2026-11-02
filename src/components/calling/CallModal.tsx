import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, VolumeX, Shield, Sparkles } from 'lucide-react';
import { soundFx } from '../../utils/audio';

interface CallModalProps {
  contactName: string;
  contactAvatar: string;
  callType: 'voice' | 'video';
  onEndCall: (durationSeconds: number) => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  contactName,
  contactAvatar,
  callType,
  onEndCall,
}) => {
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected'>('ringing');
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // Ringtone and duration counter
  useEffect(() => {
    const stopRinging = soundFx.startRinging();

    // Answer after 3.2 seconds
    const connectTimer = setTimeout(() => {
      stopRinging();
      setCallStatus('connected');
    }, 3200);

    return () => {
      stopRinging();
      clearTimeout(connectTimer);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setDurationSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070709] flex flex-col justify-between p-6 animate-in fade-in">
      {/* Top Bar: Encryption status & timer */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2 bg-[#121218] px-3 py-1.5 rounded-full border border-[#1E1E26]">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] text-slate-200">End-to-End Encrypted (SRTP/DTLS)</span>
        </div>

        <div className="font-mono text-sm font-bold text-cyan-400">
          {callStatus === 'ringing' ? 'Ringing...' : formatTimer(durationSeconds)}
        </div>
      </div>

      {/* Main Center Area: Avatar or Simulated Video */}
      <div className="flex-1 flex flex-col items-center justify-center my-6 relative">
        {callType === 'video' && callStatus === 'connected' && isVideoEnabled ? (
          <div className="w-full max-w-lg h-72 sm:h-96 rounded-3xl bg-gradient-to-br from-violet-950/60 via-slate-900 to-indigo-950/80 border border-[#22222E] relative overflow-hidden flex items-center justify-center shadow-2xl">
            {/* Simulated Remote Peer Video Feed */}
            <div className="text-center space-y-3 z-10">
              <img
                src={contactAvatar}
                alt={contactName}
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-violet-500/40 shadow-xl"
              />
              <span className="text-base font-bold text-white block">{contactName}</span>
              <span className="text-xs text-cyan-400 font-mono">1080p 60fps · WebRTC Stream</span>
            </div>

            {/* Simulated Local Self-Preview Window in Corner */}
            <div className="absolute top-4 right-4 w-28 h-36 rounded-2xl bg-black/80 border border-white/20 p-2 flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-[10px] text-slate-300 font-medium">You</span>
              <span className="text-[9px] text-emerald-400 font-mono mt-1">Camera ON</span>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            {/* Caller Avatar with Pulse Ring */}
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-violet-500/50 shadow-2xl shadow-violet-500/20">
                <img
                  src={contactAvatar}
                  alt={contactName}
                  className="w-full h-full object-cover"
                />
              </div>
              {callStatus === 'ringing' && (
                <span className="absolute inset-0 rounded-3xl border-2 border-cyan-400 animate-ping opacity-60" />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">{contactName}</h3>
              <p className="text-xs text-slate-400">
                {callStatus === 'ringing'
                  ? 'Calling mobile device...'
                  : `ChatNova ${callType === 'video' ? 'Video' : 'Voice'} Call`}
              </p>
            </div>

            {/* Audio Waveform Simulator */}
            {callStatus === 'connected' && (
              <div className="flex items-center justify-center gap-1 h-8 pt-2">
                {[30, 60, 90, 45, 80, 100, 70, 50, 85, 40].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-cyan-400 rounded-full animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDelay: `${i * 100}ms`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Call Controls Bar */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 pb-4">
        {/* Mute Mic */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isMuted
              ? 'bg-rose-950/60 text-rose-400 border border-rose-800'
              : 'bg-[#14141B] text-slate-200 hover:bg-[#1E1E28]'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* Video Toggle */}
        <button
          onClick={() => setIsVideoEnabled(!isVideoEnabled)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            !isVideoEnabled
              ? 'bg-rose-950/60 text-rose-400 border border-rose-800'
              : 'bg-[#14141B] text-slate-200 hover:bg-[#1E1E28]'
          }`}
          title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </button>

        {/* Speaker Toggle */}
        <button
          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            !isSpeakerOn
              ? 'bg-slate-800 text-slate-400'
              : 'bg-[#14141B] text-cyan-400 hover:bg-[#1E1E28]'
          }`}
          title={isSpeakerOn ? 'Speaker ON' : 'Speaker OFF'}
        >
          {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>

        {/* End Call Button */}
        <button
          onClick={() => onEndCall(durationSeconds)}
          className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 active:scale-95 transition-all cursor-pointer"
          title="End Call"
        >
          <PhoneOff className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};
