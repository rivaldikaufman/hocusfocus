import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Moon, Sun } from 'lucide-react';

export default function MetronomeApp() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(80);
  const [volume, setVolume] = useState(0.5);
  const [soundType, setSoundType] = useState('click');
  const [beatCount, setBeatCount] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const volumeRef = useRef(volume);

  // Keep volumeRef in sync with volume state
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  const presets = [
    { name: 'Slow Focus', bpm: 60, desc: 'Deep work' },
    { name: 'Medium Focus', bpm: 80, desc: 'Normal productivity' },
    { name: 'Fast Focus', bpm: 120, desc: 'Sprint sessions' }
  ];

  const sounds = [
    { id: 'click', name: 'Classic Click' },
    { id: 'wood', name: 'Wood Block' },
    { id: 'beep', name: 'Digital Beep' },
    { id: 'tick', name: 'Soft Tick' }
  ];

  // Initialize Audio Context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Wake Lock for background audio on mobile
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        console.log('Wake Lock activated');
      }
    } catch (err) {
      console.log('Wake Lock error:', err);
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
      console.log('Wake Lock released');
    }
  };

  const playSound = () => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Resume audio context if suspended (for mobile)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
    const currentVolume = volumeRef.current;

    switch (soundType) {
      case 'click':
        oscillator.frequency.value = 1000;
        gainNode.gain.setValueAtTime(0.3 * currentVolume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        break;
      case 'wood':
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.4 * currentVolume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        break;
      case 'beep':
        oscillator.frequency.value = 1200;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2 * currentVolume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        break;
      case 'tick':
        oscillator.frequency.value = 600;
        gainNode.gain.setValueAtTime(0.15 * currentVolume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
        break;
    }

    oscillator.start(now);
    oscillator.stop(now + 0.1);
    setBeatCount(prev => prev + 1);
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / bpm) * 1000;
      playSound();
      // Using window.setInterval to avoid NodeJS/DOM timer confusion in TS
      intervalRef.current = window.setInterval(playSound, interval);
      requestWakeLock(); // Keep screen awake on mobile
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      releaseWakeLock(); // Release wake lock when stopped
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, bpm, soundType]);

  const togglePlay = () => {
    // Resume audio context on user interaction (required for mobile)
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setBeatCount(0);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const bgGradient = darkMode
    ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50';

  const cardBg = darkMode ? 'bg-white/10' : 'bg-white/80';
  const textPrimary = darkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = darkMode ? 'text-purple-300' : 'text-purple-600';
  const borderColor = darkMode ? 'border-white/20' : 'border-purple-200';
  const beatIndicatorActive = darkMode ? 'bg-purple-500' : 'bg-purple-600';
  const beatIndicatorInactive = darkMode ? 'bg-purple-500/30' : 'bg-purple-200';

  return (
    <div className={`min-h-screen ${bgGradient} flex items-center justify-center p-4 transition-colors duration-500`}>
      <div className="w-full max-w-2xl">

        {/* Header with Dark Mode Toggle */}
        <div className="text-center mb-8 relative">
          <button
            onClick={toggleDarkMode}
            className={`absolute right-0 top-0 p-3 rounded-full ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-purple-100 hover:bg-purple-200'} transition-all`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-300" />
            ) : (
              <Moon className="w-5 h-5 text-purple-600" />
            )}
          </button>
          <h1 className={`text-4xl font-bold ${textPrimary} mb-2`}>HocusFocus</h1>
          <p className={textSecondary}>Made By AwPetrik</p>
        </div>

        {/* Main Card */}
        <div className={`${cardBg} backdrop-blur-lg rounded-3xl p-8 shadow-2xl border ${borderColor} transition-colors duration-500`}>

          {/* BPM Display with Visual Indicator */}
          <div className="text-center mb-8">
            <div className={`inline-block w-24 h-24 rounded-full mb-4 transition-all duration-100 ${isPlaying && beatCount % 2 === 0
              ? `${beatIndicatorActive} scale-110 shadow-lg ${darkMode ? 'shadow-purple-500/50' : 'shadow-purple-600/50'}`
              : beatIndicatorInactive
              }`}></div>
            <div className={`text-7xl font-bold ${textPrimary} mb-2`}>{bpm}</div>
            <div className={`${textSecondary} text-lg`}>BPM</div>
          </div>

          {/* Play/Pause Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={togglePlay}
              className={`w-20 h-20 rounded-full ${darkMode
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-purple-500/50'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-600/30'
                } flex items-center justify-center shadow-lg transition-all hover:scale-105`}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" fill="white" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" fill="white" />
              )}
            </button>
          </div>

          {/* BPM Slider */}
          <div className="mb-8">
            <input
              type="range"
              min="40"
              max="200"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className={`w-full h-2 ${darkMode ? 'bg-white/20' : 'bg-purple-200'} rounded-lg appearance-none cursor-pointer accent-purple-500`}
            />
            <div className={`flex justify-between ${textSecondary} text-sm mt-2`}>
              <span>40</span>
              <span>200</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setBpm(preset.bpm)}
                className={`p-4 rounded-xl transition-all ${bpm === preset.bpm
                  ? darkMode
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : darkMode
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-white/60 text-slate-900 hover:bg-white/80'
                  }`}
              >
                <div className="font-semibold text-sm">{preset.name}</div>
                <div className="text-xs opacity-80 mt-1">{preset.desc}</div>
                <div className="text-lg font-bold mt-1">{preset.bpm}</div>
              </button>
            ))}
          </div>

          {/* Sound Selection */}
          <div>
            <div className={`flex items-center gap-2 ${textPrimary} mb-3`}>
              <Volume2 className="w-5 h-5" />
              <span className="font-semibold">Sound Type</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {sounds.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => setSoundType(sound.id)}
                  className={`p-3 rounded-lg transition-all text-sm ${soundType === sound.id
                    ? darkMode
                      ? 'bg-pink-500 text-white'
                      : 'bg-pink-600 text-white'
                    : darkMode
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-white/60 text-slate-900 hover:bg-white/80'
                    }`}
                >
                  {sound.name}
                </button>
              ))}
            </div>
          </div>

          {/* Volume Slider */}
          <div className="mt-8">
            <div className={`flex items-center gap-2 ${textPrimary} mb-3`}>
              {volume === 0 ? <Volume2 className="w-5 h-5 opacity-50" /> : <Volume2 className="w-5 h-5" />}
              <span className="font-semibold">Volume</span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className={`w-full h-2 ${darkMode ? 'bg-white/20' : 'bg-purple-200'} rounded-lg appearance-none cursor-pointer accent-purple-500`}
              />
              <span className={`${textSecondary} text-sm w-8 text-right`}>{Math.round(volume * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Footer tip */}
        <div className={`text-center mt-6 ${textSecondary} text-sm`}>
          💡 Tip: Use headphones for better focus
        </div>
      </div>
    </div>
  );
}
