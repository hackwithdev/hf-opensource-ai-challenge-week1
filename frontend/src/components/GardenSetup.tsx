import React, { useState } from 'react';
import { 
  Sprout, 
  Sun, 
  Maximize2, 
  Award, 
  Clock, 
  Check, 
  Save, 
  Plus,
  Compass
} from 'lucide-react';
import type { GardenProfile, GardenType, SunlightType, ExperienceLevel, Plant } from '../types';
import { CURATED_PLANTS } from '../data/plants';

interface GardenSetupProps {
  profile: GardenProfile | null;
  onSaveProfile: (profile: GardenProfile) => void;
  onNavigateTab: (tab: string) => void;
  customPlants: Plant[];
}

export const GardenSetup: React.FC<GardenSetupProps> = ({
  profile,
  onSaveProfile,
  onNavigateTab,
  customPlants,
}) => {
  const [gardenType, setGardenType] = useState<GardenType>(profile?.gardenType || 'balcony');
  const [sunlight, setSunlight] = useState<SunlightType>(profile?.sunlight || 'full_sun');
  const [spaceSize, setSpaceSize] = useState<'compact' | 'medium' | 'large'>(profile?.spaceSize || 'compact');
  const [experience, setExperience] = useState<ExperienceLevel>(profile?.experience || 'beginner');
  const [weeklyTime, setWeeklyTime] = useState<string>(profile?.weeklyTime || '1-2 hours');
  const [selectedPlants, setSelectedPlants] = useState<string[]>(profile?.plants || ['sweet-basil', 'cherry-tomato']);
  const [gardenName, setGardenName] = useState<string>(profile?.name || 'My Green Sanctuary');
  const [notes, setNotes] = useState<string>(profile?.notes || '');
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  const allAvailablePlants = [...CURATED_PLANTS, ...customPlants];

  const gardenTypes: { id: GardenType; label: string; desc: string; icon: string }[] = [
    { id: 'indoor', label: 'Indoor', desc: 'Windowsills, shelves & living rooms', icon: '🪴' },
    { id: 'balcony', label: 'Balcony', desc: 'Containers, railing boxes & pots', icon: '🌿' },
    { id: 'terrace', label: 'Terrace', desc: 'Rooftop planters & raised boxes', icon: '☀️' },
    { id: 'backyard', label: 'Backyard', desc: 'In-ground garden beds & open plots', icon: '🏡' },
  ];

  const sunlightOptions: { id: SunlightType; label: string; desc: string }[] = [
    { id: 'full_sun', label: 'Full Sun (6+ hrs)', desc: 'Direct, unfiltered sunlight all midday' },
    { id: 'partial_sun', label: 'Partial Sun (3-6 hrs)', desc: 'Morning or late afternoon gentle rays' },
    { id: 'indirect', label: 'Bright Indirect', desc: 'Diffused ambient light without scorch' },
    { id: 'shade', label: 'Full Shade (<3 hrs)', desc: 'Deep covered light or low northern windows' },
  ];

  const spaceOptions: { id: 'compact' | 'medium' | 'large'; label: string; desc: string }[] = [
    { id: 'compact', label: 'Compact (<2 m²)', desc: 'Pots, hanging planters, windowsills' },
    { id: 'medium', label: 'Medium (2-10 m²)', desc: 'Multiple raised beds, patio deck' },
    { id: 'large', label: 'Spacious (>10 m²)', desc: 'Extensive garden, allotment or yard' },
  ];

  const experienceOptions: { id: ExperienceLevel; label: string; desc: string }[] = [
    { id: 'beginner', label: 'Beginner', desc: 'Clear step-by-step guidance & forgiving plants' },
    { id: 'intermediate', label: 'Intermediate', desc: 'Pruning techniques, feeding, companion crops' },
    { id: 'expert', label: 'Experienced', desc: 'Advanced propagation, pest cycles & soil biology' },
  ];

  const timeOptions = [
    { label: '15-30 min / week', desc: 'Low-maintenance, quick check-ins' },
    { label: '1-2 hours / week', desc: 'Steady weekly cadence (Recommended)' },
    { label: '3-5 hours / week', desc: 'Deep hobby gardening & harvesting' },
    { label: 'Daily Care', desc: 'Mindful daily garden retreat' },
  ];

  const togglePlant = (plantId: string) => {
    setSelectedPlants((prev) =>
      prev.includes(plantId) ? prev.filter((id) => id !== plantId) : [...prev, plantId]
    );
  };

  const handleSave = () => {
    const updated: GardenProfile = {
      id: profile?.id || 'main-profile',
      name: gardenName.trim() || 'My Garden',
      gardenType,
      sunlight,
      spaceSize,
      experience,
      weeklyTime,
      plants: selectedPlants,
      notes,
      updatedAt: new Date().toISOString(),
    };

    onSaveProfile(updated);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="bg-earth-50 rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-900">
              Garden Setup & Profile
            </h1>
            <p className="text-sm text-sage-600">
              Configure your growing environment to receive tailored, accurate weekly care routines.
            </p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-600 text-white font-medium shadow-soft transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{savedFeedback ? 'Saved!' : 'Save Garden Profile'}</span>
          </button>
        </div>
      </div>

      {/* Garden Name & Location */}
      <div className="bg-earth-50 rounded-3xl p-6 border border-sage-200 shadow-soft space-y-4">
        <h2 className="text-lg font-serif font-bold text-forest-900 flex items-center gap-2">
          <Compass className="w-5 h-5 text-forest-600" />
          Garden Identity
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block mb-1">
              Garden Name
            </label>
            <input
              type="text"
              value={gardenName}
              onChange={(e) => setGardenName(e.target.value)}
              placeholder="e.g. Sunny Balcony Oasis"
              className="w-full text-sm p-3 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block mb-1">
              Personal Goals / Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Grow fresh herbs for cooking, reduce screen time"
              className="w-full text-sm p-3 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* 1. Garden Type */}
      <div className="bg-earth-50 rounded-3xl p-6 border border-sage-200 shadow-soft space-y-4">
        <h2 className="text-lg font-serif font-bold text-forest-900 flex items-center gap-2">
          <Sprout className="w-5 h-5 text-forest-600" />
          1. Garden Environment
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {gardenTypes.map((t) => (
            <div
              key={t.id}
              onClick={() => setGardenType(t.id)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                gardenType === t.id
                  ? 'border-forest-600 bg-forest-50/70 shadow-sm'
                  : 'border-sage-200 bg-white hover:border-sage-300'
              }`}
            >
              <div className="space-y-1">
                <span className="text-3xl block mb-2">{t.icon}</span>
                <h3 className="font-bold text-forest-900 text-sm">{t.label}</h3>
                <p className="text-xs text-sage-600 leading-relaxed">{t.desc}</p>
              </div>
              <div className="mt-3 flex justify-end">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  gardenType === t.id ? 'border-forest-600 bg-forest-600 text-white' : 'border-sage-300'
                }`}>
                  {gardenType === t.id && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Sunlight Exposure */}
      <div className="bg-earth-50 rounded-3xl p-6 border border-sage-200 shadow-soft space-y-4">
        <h2 className="text-lg font-serif font-bold text-forest-900 flex items-center gap-2">
          <Sun className="w-5 h-5 text-forest-600" />
          2. Sunlight Exposure
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sunlightOptions.map((s) => (
            <div
              key={s.id}
              onClick={() => setSunlight(s.id)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                sunlight === s.id
                  ? 'border-forest-600 bg-forest-50/70 shadow-sm'
                  : 'border-sage-200 bg-white hover:border-sage-300'
              }`}
            >
              <div>
                <h3 className="font-bold text-forest-900 text-sm">{s.label}</h3>
                <p className="text-xs text-sage-600 mt-0.5">{s.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ml-3 ${
                sunlight === s.id ? 'border-forest-600 bg-forest-600 text-white' : 'border-sage-300'
              }`}>
                {sunlight === s.id && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Space & Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Space Size */}
        <div className="bg-earth-50 rounded-3xl p-6 border border-sage-200 shadow-soft space-y-4">
          <h2 className="text-lg font-serif font-bold text-forest-900 flex items-center gap-2">
            <Maximize2 className="w-5 h-5 text-forest-600" />
            3. Growing Space
          </h2>
          <div className="space-y-2.5">
            {spaceOptions.map((sp) => (
              <div
                key={sp.id}
                onClick={() => setSpaceSize(sp.id)}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  spaceSize === sp.id
                    ? 'border-forest-600 bg-forest-50/70 shadow-sm'
                    : 'border-sage-200 bg-white hover:border-sage-300'
                }`}
              >
                <div>
                  <h3 className="font-bold text-forest-900 text-sm">{sp.label}</h3>
                  <p className="text-xs text-sage-600">{sp.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                  spaceSize === sp.id ? 'border-forest-600 bg-forest-600 text-white' : 'border-sage-300'
                }`}>
                  {spaceSize === sp.id && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className="bg-earth-50 rounded-3xl p-6 border border-sage-200 shadow-soft space-y-4">
          <h2 className="text-lg font-serif font-bold text-forest-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-forest-600" />
            4. Gardening Experience
          </h2>
          <div className="space-y-2.5">
            {experienceOptions.map((exp) => (
              <div
                key={exp.id}
                onClick={() => setExperience(exp.id)}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  experience === exp.id
                    ? 'border-forest-600 bg-forest-50/70 shadow-sm'
                    : 'border-sage-200 bg-white hover:border-sage-300'
                }`}
              >
                <div>
                  <h3 className="font-bold text-forest-900 text-sm">{exp.label}</h3>
                  <p className="text-xs text-sage-600">{exp.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                  experience === exp.id ? 'border-forest-600 bg-forest-600 text-white' : 'border-sage-300'
                }`}>
                  {experience === exp.id && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Time Budget */}
      <div className="bg-earth-50 rounded-3xl p-6 border border-sage-200 shadow-soft space-y-4">
        <h2 className="text-lg font-serif font-bold text-forest-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-forest-600" />
          5. Available Time Budget
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {timeOptions.map((tm) => (
            <div
              key={tm.label}
              onClick={() => setWeeklyTime(tm.label)}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                weeklyTime === tm.label
                  ? 'border-forest-600 bg-forest-50/70 shadow-sm'
                  : 'border-sage-200 bg-white hover:border-sage-300'
              }`}
            >
              <div>
                <h3 className="font-bold text-forest-900 text-sm">{tm.label}</h3>
                <p className="text-xs text-sage-600 mt-1">{tm.desc}</p>
              </div>
              <div className="mt-3 flex justify-end">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  weeklyTime === tm.label ? 'border-forest-600 bg-forest-600 text-white' : 'border-sage-300'
                }`}>
                  {weeklyTime === tm.label && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Plant Selection for Garden */}
      <div className="bg-earth-50 rounded-3xl p-6 border border-sage-200 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-serif font-bold text-forest-900">
              6. Plants in Your Garden ({selectedPlants.length} selected)
            </h2>
            <p className="text-xs text-sage-600">Select plants you currently nurture or want to grow in this garden.</p>
          </div>
          <button
            onClick={() => onNavigateTab('library')}
            className="text-xs font-semibold text-forest-700 hover:text-forest-900 flex items-center gap-1"
          >
            <span>Explore full library</span>
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-1">
          {allAvailablePlants.map((plant) => {
            const isSelected = selectedPlants.includes(plant.id);
            return (
              <div
                key={plant.id}
                onClick={() => togglePlant(plant.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center space-x-2.5 ${
                  isSelected
                    ? 'border-forest-600 bg-forest-100/70 font-semibold text-forest-900'
                    : 'border-sage-200 bg-white hover:border-sage-300 text-sage-700'
                }`}
              >
                <span className="text-xl">{plant.icon || '🌱'}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold truncate">{plant.name}</h4>
                  <span className="text-[10px] text-sage-500 capitalize">{plant.category}</span>
                </div>
                <div className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-forest-700 border-forest-700 text-white' : 'border-sage-300'
                }`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Save CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-forest-700 hover:bg-forest-600 text-white font-bold shadow-soft transition-all active:scale-95 text-sm"
        >
          <Save className="w-4 h-4" />
          <span>{savedFeedback ? 'Garden Profile Updated!' : 'Save & Update Planner'}</span>
        </button>
      </div>
    </div>
  );
};
