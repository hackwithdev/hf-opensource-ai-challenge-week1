import os
import json
from pathlib import Path
from typing import List, Optional
import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from models import (
    Plant,
    GardenProfile,
    GeneratePlanRequest,
    GeneratePlanResponse,
    HealthStatus,
    AdviceRequest,
    AdviceResponse
)
from planner import (
    get_plants_db,
    find_plant,
    generate_heuristic_plan,
    generate_ollama_plan
)

app = FastAPI(
    title="GrowWise API",
    description="Local-First AI Gardening Planner API powered by local models and curated botanical intelligence",
    version="1.0.0"
)

# Allow CORS for Astro / React local origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", response_model=HealthStatus)
async def check_health(ollama_url: str = Query("http://localhost:11434")):
    plants = get_plants_db()
    ollama_ok = False
    detected_models: List[str] = []
    
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(f"{ollama_url.rstrip('/')}/api/tags")
            if resp.status_code == 200:
                ollama_ok = True
                data = resp.json()
                detected_models = [m.get("name", "") for m in data.get("models", []) if m.get("name")]
    except Exception:
        ollama_ok = False

    return HealthStatus(
        status="healthy",
        ollamaAvailable=ollama_ok,
        ollamaUrl=ollama_url,
        models=detected_models,
        plantCount=len(plants)
    )

@app.get("/api/plants", response_model=List[Plant])
async def list_plants(
    category: Optional[str] = Query(None, description="vegetable, herb, fruit, indoor, flower"),
    difficulty: Optional[str] = Query(None, description="easy, moderate, advanced"),
    sunlight: Optional[str] = Query(None, description="full_sun, partial_sun, indirect, shade"),
    q: Optional[str] = Query(None, description="Search query")
):
    plants = get_plants_db()
    results = plants

    if category:
        results = [p for p in results if p.category.lower() == category.lower()]
    if difficulty:
        results = [p for p in results if p.difficulty.lower() == difficulty.lower()]
    if sunlight:
        results = [p for p in results if p.sunlight.lower() == sunlight.lower()]
    if q:
        query = q.lower().strip()
        results = [
            p for p in results 
            if query in p.name.lower() or query in p.scientificName.lower() or any(query in tip.lower() for tip in p.careTips)
        ]

    return results

@app.get("/api/plants/{plant_id}", response_model=Plant)
async def get_plant(plant_id: str):
    plants = get_plants_db()
    plant = find_plant(plants, plant_id)
    if not plant:
        raise HTTPException(status_code=404, detail=f"Plant '{plant_id}' not found")
    return plant

@app.post("/api/plan/generate", response_model=GeneratePlanResponse)
async def generate_plan(req: GeneratePlanRequest):
    plants_db = get_plants_db()
    
    # Check if user specified a model and Ollama URL
    model_name = req.modelName or "gemma:2b"
    ollama_url = req.ollamaUrl or "http://localhost:11434"

    # Try local Ollama AI generation first
    ai_plan, err = await generate_ollama_plan(req.profile, model_name, ollama_url, plants_db)
    
    if ai_plan:
        return GeneratePlanResponse(
            plan=ai_plan,
            engineUsed="ollama",
            modelUsed=model_name,
            notes="Plan successfully tailored using your local open-weight AI model."
        )
    
    # Seamless Fallback to Botanical Heuristic Engine
    heuristic_plan = generate_heuristic_plan(req.profile, plants_db)
    fallback_note = (
        f"Local AI offline or starting up ({err or 'Ollama unavailable'}). "
        f"Generated plan using GrowWise botanical heuristic engine based on {len(plants_db)} curated plant guides."
    )
    
    return GeneratePlanResponse(
        plan=heuristic_plan,
        engineUsed="botanical_heuristic",
        modelUsed=None,
        notes=fallback_note
    )

@app.post("/api/advice", response_model=AdviceResponse)
async def get_gardening_advice(req: AdviceRequest):
    plants_db = get_plants_db()
    
    # Try Ollama first
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            context = ""
            if req.plantName:
                p = find_plant(plants_db, req.plantName)
                if p:
                    context = f"Relevant plant context: {p.name} ({p.scientificName}): Sunlight {p.sunlightHours}, Watering: {p.wateringInstructions}, Soil: {p.soil}. Care tips: {'; '.join(p.careTips)}."
            
            prompt = (
                f"You are GrowWise, a mindful local gardening mentor. "
                f"{context}\n\n"
                f"Question: {req.question}\n\n"
                f"Provide concise, actionable advice in 2-3 friendly paragraphs."
            )
            
            resp = await client.post(
                f"{req.ollamaUrl.rstrip('/')}/api/generate",
                json={"model": req.modelName or "gemma:2b", "prompt": prompt, "stream": False}
            )
            if resp.status_code == 200:
                answer = resp.json().get("response", "").strip()
                return AdviceResponse(answer=answer, source=f"Ollama ({req.modelName})")
    except Exception:
        pass

    # Fallback to botanical search
    q_low = req.question.lower()
    matched_plant = None
    if req.plantName:
        matched_plant = find_plant(plants_db, req.plantName)
    else:
        for p in plants_db:
            if p.name.lower() in q_low:
                matched_plant = p
                break

    if matched_plant:
        tips = " ".join(matched_plant.careTips)
        pests = "; ".join([f"{item.problem} -> {item.solution}" for item in matched_plant.pestsAndProblems])
        return AdviceResponse(
            answer=(
                f"For **{matched_plant.name}** ({matched_plant.scientificName}):\n\n"
                f"- **Watering Advice:** {matched_plant.wateringInstructions}\n"
                f"- **Sunlight & Environment:** Requires {matched_plant.sunlightHours} at {matched_plant.idealTemperature}.\n"
                f"- **Key Care Tips:** {tips}\n"
                f"- **Common Issues:** {pests}"
            ),
            source="Curated Botanical Knowledge Base"
        )
    
    return AdviceResponse(
        answer=(
            "When in doubt in the garden, check soil moisture with your finger 3 cm deep before watering. "
            "Most container and backyard plants suffer more frequently from chronic overwatering than from brief dryness. "
            "Ensure drainage holes are clear and provide adequate natural airflow to prevent fungal spores."
        ),
        source="GrowWise Core Botanical Principles"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
