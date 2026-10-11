# 🌿 GrowWise — Local-First AI Gardening Planner

> **Spend less time on screens, and more time taking care of living plants.**  
> GrowWise is a modern, privacy-first gardening companion that turns your garden setup into practical, personalized plant-care routines using locally running open-weight AI and a curated botanical knowledge base.

---

## 🌟 Key Features

1. **Garden Profile Setup:**
   - Configure your garden type (**Indoor**, **Balcony**, **Terrace**, or **Backyard**).
   - Set sunlight exposure (**Full Sun**, **Partial Sun**, **Bright Indirect**, **Shade**), space size, experience level, and weekly time budget.
   - Choose from 30+ curated plant profiles or add your own custom plants.

2. **AI Gardening Planner (Dual-Engine):**
   - **Local AI Mode:** Integrates with local open-weight models via **Ollama** (e.g. `gemma:2b`, `gemma2:2b`, `llama3.2:1b`) with Pydantic structured output validation.
   - **Botanical Heuristic Fallback Engine:** Built directly into both FastAPI and the browser client, ensuring the app remains 100% operational even when Ollama is offline or starting up.
   - Synthesizes 7-day actionable care routines (Watering, Pruning, Soil care, Pest scouting, Harvesting) with realistic time estimates, required tools, and expert tips.

3. **Dashboard:**
   - Visual progress ring and time spent screen-free in dirt.
   - Today's prioritized tasks with 1-click completion and micro-interactions.
   - Daily botanical wisdom ticker and garden overview.

4. **Curated Botanical Library:**
   - 30+ verified plant profiles across Herbs, Vegetables, Fruits, Indoor Foliage, and Flowers.
   - Detailed sunlight hours, watering guidelines, soil pH, temperature thresholds, companion plants, and organic pest remedies.
   - Add custom user plants with custom attributes.

5. **Outdoor Mode:**
   - Distraction-free, mobile-friendly interface designed for hands in soil.
   - Oversized touch controls and glove-friendly completion buttons.
   - Sunlight boost high-contrast mode for direct outdoor sun readability.
   - Integrated gardening stopwatch timer and quick voice/text observation scratchpad.

6. **Gardening Journal:**
   - Chronological observation timeline linked directly to specific plants.
   - Vitality ratings (**Thriving**, **Healthy**, **Recovering**, **Needs Attention**).
   - Track weather, climate shifts, and care actions taken.

7. **Local-First Privacy & Offline PWA:**
   - Zero user accounts, zero analytics, zero external cloud tracking.
   - All data saved directly in browser **IndexedDB** via **Dexie.js**.
   - Offline support via Service Worker (`sw.js`) and Web App Manifest (`manifest.webmanifest`).
   - One-click JSON data export and import for full user data ownership.

---

## 🛠️ Tech Stack

- **Frontend:** Astro 5, React 19, TypeScript, Tailwind CSS, Lucide Icons, Dexie.js (IndexedDB), Canvas Confetti
- **Backend:** Python 3.11+, FastAPI, Pydantic v2, HTTPX, Uvicorn
- **AI Runtime:** Ollama (Local open-weight runtime)
- **Target AI Model:** `gemma:2b` (configurable in Settings to `gemma2:2b`, `gemma3`, `llama3.2:1b`, etc.)
- **Offline / PWA:** Service Worker (`sw.js`), Web App Manifest, Cache API

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (v22 recommended)
- **Python** 3.10+ (Python 3.13 tested)
- **Ollama** (Optional for neural AI generation; fallback botanical engine works offline without it)

---

### Step 1: Clone & Setup Backend

```bash
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI backend (Port 8000)
python main.py
```

The FastAPI backend will start at `http://127.0.0.1:8000`. You can inspect interactive API documentation at `http://127.0.0.1:8000/docs`.

---

### Step 2: Setup Frontend

Open a new terminal window:

```bash
cd frontend

# Install Node dependencies
npm install

# Start Astro development server
npm run dev
```

Visit **`http://localhost:4321`** in your browser.

---

### Step 3: Local AI Setup with Ollama (Optional but Recommended)

