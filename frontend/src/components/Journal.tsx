import React, { useState } from 'react';
import { 
  BookMarked, 
  Plus, 
  Trash2, 
  Calendar, 
  Sprout, 
  CloudSun, 
  X
} from 'lucide-react';
import type { JournalEntry } from '../types';
import type { MyPlantRecord } from '../db';

interface JournalProps {
  entries: JournalEntry[];
  myPlants: MyPlantRecord[];
  onAddEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export const Journal: React.FC<JournalProps> = ({
  entries,
  myPlants,
  onAddEntry,
  onDeleteEntry,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filterPlant, setFilterPlant] = useState<string>('all');
  const [filterMood, setFilterMood] = useState<string>('all');

  // New entry form state
  const [selectedPlantId, setSelectedPlantId] = useState<string>('');
  const [mood, setMood] = useState<'thriving' | 'healthy' | 'struggling' | 'recovering'>('healthy');
  const [weather, setWeather] = useState<string>('Sunny, 22°C');
  const [actionTaken, setActionTaken] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const moodBadges: Record<string, { label: string; color: string; icon: string }> = {
    thriving: { label: 'Thriving', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: '🌟' },
    healthy: { label: 'Healthy', color: 'bg-green-100 text-green-800 border-green-200', icon: '🌿' },
    recovering: { label: 'Recovering', color: 'bg-sky-100 text-sky-800 border-sky-200', icon: '🌱' },
    struggling: { label: 'Needs Attention', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: '🍂' },
  };

  const filteredEntries = entries.filter((e) => {
    if (filterPlant !== 'all' && e.plantId !== filterPlant) return false;
    if (filterMood !== 'all' && e.mood !== filterMood) return false;
    return true;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!notes.trim()) return;

    const matchedPlant = myPlants.find((p) => p.plantId === selectedPlantId || p.name === selectedPlantId);

    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      createdAt: new Date().toISOString(),
      plantId: matchedPlant ? matchedPlant.plantId : (selectedPlantId || undefined),
      plantName: matchedPlant ? matchedPlant.name : (selectedPlantId || 'General Garden'),
      mood,
      weather: weather.trim() || undefined,
      actionTaken: actionTaken.trim() || undefined,
      notes: notes.trim(),
    };

    onAddEntry(newEntry);
    setIsModalOpen(false);

    // Reset form
    setNotes('');
    setActionTaken('');
    setSelectedPlantId('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-earth-50 rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-900">
              Gardening Journal
            </h1>
            <p className="text-sm text-sage-600 max-w-xl">
              Track growth milestones, pest occurrences, weather reactions, and care observations over time.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-shrink-0 flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-600 text-white font-medium shadow-soft text-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Observation</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-3 pt-2 border-t border-sage-200 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="text-sage-500 font-medium">Filter by Plant:</span>
            <select
              value={filterPlant}
              onChange={(e) => setFilterPlant(e.target.value)}
              className="p-1.5 rounded-lg border border-sage-300 bg-white text-forest-900 font-medium"
            >
              <option value="all">All Garden Plants</option>
              {myPlants.map((p) => (
                <option key={p.plantId} value={p.plantId}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-sage-500 font-medium">Plant Health:</span>
            <select
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
              className="p-1.5 rounded-lg border border-sage-300 bg-white text-forest-900 font-medium"
            >
              <option value="all">All Conditions</option>
              <option value="thriving">Thriving</option>
              <option value="healthy">Healthy</option>
              <option value="recovering">Recovering</option>
              <option value="struggling">Needs Attention</option>
            </select>
          </div>

          <span className="text-sage-500 ml-auto font-medium">
            {filteredEntries.length} entries recorded
          </span>
        </div>
      </div>

      {/* Entries Feed */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-16 bg-earth-50 rounded-3xl border border-dashed border-sage-300 p-8 space-y-3">
          <BookMarked className="w-10 h-10 text-sage-400 mx-auto" />
          <h3 className="text-base font-semibold text-forest-900">No journal observations yet</h3>
          <p className="text-xs text-sage-600">
            Keep a record of your garden's living journey by adding your first note.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-600 text-white text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Observation</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => {
            const moodInfo = moodBadges[entry.mood] || moodBadges.healthy;
            return (
              <div
                key={entry.id}
                className="bg-earth-50 rounded-3xl p-6 border border-sage-200 shadow-soft hover:shadow-medium transition-all space-y-3"
              >
                {/* Header: Date, Plant, Mood, Delete */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-forest-100 text-forest-800">
                      {entry.plantName || 'General Garden'}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${moodInfo.color}`}>
                      {moodInfo.icon} {moodInfo.label}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-sage-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(entry.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="p-1 text-sage-400 hover:text-rose-600 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Notes content */}
                <p className="text-sm text-forest-950 leading-relaxed font-sans">
                  {entry.notes}
                </p>

                {/* Meta details footer: Weather & Action Taken */}
                {(entry.weather || entry.actionTaken) && (
                  <div className="pt-2 border-t border-sage-200/80 flex flex-wrap items-center gap-4 text-xs text-sage-600">
                    {entry.weather && (
                      <span className="flex items-center gap-1.5">
                        <CloudSun className="w-3.5 h-3.5 text-sage-500" />
                        <span>{entry.weather}</span>
                      </span>
                    )}
                    {entry.actionTaken && (
                      <span className="flex items-center gap-1.5 font-medium text-forest-800">
                        <Sprout className="w-3.5 h-3.5 text-forest-600" />
                        <span>Action: {entry.actionTaken}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* New Observation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/60 backdrop-blur-sm animate-fade-in">
          <form 
            onSubmit={handleSubmit}
            className="relative w-full max-w-lg bg-earth-50 rounded-3xl border border-sage-200 shadow-elevated overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 pb-4 border-b border-sage-200 flex items-center justify-between bg-white/70">
              <h2 className="text-xl font-serif font-bold text-forest-950">New Garden Observation</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-sage-200 text-sage-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs sm:text-sm">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block mb-1">
                  Plant Linked
                </label>
                <select
                  value={selectedPlantId}
                  onChange={(e) => setSelectedPlantId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-sage-300 bg-white font-medium text-forest-900"
                >
                  <option value="">General Garden Observation</option>
                  {myPlants.map((p) => (
                    <option key={p.plantId} value={p.name}>
                      {p.name} ({p.scientificName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block mb-1">
                  Plant Vitality / Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['thriving', 'healthy', 'recovering', 'struggling'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      className={`p-2 rounded-xl border text-xs font-semibold capitalize transition-all ${
                        mood === m
                          ? 'border-forest-600 bg-forest-100 text-forest-900 shadow-sm'
                          : 'border-sage-200 bg-white text-sage-700'
                      }`}
                    >
                      {moodBadges[m].icon} {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block mb-1">
                  Weather / Climate
                </label>
                <input
                  type="text"
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  placeholder="e.g. Mild, 21°C, gentle breeze"
                  className="w-full p-2.5 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block mb-1">
                  Action Taken (Optional)
                </label>
                <input
                  type="text"
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  placeholder="e.g. Fed with diluted seaweed extract, tied vine"
                  className="w-full p-2.5 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block mb-1">
                  Observation Notes *
                </label>
                <textarea
                  required
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What did you observe? Any new flower buds, root shoots, pest sightings, or changes in leaf color?"
                  className="w-full p-3 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                />
              </div>
            </div>

            <div className="p-4 bg-white/80 border-t border-sage-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-sage-300 text-sage-700 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-600 text-white font-bold shadow-soft"
              >
                Save Entry
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
