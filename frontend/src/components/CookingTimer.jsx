'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, Bell, Flame, Timer, Volume2 } from 'lucide-react';

export default function CookingTimer({ isOpen, onClose, initialMinutes = 10 }) {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef(null);

  // Sync initial minutes when opened
  useEffect(() => {
    if (isOpen) {
      setTotalSeconds(initialMinutes * 60);
      setTimeLeft(initialMinutes * 60);
      setIsRunning(false);
      setIsFinished(false);
    }
  }, [isOpen, initialMinutes]);

  // Audio tone generator using Web Audio API
  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const playBeep = (freq, delay, dur) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + dur);
      };
      // 3 pleasant bell beeps
      playBeep(587.33, 0, 0.2); // D5
      playBeep(880.0, 0.25, 0.2); // A5
      playBeep(1174.66, 0.5, 0.4); // D6
    } catch (e) {
      console.warn('Audio tone not supported', e);
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setIsFinished(true);
            playAlertSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleSetPreset = (minutes) => {
    setIsRunning(false);
    setIsFinished(false);
    setTotalSeconds(minutes * 60);
    setTimeLeft(minutes * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(totalSeconds);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Kitchen Companion</h3>
                <p className="text-xs text-slate-400 font-medium">Smart Countdown Cooking Timer</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Timer Display */}
          <div className="py-8 flex flex-col items-center justify-center space-y-4">
            <div className="text-6xl sm:text-7xl font-mono font-black tracking-tight text-slate-900 dark:text-white">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isFinished
                    ? 'bg-emerald-500'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500'
                }`}
                style={{ width: `${Math.min(100, progressPercent)}%` }}
              />
            </div>

            {isFinished && (
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm animate-bounce">
                <Bell className="w-4 h-4" />
                <span>Timer complete! Dish is ready for the next step.</span>
              </div>
            )}
          </div>

          {/* Quick Presets */}
          <div className="space-y-2 pb-6">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Quick Timer Presets
            </p>
            <div className="grid grid-cols-5 gap-2">
              {[1, 5, 10, 15, 20].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleSetPreset(mins)}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    totalSeconds === mins * 60
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/25 transition-transform hover:scale-[1.02]"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause Timer</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>{timeLeft === 0 ? 'Restart Timer' : 'Start Timer'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="p-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl transition-colors font-bold flex items-center justify-center"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
