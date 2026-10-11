import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Sprout, 
  Droplet, 
  Check, 
  X, 
  AlertCircle, 
  BookOpen, 
  Sparkles
} from 'lucide-react';
import type { Plant, SunlightType } from '../types';
import { CURATED_PLANTS } from '../data/plants';

interface PlantLibraryProps {
  myPlantIds: string[];
  onToggleGardenPlant: (plant: Plant) => void;
  customPlants: Plant[];
  onAddCustomPlant: (plant: Plant) => void;
}

export const PlantLibrary: React.FC<PlantLibraryProps> = ({
  myPlantIds,
  onToggleGardenPlant,
  customPlants,
  onAddCustomPlant,
}) => {
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedSunlight, setSelectedSunlight] = useState<string>('all');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);

  // New Custom Plant Form state
  const [customName, setCustomName] = useState<string>('');
  const [customScientific, setCustomScientific] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<'vegetable' | 'herb' | 'fruit' | 'indoor' | 'flower'>('herb');
  const [customSunlight, setCustomSunlight] = useState<SunlightType>('full_sun');
  const [customWatering, setCustomWatering] = useState<'low' | 'moderate' | 'frequent'>('moderate');
  const [customWaterNotes, setCustomWaterNotes] = useState<string>('');
  const [customTips, setCustomTips] = useState<string>('');

  const allPlants = [...CURATED_PLANTS, ...customPlants];

  const categories = [
    { id: 'all', label: 'All Plants' },
    { id: 'vegetable', label: 'Vegetables' },
    { id: 'herb', label: 'Herbs' },
    { id: 'fruit', label: 'Fruits' },
    { id: 'indoor', label: 'Indoor Foliage' },
    { id: 'flower', label: 'Flowers' },
  ];

  const filteredPlants = allPlants.filter((plant) => {
    if (selectedCategory !== 'all' && plant.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && plant.difficulty !== selectedDifficulty) return false;
    if (selectedSunlight !== 'all' && plant.sunlight !== selectedSunlight) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = plant.name.toLowerCase().includes(q);
      const matchSci = plant.scientificName.toLowerCase().includes(q);
      const matchTips = plant.careTips.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchSci && !matchTips) return false;
    }
    return true;
  });

  const handleCreateCustomPlant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newPlant: Plant = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      scientificName: customScientific.trim() || customName.trim(),
      category: customCategory,
      difficulty: 'moderate',
      sunlight: customSunlight,
      sunlightHours: customSunlight.replace('_', ' '),
      watering: customWatering,
      wateringInstructions: customWaterNotes.trim() || 'Water when topsoil feels dry.',
      soil: 'Well-draining rich garden soil.',
      idealTemperature: '18°C - 26°C',
      spacing: '30 cm apart',
      daysToHarvest: null,
      companionPlants: [],
      pestsAndProblems: [
        { problem: 'General pests', solution: 'Inspect leaves and use gentle organic soap spray.' }
      ],
      careTips: customTips.trim() ? [customTips.trim()] : ['Provide ample light and regular care.'],
      icon: customCategory === 'indoor' ? '🪴' : customCategory === 'fruit' ? '🍓' : customCategory === 'flower' ? '🌸' : '🌿',
      custom: true,
    };

    onAddCustomPlant(newPlant);
    setIsCustomModalOpen(false);
    // Reset form
    setCustomName('');
    setCustomScientific('');
    setCustomWaterNotes('');
    setCustomTips('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-earth-50 rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-900">
              Curated Botanical Library
            </h1>
            <p className="text-sm text-sage-600 max-w-2xl">
              Search vetted profiles for herbs, vegetables, indoor plants, and flowers. Each profile includes precise sunlight, watering, soil, and pest remedies.
            </p>
          </div>

          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="flex-shrink-0 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-600 text-white font-medium shadow-soft text-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Plant</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-sage-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plant by name, botanical name, or care tips..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-forest-700 text-white shadow-soft'
                    : 'bg-white hover:bg-sage-100 text-sage-700 border border-sage-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sub Filters */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="text-sage-500 font-medium">Difficulty:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="p-1.5 rounded-lg border border-sage-300 bg-white text-forest-900 font-medium focus:ring-1 focus:ring-forest-500"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-sage-500 font-medium">Sunlight:</span>
              <select
                value={selectedSunlight}
                onChange={(e) => setSelectedSunlight(e.target.value)}
                className="p-1.5 rounded-lg border border-sage-300 bg-white text-forest-900 font-medium focus:ring-1 focus:ring-forest-500"
              >
                <option value="all">All Sunlight</option>
                <option value="full_sun">Full Sun</option>
                <option value="partial_sun">Partial Sun</option>
                <option value="indirect">Bright Indirect</option>
                <option value="shade">Full Shade</option>
              </select>
            </div>

            <span className="text-sage-500 ml-auto font-medium">
              Showing {filteredPlants.length} plants
            </span>
          </div>
        </div>
      </div>

      {/* Plants Grid */}
      {filteredPlants.length === 0 ? (
        <div className="text-center py-16 bg-earth-50 rounded-3xl border border-dashed border-sage-300 p-8 space-y-3">
          <BookOpen className="w-10 h-10 text-sage-400 mx-auto" />
          <h3 className="text-base font-semibold text-forest-900">No matching plants found</h3>
          <p className="text-xs text-sage-600">Try adjusting your search query or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlants.map((plant) => {
            const inGarden = myPlantIds.includes(plant.id);
            return (
              <div
                key={plant.id}
                className="rounded-3xl border border-sage-200 bg-earth-50 shadow-soft hover:shadow-medium transition-all p-5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-white border border-sage-100 shadow-sm">
                      {plant.icon || '🌱'}
                    </span>
                    <button
                      onClick={() => onToggleGardenPlant(plant)}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        inGarden
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-white hover:bg-forest-100 text-forest-800 border border-sage-300'
                      }`}
                    >
                      {inGarden ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>In Garden</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Garden</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-4 cursor-pointer" onClick={() => setSelectedPlant(plant)}>
                    <h3 className="text-base font-bold text-forest-950 group-hover:text-forest-700 transition-colors">
                      {plant.name}
                    </h3>
                    <p className="text-xs text-sage-600 italic">{plant.scientificName}</p>

                    {/* Attribute Badges */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sage-200 text-sage-800">
                        {plant.category}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        {plant.sunlight.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 capitalize">
                        {plant.watering} water
                      </span>
                    </div>

                    <p className="mt-3 text-xs text-sage-700 line-clamp-2 leading-relaxed">
                      {plant.wateringInstructions}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-sage-200/80 flex items-center justify-between text-xs">
                  <span className="text-sage-500 capitalize">Difficulty: <strong>{plant.difficulty}</strong></span>
                  <button
                    onClick={() => setSelectedPlant(plant)}
                    className="font-bold text-forest-700 hover:text-forest-900"
                  >
                    View Botanical Guide →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comprehensive Plant Detail Modal */}
      {selectedPlant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="relative w-full max-w-2xl bg-earth-50 rounded-3xl border border-sage-200 shadow-elevated overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-sage-200 flex items-start justify-between bg-white/70">
              <div className="flex items-center space-x-3">
                <span className="text-4xl p-2 rounded-2xl bg-forest-50">{selectedPlant.icon || '🌱'}</span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-forest-950">
                    {selectedPlant.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-sage-600 italic">
                    {selectedPlant.scientificName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlant(null)}
                className="p-1.5 rounded-full hover:bg-sage-200 text-sage-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Botanical Spec Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-sage-200">
                  <span className="text-sage-500 block">Sunlight</span>
                  <strong className="text-forest-900 block mt-0.5">{selectedPlant.sunlightHours}</strong>
                </div>
                <div className="p-3 rounded-xl bg-white border border-sage-200">
                  <span className="text-sage-500 block">Watering</span>
                  <strong className="text-forest-900 block mt-0.5 capitalize">{selectedPlant.watering}</strong>
                </div>
                <div className="p-3 rounded-xl bg-white border border-sage-200">
                  <span className="text-sage-500 block">Temperature</span>
                  <strong className="text-forest-900 block mt-0.5">{selectedPlant.idealTemperature}</strong>
                </div>
                <div className="p-3 rounded-xl bg-white border border-sage-200">
                  <span className="text-sage-500 block">Spacing</span>
                  <strong className="text-forest-900 block mt-0.5">{selectedPlant.spacing}</strong>
                </div>
              </div>

              {/* Watering & Soil Guidance */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white border border-sage-200 space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-forest-800 flex items-center gap-1.5">
                    <Droplet className="w-4 h-4 text-sky-600" />
                    Watering Protocol
                  </h3>
                  <p className="text-xs sm:text-sm text-forest-900 leading-relaxed">
                    {selectedPlant.wateringInstructions}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-sage-200 space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-forest-800 flex items-center gap-1.5">
                    <Sprout className="w-4 h-4 text-forest-600" />
                    Soil & Substrate Preference
                  </h3>
                  <p className="text-xs sm:text-sm text-forest-900 leading-relaxed">
                    {selectedPlant.soil}
                  </p>
                </div>
              </div>

              {/* Care Tips */}
              <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-forest-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-forest-600" />
                  Cultivation Tips & Maintenance
                </h3>
                <ul className="space-y-1.5 text-xs sm:text-sm text-forest-900">
                  {selectedPlant.careTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-forest-600 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Companion Plants */}
              {selectedPlant.companionPlants && selectedPlant.companionPlants.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 mb-2">
                    Beneficial Companion Plants
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlant.companionPlants.map((comp, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-sage-200 text-forest-900 text-xs font-medium">
                        🌿 {comp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Pests & Organic Remedies */}
              {selectedPlant.pestsAndProblems && selectedPlant.pestsAndProblems.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Common Problems & Organic Solutions
                  </h3>
                  <div className="space-y-2">
                    {selectedPlant.pestsAndProblems.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
                        <strong className="text-amber-900 block font-semibold mb-0.5">{item.problem}</strong>
                        <span className="text-amber-800 leading-relaxed">{item.solution}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white/80 border-t border-sage-200 flex items-center justify-between gap-3">
              <button
                onClick={() => onToggleGardenPlant(selectedPlant)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-soft ${
                  myPlantIds.includes(selectedPlant.id)
                    ? 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100'
                    : 'bg-forest-700 hover:bg-forest-600 text-white'
                }`}
              >
                {myPlantIds.includes(selectedPlant.id) ? (
                  <>
                    <X className="w-4 h-4" />
                    <span>Remove from My Garden</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to My Garden</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setSelectedPlant(null)}
                className="px-4 py-3 rounded-xl border border-sage-300 hover:bg-sage-100 text-sage-700 font-medium text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Plant Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/60 backdrop-blur-sm animate-fade-in">
          <form 
            onSubmit={handleCreateCustomPlant}
            className="relative w-full max-w-lg bg-earth-50 rounded-3xl border border-sage-200 shadow-elevated overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 pb-4 border-b border-sage-200 flex items-center justify-between bg-white/70">
              <h2 className="text-xl font-serif font-bold text-forest-950">Add Custom Plant</h2>
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-sage-200 text-sage-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs sm:text-sm">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block mb-1">
                  Plant Name *
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Thai Basil, Golden Jubilee Peach"
                  className="w-full p-2.5 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block mb-1">
                  Botanical Name (Optional)
                </label>
                <input
                  type="text"
                  value={customScientific}
                  onChange={(e) => setCustomScientific(e.target.value)}
                  placeholder="e.g. Ocimum basilicum var. thyrsiflora"
                  className="w-full p-2.5 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e: any) => setCustomCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-sage-300 bg-white font-medium"
                  >
                    <option value="herb">Herb</option>
                    <option value="vegetable">Vegetable</option>
                    <option value="fruit">Fruit</option>
                    <option value="indoor">Indoor Foliage</option>
                    <option value="flower">Flower</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block mb-1">
                    Sunlight
                  </label>
                  <select
                    value={customSunlight}
                    onChange={(e: any) => setCustomSunlight(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-sage-300 bg-white font-medium"
                  >
                    <option value="full_sun">Full Sun (6+ hrs)</option>
                    <option value="partial_sun">Partial Sun (3-6 hrs)</option>
                    <option value="indirect">Bright Indirect</option>
                    <option value="shade">Shade</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block mb-1">
                  Watering Frequency
                </label>
                <select
                  value={customWatering}
                  onChange={(e: any) => setCustomWatering(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-sage-300 bg-white font-medium"
                >
                  <option value="low">Low (Drought tolerant)</option>
                  <option value="moderate">Moderate (When dry)</option>
                  <option value="frequent">Frequent (Evenly damp)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block mb-1">
                  Watering Instructions
                </label>
                <textarea
                  value={customWaterNotes}
                  onChange={(e) => setCustomWaterNotes(e.target.value)}
                  placeholder="e.g. Water thoroughly twice a week at root base..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block mb-1">
                  Care Tips
                </label>
                <textarea
                  value={customTips}
                  onChange={(e) => setCustomTips(e.target.value)}
                  placeholder="e.g. Prune after flowering to encourage bushy habit..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                />
              </div>
            </div>

            <div className="p-4 bg-white/80 border-t border-sage-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-sage-300 text-sage-700 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-600 text-white font-bold shadow-soft"
              >
                Save Plant
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
