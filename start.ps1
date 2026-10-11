# GrowWise Development Launcher for Windows PowerShell
Write-Host "==========================================" -ForegroundColor Green
Write-Host "🌿 Starting GrowWise Local Gardening App" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# 1. Start Python FastAPI backend in background
Write-Host "`n[1/2] Starting Python FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Cyan
$BackendJob = Start-Job -ScriptBlock {
    Set-Location -Path "$using:PSScriptRoot\backend"
    & ".\venv\Scripts\python.exe" "main.py"
}

Start-Sleep -Seconds 2

# 2. Start Astro Frontend Dev Server
Write-Host "`n[2/2] Starting Astro + React Frontend on http://localhost:4321..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\frontend"
npm run dev

# Stop backend job when frontend exits
Stop-Job -Job $BackendJob
Remove-Job -Job $BackendJob
