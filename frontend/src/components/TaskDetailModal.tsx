import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Clock, 
  Wrench, 
  BookMarked, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import type { TaskItem } from '../types';

interface TaskDetailModalProps {
  task: TaskItem | null;
  onClose: () => void;
  onToggleTask: (taskId: string) => void;
  onSaveObservation: (taskId: string, note: string) => void;
  onAddJournalEntry: (plantName: string, note: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
  onToggleTask,
  onSaveObservation,
  onAddJournalEntry,
}) => {
  if (!task) return null;

  const [note, setNote] = useState<string>(task.observation || '');
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const handleSave = () => {
    onSaveObservation(task.id, note);
    setSavedFeedback('Observation saved to task!');
    setTimeout(() => setSavedFeedback(null), 2500);
  };

  const handleCreateJournal = () => {
    if (!note.trim()) return;
    onAddJournalEntry(task.plantName, note);
    setSavedFeedback('Added to Gardening Journal!');
    setTimeout(() => setSavedFeedback(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-earth-50 rounded-3xl border border-sage-200 shadow-elevated overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-sage-200 flex items-start justify-between bg-white/60">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-forest-100 text-forest-800">
                {task.day}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-sage-200 text-sage-800">
                {task.plantName}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 capitalize">
                {task.category.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold text-forest-950">
              {task.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-sage-200 text-sage-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-white border border-sage-200">
              <Clock className="w-4 h-4 text-forest-600" />
              <div>
                <span className="text-sage-500 block">Estimated Time</span>
                <span className="font-bold text-forest-900">{task.estimatedMinutes} minutes</span>
              </div>
            </div>
            <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-white border border-sage-200">
              <Wrench className="w-4 h-4 text-forest-600" />
              <div>
                <span className="text-sage-500 block">Tools Needed</span>
                <span className="font-bold text-forest-900 truncate block max-w-[120px]">
                  {task.tools.length > 0 ? task.tools.join(', ') : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900">
              Step-by-Step Instructions
            </h3>
            <div className="p-4 rounded-2xl bg-white border border-sage-200 text-sm text-forest-900 leading-relaxed">
              {task.instructions}
            </div>
          </div>

          {/* Botanical Care Tip */}
          <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 text-xs sm:text-sm text-forest-900 space-y-1">
            <span className="font-bold text-forest-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-forest-600" />
              Botanical Care Tip
            </span>
            <p className="leading-relaxed text-sage-800">{task.careTips}</p>
          </div>

          {/* Observation Logger */}
          <div className="space-y-2 pt-2 border-t border-sage-200">
            <label className="text-xs font-bold uppercase tracking-wider text-forest-900 flex items-center justify-between">
              <span>Record Garden Observation</span>
              {savedFeedback && (
                <span className="text-emerald-700 font-semibold normal-case flex items-center gap-1">
                  <Check className="w-3 h-3" /> {savedFeedback}
                </span>
              )}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Record soil dampness, new shoots, bug sightings, or weather notes..."
              rows={3}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
            />
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="px-3 py-1.5 rounded-lg bg-sage-200 hover:bg-sage-300 text-forest-900 text-xs font-semibold transition-colors"
              >
                Save to Task
              </button>
              {note.trim() && (
                <button
                  type="button"
                  onClick={handleCreateJournal}
                  className="px-3 py-1.5 rounded-lg bg-forest-100 hover:bg-forest-200 text-forest-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <BookMarked className="w-3 h-3" />
                  <span>Log in Journal</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white/80 border-t border-sage-200 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onToggleTask(task.id);
            }}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-soft active:scale-95 ${
              task.completed
                ? 'bg-sage-200 text-forest-900 hover:bg-sage-300'
                : 'bg-emerald-700 hover:bg-emerald-600 text-white'
            }`}
          >
            {task.completed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Mark as Incomplete</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Mark Task as Completed</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-xl border border-sage-300 hover:bg-sage-100 text-sage-700 font-medium text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
