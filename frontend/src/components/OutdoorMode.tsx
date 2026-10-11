import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Clock, 
  Wrench, 
  SunMedium, 
  ArrowLeft, 
  Send, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import type { TaskItem } from '../types';

interface OutdoorModeProps {
  tasks: TaskItem[];
  onToggleTask: (taskId: string) => void;
  onExit: () => void;
  onAddJournalEntry: (plantName: string, note: string) => void;
}

export const OutdoorMode: React.FC<OutdoorModeProps> = ({
  tasks,
  onToggleTask,
  onExit,
  onAddJournalEntry,
}) => {
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [activeTaskIndex, setActiveTaskIndex] = useState<number>(0);
  const [quickNote, setQuickNote] = useState<string>('');
  const [noteFeedback, setNoteFeedback] = useState<string | null>(null);

  // Outdoor Timer
  const [seconds, setSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pendingTasks = tasks.filter((t) => !t.completed);
  const currentTask = pendingTasks[activeTaskIndex] || tasks[0] || null;

  const handleQuickNoteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!quickNote.trim()) return;

    onAddJournalEntry(currentTask ? currentTask.plantName : 'Outdoor Garden', quickNote.trim());
    setNoteFeedback('Note saved to Journal!');
    setQuickNote('');
    setTimeout(() => setNoteFeedback(null), 2500);
  };

  const handleToggleCurrent = () => {
    if (!currentTask) return;
    onToggleTask(currentTask.id);
  };

  return (
    <div className={`min-h-screen transition-colors p-4 sm:p-6 lg:p-8 flex flex-col justify-between ${
      highContrast 
        ? 'bg-black text-white font-sans' 
        : 'bg-forest-950 text-emerald-50'
    }`}>
      {/* Top Bar with Big Controls */}
      <div className="flex items-center justify-between gap-4 max-w-3xl mx-auto w-full pb-4 border-b border-forest-800/80">
        <button
          onClick={onExit}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-forest-900 border border-forest-700 hover:bg-forest-800 text-white font-bold text-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Exit Outdoor</span>
        </button>

        {/* Outdoor Timer Widget */}
        <div className="flex items-center space-x-2 bg-forest-900/90 border border-forest-700 px-3.5 py-1.5 rounded-2xl">
          <span className="font-mono text-lg font-bold text-amber-400">{formatTimer(seconds)}</span>
          <button
            onClick={() => setTimerRunning(!timerRunning)}
            className="p-1.5 rounded-xl hover:bg-forest-800 text-amber-300"
            title={timerRunning ? 'Pause' : 'Start Timer'}
          >
            {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => { setSeconds(0); setTimerRunning(false); }}
            className="p-1.5 rounded-xl hover:bg-forest-800 text-sage-400"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sunlight Boost Toggle */}
        <button
          onClick={() => setHighContrast(!highContrast)}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all ${
            highContrast
              ? 'bg-amber-400 text-black ring-2 ring-white'
              : 'bg-forest-900 border border-forest-700 text-amber-300'
          }`}
          title="Toggle High-Contrast Direct Sun Visibility"
        >
          <SunMedium className="w-4 h-4" />
          <span className="hidden sm:inline">Sun Boost</span>
        </button>
      </div>

      {/* Main Focus Area: Single Big Active Task */}
      <div className="my-auto max-w-2xl mx-auto w-full py-6 space-y-6">
        {currentTask ? (
          <div className={`rounded-3xl p-6 sm:p-8 border-2 transition-all shadow-elevated ${
            highContrast 
              ? 'bg-zinc-900 border-amber-400 text-white' 
              : 'bg-forest-900/80 border-forest-700 backdrop-blur-md'
          }`}>
            {/* Task Meta */}
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                highContrast ? 'bg-amber-400 text-black' : 'bg-forest-800 text-emerald-300'
              }`}>
                {currentTask.day} • {currentTask.plantName}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-amber-400">
                <Clock className="w-4 h-4" />
                {currentTask.estimatedMinutes} mins
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 leading-tight">
              {currentTask.title}
            </h2>

            {/* Big Instruction Text */}
            <div className={`p-5 rounded-2xl text-base sm:text-lg leading-relaxed mb-6 ${
              highContrast ? 'bg-black text-amber-100 border border-zinc-700' : 'bg-forest-950/70 text-emerald-100'
            }`}>
              {currentTask.instructions}
            </div>

            {/* Tools Required */}
            {currentTask.tools.length > 0 && (
              <div className="flex items-center space-x-2 mb-8 text-sm">
                <Wrench className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-zinc-400 font-medium">Tools:</span>
                <span className="font-bold text-white truncate">{currentTask.tools.join(', ')}</span>
              </div>
            )}

            {/* HUGE Glove-Friendly Complete Button */}
            <button
              onClick={handleToggleCurrent}
              className={`w-full py-6 rounded-2xl font-black text-xl sm:text-2xl flex items-center justify-center space-x-3 transition-transform active:scale-95 shadow-elevated ${
                currentTask.completed
                  ? 'bg-zinc-800 border-2 border-zinc-600 text-zinc-400'
                  : highContrast
                  ? 'bg-amber-400 text-black hover:bg-amber-300'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-forest-950'
              }`}
            >
              {currentTask.completed ? (
                <>
                  <Check className="w-8 h-8 stroke-[3]" />
                  <span>Completed! Tap to Undo</span>
                </>
              ) : (
                <>
                  <Check className="w-8 h-8 stroke-[4]" />
                  <span>DONE (Mark Finished)</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <h2 className="text-2xl sm:text-3xl font-bold">All garden tasks completed!</h2>
            <p className="text-sage-400 text-sm">You did an amazing job today. Go enjoy your plants!</p>
          </div>
        )}

        {/* Task Switcher Chips */}
        {pendingTasks.length > 1 && (
          <div className="flex items-center justify-center space-x-2 overflow-x-auto py-2">
            {pendingTasks.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setActiveTaskIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  idx === activeTaskIndex
                    ? 'bg-emerald-400 text-forest-950 ring-2 ring-white scale-105'
                    : 'bg-forest-900 border border-forest-700 text-sage-300'
                }`}
              >
                {t.plantName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Field Observation Scratchpad */}
      <div className="max-w-2xl mx-auto w-full pt-4 border-t border-forest-800/80">
        <form onSubmit={handleQuickNoteSubmit} className="relative flex items-center">
          <input
            type="text"
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            placeholder={noteFeedback || "Dirt observation note... (e.g. pruned 2 leaves)"}
            className={`w-full py-3.5 pl-4 pr-14 rounded-2xl text-sm border focus:outline-none ${
              highContrast
                ? 'bg-black text-white border-zinc-700 placeholder:text-zinc-500 focus:border-amber-400'
                : 'bg-forest-900/90 text-white border-forest-700 placeholder:text-sage-400 focus:border-emerald-400'
            }`}
          />
          <button
            type="submit"
            disabled={!quickNote.trim()}
            className="absolute right-2 p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-forest-950 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