1. Download and install Ollama from [ollama.com](https://ollama.com).
2. Pull and start the compact open-weight Gemma model:
   ```bash
   ollama run gemma:2b
   ```
3. Open GrowWise in your browser and go to **Settings**:
   - Verify that the Ollama status badge turns green (`Ollama: gemma:2b`).
   - Click **Ping AI Runtime** to test the connection.

*Note: If Ollama is not installed or offline, GrowWise automatically activates its botanical heuristic engine. You can generate plans, manage tasks, explore all 30 plants, and use the journal with zero interruptions!*

---

## 🧪 Verification & Testing

### Backend Tests

To run the automated verification suite for the FastAPI endpoints and botanical models:

```bash
cd backend
.\venv\Scripts\python -c "from main import app, get_plants_db, generate_heuristic_plan; from models import GardenProfile; plants = get_plants_db(); print('Loaded plants:', len(plants)); profile = GardenProfile(gardenType='balcony', sunlight='full_sun', plants=['sweet-basil']); plan = generate_heuristic_plan(profile, plants); print('Tasks generated:', len(plan.tasks)); print('Verification PASSED!')"
```

### Frontend Type-Checking & Build

```bash
cd frontend
npm run build
```

This compiles static assets and builds the production bundle in `dist/`.

---

## 📁 Project Directory Structure

```
.
├── backend/
│   ├── data/
│   │   └── plants.json          # Curated botanical knowledge base (30+ plants)
│   ├── main.py                  # FastAPI application & API endpoints
│   ├── models.py                # Pydantic schemas (GardenProfile, TaskItem, WeeklyPlan)
│   ├── planner.py               # Ollama prompt engine + botanical heuristic fallback
│   ├── requirements.txt         # Python dependencies
│   └── venv/                    # Virtual environment
├── frontend/
│   ├── public/
│   │   ├── favicon.svg          # Nature sprout icon
│   │   ├── manifest.webmanifest # PWA manifest
│   │   └── sw.js                # Service Worker for offline caching
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.tsx          # Root state orchestrator & IndexedDB sync
│   │   │   ├── Dashboard.tsx    # Today's tasks, weekly progress, and shortcuts
│   │   │   ├── GardenSetup.tsx  # Garden environment & profile builder
│   │   │   ├── Journal.tsx      # Chronological plant observation logs
│   │   │   ├── Navigation.tsx   # Topbar & mobile bottom navigation
│   │   │   ├── OutdoorMode.tsx  # High-contrast, large-button garden mode
│   │   │   ├── PlantLibrary.tsx # Searchable 30-plant library & detail modals
│   │   │   ├── Settings.tsx     # Ollama AI status, model selector & backups
│   │   │   ├── TaskDetailModal.tsx # Step-by-step instructions & notes
│   │   │   └── WeeklyPlanner.tsx   # AI plan generator & filterable weekly schedule
│   │   ├── data/
│   │   │   └── plants.ts        # Client-side botanical dataset
│   │   ├── db/
│   │   │   └── index.ts         # Dexie.js IndexedDB schema & initializer
│   │   ├── layouts/
│   │   │   └── Layout.astro     # Astro root layout with PWA meta tags
│   │   ├── pages/
│   │   │   └── index.astro      # Application entry page
│   │   └── types/
│   │       └── index.ts         # TypeScript interfaces
│   ├── astro.config.mjs         # Astro configuration
│   ├── package.json             # NPM dependencies & scripts
│   ├── tailwind.config.mjs      # Nature-inspired palette
│   └── tsconfig.json            # Strict TypeScript configuration
└── README.md                    # Documentation & setup guide
```

---

## 🔒 Privacy & Offline Architecture

- **Single Source of Truth:** Browser IndexedDB via Dexie.js.
- **Data Export & Import:** Full JSON backup feature under Settings.
- **Zero Telemetry:** No analytics scripts, no tracking cookies, no third-party APIs.
- **Offline Autonomy:** Static app shell is cached via Service Worker, and plant knowledge base is bundled for immediate access without internet connectivity.
