import React from 'react';
import { 
  Sprout, 
  LayoutDashboard, 
  CalendarDays, 
  BookOpen, 
  BookMarked, 
  Settings as SettingsIcon, 
  SunMedium, 
  Sparkles,
  WifiOff
} from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  outdoorMode: boolean;
  setOutdoorMode: (active: boolean) => void;
  ollamaStatus: { connected: boolean; model: string };
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  setCurrentTab,
  outdoorMode,
  setOutdoorMode,
  ollamaStatus,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'garden', label: 'My Garden', icon: Sprout },
    { id: 'planner', label: 'Weekly Planner', icon: CalendarDays },
    { id: 'library', label: 'Plant Library', icon: BookOpen },
    { id: 'journal', label: 'Journal', icon: BookMarked },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-earth-50/90 backdrop-blur-md border-b border-sage-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div 
              onClick={() => { setOutdoorMode(false); setCurrentTab('dashboard'); }}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-forest-700 text-white flex items-center justify-center shadow-soft group-hover:bg-forest-600 transition-colors">
                <Sprout className="w-6 h-6 text-emerald-200" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-forest-900 flex items-center gap-1.5">
                  GrowWise
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sage-200 text-forest-800">Local AI</span>
                </span>
                <p className="text-xs text-sage-600 hidden sm:block">Mindful gardening companion</p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = !outdoorMode && currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setOutdoorMode(false);
                      setCurrentTab(item.id);
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-forest-700 text-white shadow-soft'
                        : 'text-sage-700 hover:text-forest-900 hover:bg-sage-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-200' : 'text-sage-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Side: AI Status Pill & Outdoor Mode CTA */}
            <div className="flex items-center space-x-3">
              {/* AI Status Badge */}
              <div 
                onClick={() => setCurrentTab('settings')}
                title={ollamaStatus.connected ? `Ollama local AI active (${ollamaStatus.model})` : 'Local AI offline; running botanical heuristic engine'}
                className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer border transition-colors ${
                  ollamaStatus.connected
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                    : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                }`}
              >
                {ollamaStatus.connected ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ollama: {ollamaStatus.model}</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                    <span>Botanical Fallback</span>
                  </>
                )}
              </div>

              {/* Outdoor Mode Button */}
              <button
                onClick={() => setOutdoorMode(!outdoorMode)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all shadow-soft ${
                  outdoorMode
                    ? 'bg-amber-500 hover:bg-amber-600 text-white ring-2 ring-amber-400'
                    : 'bg-forest-100 hover:bg-forest-200 text-forest-800 border border-forest-300'
                }`}
              >
                <SunMedium className="w-4 h-4" />
                <span className="hidden xs:inline">{outdoorMode ? 'Exit Outdoor' : 'Outdoor Mode'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      {!outdoorMode && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-earth-50/95 backdrop-blur-md border-t border-sage-200 px-2 py-1.5 shadow-elevated">
          <div className="grid grid-cols-6 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-colors ${
                    isActive ? 'text-forest-800 font-semibold' : 'text-sage-500 hover:text-forest-700'
                  }`}
                >
                  <div className={`p-1 rounded-md ${isActive ? 'bg-forest-100' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-full">
                    {item.label === 'Weekly Planner' ? 'Planner' : item.label === 'Plant Library' ? 'Library' : item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
