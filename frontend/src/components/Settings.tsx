import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  Terminal, 
  Copy, 
  Check, 
  ShieldCheck, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  Wifi, 
  WifiOff,
  ExternalLink,
  Save
} from 'lucide-react';
import type { UserSettings } from '../types';

interface SettingsProps {
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => void;
  onResetDatabase: () => void;
  ollamaStatus: { connected: boolean; model: string };
  onRefreshHealth: () => Promise<void>;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onSaveSettings,
  onExportData,
  onImportData,
  onResetDatabase,
  ollamaStatus,
  onRefreshHealth,
}) => {
  const [ollamaUrl, setOllamaUrl] = useState<string>(settings.ollamaUrl || 'http://localhost:11434');
  const [modelName, setModelName] = useState<string>(settings.modelName || 'gemma:2b');
  const [apiUrl, setApiUrl] = useState<string>(settings.apiUrl || 'http://localhost:8000');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      ollamaUrl: ollamaUrl.trim(),
      modelName: modelName.trim(),
      apiUrl: apiUrl.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleTestNow = async () => {
    setTestingConnection(true);
    await onRefreshHealth();
    setTestingConnection(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportData(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-earth-50 rounded-3xl p-6 sm:p-8 border border-sage-200 shadow-soft">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5 text-forest-600" />
            <span>Local AI & System Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-900">
            Settings & Local Runtime
          </h1>
          <p className="text-sm text-sage-600 max-w-2xl">
            GrowWise is designed local-first. AI models run strictly on your machine via Ollama, and your garden data never leaves your browser.
          </p>
        </div>
      </div>

      {/* AI Runtime Connectivity Card */}
      <div className="bg-earth-50 rounded-3xl p-6 border border-sage-200 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-serif font-bold text-forest-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-forest-600" />
              Ollama AI Runtime Status
            </h2>
            <p className="text-xs text-sage-600">Local open-weight intelligence engine</p>
          </div>

          <button
            onClick={handleTestNow}
            disabled={testingConnection}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-sage-300 hover:bg-sage-100 text-forest-800 text-xs font-semibold transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
            <span>{testingConnection ? 'Testing Connection...' : 'Ping AI Runtime'}</span>
          </button>
        </div>

        {/* Live Status Indicator Box */}
        <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${
          ollamaStatus.connected
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : 'bg-amber-50 border-amber-200 text-amber-950'
        }`}>
          {ollamaStatus.connected ? (
            <Wifi className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <WifiOff className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <h3 className="font-bold text-sm">
              {ollamaStatus.connected
                ? `Ollama AI Online (${ollamaStatus.model})`
                : 'Ollama is Offline (Botanical Fallback Engine Active)'}
            </h3>
            <p className="text-xs leading-relaxed opacity-90">
              {ollamaStatus.connected
                ? 'Your local model is ready to generate personalized structured gardening plans and answers.'
                : 'When Ollama is offline or not installed, GrowWise automatically activates its deterministic botanical heuristic engine. Your plant library, saved garden, task progress, and journal remain 100% operational.'}
            </p>
          </div>
        </div>

        {/* Runtime Settings Form */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block mb-1">
              Ollama Endpoint URL
            </label>
            <input
              type="text"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              placeholder="http://localhost:11434"
              className="w-full p-2.5 rounded-xl border border-sage-300 bg-white text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block mb-1">
              Configured Model Tag
            </label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="gemma:2b"
              className="w-full p-2.5 rounded-xl border border-sage-300 bg-white text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
            <span className="text-[11px] text-sage-500 mt-1 block">
              Default: <code>gemma:2b</code>
            </span>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block mb-1">
              FastAPI Backend URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8000"
              className="w-full p-2.5 rounded-xl border border-sage-300 bg-white text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
            <span className="text-[11px] text-sage-500 mt-1 block">
              Default: <code>http://localhost:8000</code>
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-600 text-white font-semibold text-xs transition-transform active:scale-95 shadow-soft"
          >
            <Save className="w-4 h-4" />
            <span>{savedSuccess ? 'Settings Saved!' : 'Save AI Configuration'}</span>
          </button>
        </div>
      </div>

      {/* Setup Instructions for Ollama */}
      <div className="bg-earth-50 rounded-3xl p-6 border border-sage-200 shadow-soft space-y-4">
        <h2 className="text-lg font-serif font-bold text-forest-900 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-forest-600" />
          How to Run Local AI with Ollama
        </h2>
        <p className="text-xs text-sage-600">
          Follow these quick steps if you want to use the local neural model for plan synthesis:
        </p>

        <div className="space-y-3 text-xs sm:text-sm">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-white border border-sage-200 space-y-2">
            <span className="font-bold text-forest-900">Step 1: Install Ollama</span>
            <p className="text-sage-600 text-xs">
              Download and install Ollama for Windows, Mac, or Linux from the official website.
            </p>
            <a
              href="https://ollama.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-forest-700 hover:underline"
            >
              <span>Visit ollama.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-white border border-sage-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-forest-900">Step 2: Pull & Run Open-Weight Model</span>
              <button
                onClick={() => copyToClipboard('ollama run gemma:2b', 'pull')}
                className="flex items-center gap-1 text-xs font-semibold text-forest-700 hover:text-forest-900"
              >
                {copiedCmd === 'pull' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd === 'pull' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-2.5 rounded-xl bg-forest-950 text-emerald-300 font-mono text-xs overflow-x-auto">
              ollama run gemma:2b
            </pre>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-white border border-sage-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-forest-900">Step 3: Start GrowWise FastAPI Backend</span>
              <button
                onClick={() => copyToClipboard('python backend/main.py', 'backend')}
                className="flex items-center gap-1 text-xs font-semibold text-forest-700 hover:text-forest-900"
              >
                {copiedCmd === 'backend' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd === 'backend' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-2.5 rounded-xl bg-forest-950 text-emerald-300 font-mono text-xs overflow-x-auto">
              .\backend\venv\Scripts\python backend/main.py
            </pre>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee & Backup */}
      <div className="bg-earth-50 rounded-3xl p-6 border border-sage-200 shadow-soft space-y-6">
        <div>
          <h2 className="text-lg font-serif font-bold text-forest-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Local-First Privacy & Data Sovereignty
          </h2>
          <p className="text-xs text-sage-600 mt-1">
            GrowWise contains zero analytics, zero external tracking pixels, and zero cloud accounts. Everything is kept inside your browser's IndexedDB and local runtime.
          </p>
        </div>

        {/* Data Actions: Export / Import / Clear */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={onExportData}
            className="flex items-center justify-center space-x-2 p-3.5 rounded-2xl bg-white border border-sage-300 hover:bg-forest-50 text-forest-900 font-semibold text-xs transition-colors"
          >
            <Download className="w-4 h-4 text-forest-600" />
            <span>Export Garden Backup</span>
          </button>

          <label className="flex items-center justify-center space-x-2 p-3.5 rounded-2xl bg-white border border-sage-300 hover:bg-forest-50 text-forest-900 font-semibold text-xs cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-forest-600" />
            <span>Import Garden Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={onResetDatabase}
            className="flex items-center justify-center space-x-2 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-800 font-semibold text-xs transition-colors"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Reset Local Database</span>
          </button>
        </div>
      </div>
    </div>
  );
};
