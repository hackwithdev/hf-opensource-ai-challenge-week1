import json
import uuid
import datetime
from pathlib import Path
from typing import List, Optional, Tuple
import httpx

from models import Plant, GardenProfile, TaskItem, WeeklyPlan

DATA_PATH = Path(__file__).parent / "data" / "plants.json"

def get_plants_db() -> List[Plant]:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
        return [Plant(**p) for p in data]

def find_plant(plants_db: List[Plant], identifier: str) -> Optional[Plant]:
    low = identifier.lower().strip()
    for p in plants_db:
        if p.id == low or p.name.lower() == low or low in p.name.lower():
            return p
    return None

def generate_heuristic_plan(profile: GardenProfile, plants_db: List[Plant]) -> WeeklyPlan:
    # Resolve plants from profile or fallback to defaults
    selected_plants: List[Plant] = []
    for pid in profile.plants:
        found = find_plant(plants_db, pid)
        if found and found not in selected_plants:
            selected_plants.append(found)

    # If no recognized plants, select appropriate default plants based on garden type
    if not selected_plants:
        if profile.gardenType == "indoor":
            default_ids = ["monstera-deliciosa", "golden-pothos", "snake-plant"]
        elif profile.gardenType == "balcony":
            default_ids = ["sweet-basil", "cherry-tomato", "spearmint"]
        elif profile.gardenType == "terrace":
            default_ids = ["bell-pepper", "french-marigold", "english-lavender"]
        else: # backyard
            default_ids = ["cherry-tomato", "zucchini", "carrot", "french-marigold"]
        
        for did in default_ids:
            p = find_plant(plants_db, did)
            if p:
                selected_plants.append(p)

    days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    tasks: List[TaskItem] = []
    
    # Calibrate time per task based on weeklyTime setting
    time_budget = profile.weeklyTime.lower()
    if "minimal" in time_budget or "15-30" in time_budget or "30" in time_budget:
        base_mins = 10
    elif "dedicated" in time_budget or "3-5" in time_budget or "daily" in time_budget:
        base_mins = 25
    else:
        base_mins = 15

    # Strategy: create a rich, structured task for key days based on botanical requirements
    num_plants = len(selected_plants)

    # Day 1 (Monday): Morning Moisture & Root Hydration Check
    target_plant_1 = selected_plants[0] if num_plants > 0 else None
    tasks.append(
        TaskItem(
            id=f"task-{uuid.uuid4().hex[:8]}",
            day="Monday",
            title=f"Root Hydration Check & Base Watering",
            plantId=target_plant_1.id if target_plant_1 else None,
            plantName=target_plant_1.name if target_plant_1 else "All Garden Plants",
            category="watering",
            instructions=(
                f"Check the top 2-3 cm of soil around {target_plant_1.name if target_plant_1 else 'your plants'}. "
                f"Water early in the morning directly at the root zone, keeping leaves dry to prevent fungal spore germination."
            ),
            estimatedMinutes=base_mins,
            tools=["Watering can with narrow spout", "Soil moisture probe or finger"],
            careTips=target_plant_1.wateringInstructions if target_plant_1 else "Always avoid letting pots stand in stagnant saucers.",
            completed=False
        )
    )

    # Day 2 (Tuesday): Sunlight & Foliage Health Inspection
    target_plant_2 = selected_plants[1 % num_plants] if num_plants > 1 else selected_plants[0]
    tasks.append(
        TaskItem(
            id=f"task-{uuid.uuid4().hex[:8]}",
            day="Tuesday",
            title=f"Leaf Underside & Sunlight Alignment Check",
            plantId=target_plant_2.id if target_plant_2 else None,
            plantName=target_plant_2.name if target_plant_2 else "Foliage Plants",
            category="pest_check",
            instructions=(
                f"Inspect the undersides of {target_plant_2.name}'s leaves for common hitchhikers (aphids, spider mites). "
                f"Ensure the plant is receiving optimal {target_plant_2.sunlightHours} without harsh leaf scorch."
            ),
            estimatedMinutes=max(10, base_mins - 5),
            tools=["Magnifying glass or hand loupe", "Microfiber cloth"],
            careTips=(
                target_plant_2.pestsAndProblems[0].solution
                if target_plant_2 and target_plant_2.pestsAndProblems
                else "Early detection prevents pest outbreaks without synthetic pesticides."
            ),
            completed=False
        )
    )

    # Day 3 (Wednesday): Selective Pruning & Deadheading
    target_plant_3 = selected_plants[2 % num_plants] if num_plants > 2 else selected_plants[0]
    tasks.append(
        TaskItem(
            id=f"task-{uuid.uuid4().hex[:8]}",
            day="Wednesday",
            title=f"Selective Pruning & Airflow Maintenance",
            plantId=target_plant_3.id if target_plant_3 else None,
            plantName=target_plant_3.name if target_plant_3 else "Garden Bed",
            category="pruning",
            instructions=(
                f"Sterilize your shears with rubbing alcohol. Snip yellowing lower leaves or spent blooms on {target_plant_3.name}. "
                f"Pinch top growing nodes to encourage bushy lateral growth and improve ambient air circulation."
            ),
            estimatedMinutes=base_mins,
            tools=["Clean bypass pruning shears or snips", "Isopropyl alcohol wipe"],
            careTips=(
                target_plant_3.careTips[0]
                if target_plant_3 and target_plant_3.careTips
                else "Cutting above leaf nodes stimulates vigorous new branches."
            ),
            completed=False
        )
    )

    # Day 4 (Thursday): Soil Aeration & Organic Nourishment
    target_plant_4 = selected_plants[3 % num_plants] if num_plants > 3 else selected_plants[0]
    tasks.append(
        TaskItem(
            id=f"task-{uuid.uuid4().hex[:8]}",
            day="Thursday",
            title=f"Soil Aeration & Gentle Feeding",
            plantId=target_plant_4.id if target_plant_4 else None,
            plantName=target_plant_4.name if target_plant_4 else "Garden Containers",
            category="feeding",
            instructions=(
                f"Lightly scratch topsoil around {target_plant_4.name} to prevent surface crusting. "
                f"Apply a diluted dose of balanced organic seaweed or compost tea to support microbial life."
            ),
            estimatedMinutes=base_mins,
            tools=["Hand cultivator or trowel", "Diluted organic plant feed"],
            careTips=f"Preferred substrate: {target_plant_4.soil if target_plant_4 else 'Well-aerated rich loam'}.",
            completed=False
        )
    )

    # Day 5 (Friday): Mid-Week Hydration & Dusting
    target_plant_5 = selected_plants[4 % num_plants] if num_plants > 4 else selected_plants[1 % num_plants]
    tasks.append(
        TaskItem(
            id=f"task-{uuid.uuid4().hex[:8]}",
            day="Friday",
            title=f"Foliage Refresh & Hydration Check",
            plantId=target_plant_5.id if target_plant_5 else None,
            plantName=target_plant_5.name if target_plant_5 else "All Plants",
            category="watering",
            instructions=(
                f"Perform a mid-week hydration check for {target_plant_5.name}. "
                f"For broadleaf varieties, gently wipe dust off foliage with a damp cloth to maximize light absorption."
            ),
            estimatedMinutes=max(10, base_mins - 5),
            tools=["Damp cotton cloth", "Misting spray bottle / watering can"],
            careTips="Dust buildup can block up to 30% of photosynthetically active radiation on indoor and patio leaves.",
            completed=False
        )
    )

    # Day 6 (Saturday): Weekend Harvest, Trellising & Propagation
    harvest_plant = next((p for p in selected_plants if p.category in ["vegetable", "herb", "fruit"]), selected_plants[0])
    tasks.append(
        TaskItem(
            id=f"task-{uuid.uuid4().hex[:8]}",
            day="Saturday",
            title=f"Careful Harvest & Staking Support",
            plantId=harvest_plant.id if harvest_plant else None,
            plantName=harvest_plant.name if harvest_plant else "Harvest Crops",
            category="harvesting",
            instructions=(
                f"Harvest tender leaves, sprigs, or ripe produce from {harvest_plant.name} using clean snips. "
                f"Check stakes, ties, and supports to ensure stems don't bend or snap under fruiting weight."
            ),
            estimatedMinutes=base_mins + 10,
            tools=["Harvest snips or sharp garden scissors", "Garden twine or soft plant ties", "Harvest basket"],
            careTips=(
                f"Harvest in the early morning before midday heat when natural sugars and essential oils are concentrated."
            ),
            completed=False
        )
    )

    # Day 7 (Sunday): Garden Reflection & Mulch Dressing
    tasks.append(
        TaskItem(
            id=f"task-{uuid.uuid4().hex[:8]}",
            day="Sunday",
            title="Garden Walkthrough & Soil Moisture Mulch Top-Up",
            plantId=None,
            plantName="Garden Ecosystem",
            category="soil",
            instructions=(
                f"Take a relaxed 15-minute screen-free walkthrough of your {profile.gardenType} garden. "
                f"Top dress any exposed soil with a thin layer of compost or mulch to retain moisture for the coming week."
            ),
            estimatedMinutes=base_mins,
            tools=["Gardening gloves", "Mulch or organic compost"],
            careTips="Regular observation is the best fertilizer; notice subtle growth shifts before issues arise.",
            completed=False
        )
    )

    plant_names = ", ".join([p.name for p in selected_plants[:4]])
    theme = f"Mindful Rhythms & Root Care for {profile.gardenType.capitalize()} Spaces"
    summary = (
        f"A tailored 7-day care schedule focusing on {plant_names}. "
        f"Calibrated for {profile.experience.capitalize()} gardeners with {profile.sunlight.replace('_', ' ')} exposure. "
        f"Designed to maximize plant vigor while keeping screen time minimal."
    )

    garden_tips = [
        "Water early in the morning (between 6 AM and 9 AM) so foliage dries quickly during daylight.",
        "Healthy roots require aeration as much as moisture; allow soil to breathe between deep waterings.",
        "Regular gentle pinching of growth tips stimulates natural compact bushiness without chemical plant retardants.",
        "Observe companion relationships: aromatic herbs actively dissuade destructive vegetable pests."
    ]

    return WeeklyPlan(
        id=f"plan-{uuid.uuid4().hex[:12]}",
        createdAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        weekTheme=theme,
        season="Active Growing Season",
        summary=summary,
        tasks=tasks,
        gardenTips=garden_tips
    )

async def generate_ollama_plan(
    profile: GardenProfile,
    model_name: str,
    ollama_url: str,
    plants_db: List[Plant]
) -> Tuple[Optional[WeeklyPlan], Optional[str]]:
    """Attempts to query the local Ollama instance for a weekly plan; returns (plan, error_message)."""
    endpoint = f"{ollama_url.rstrip('/')}/api/generate"
    
    # Filter botanical knowledge for relevant plants
    relevant_plants = []
    for pid in profile.plants:
        p = find_plant(plants_db, pid)
        if p:
            relevant_plants.append({
                "name": p.name,
                "category": p.category,
                "sunlight": p.sunlightHours,
                "watering": p.wateringInstructions,
                "careTips": p.careTips
            })

    system_prompt = (
        "You are GrowWise, an expert master horticulturist and local-first AI gardening planner. "
        "Your mission is to help people spend less time on screens and more time in nature caring for plants. "
        "Generate a structured weekly gardening plan in valid JSON format. "
        "Strictly return ONLY raw JSON conforming to this schema without markdown fences:\n"
        "{\n"
        '  "weekTheme": "string",\n'
        '  "season": "string",\n'
        '  "summary": "string",\n'
        '  "gardenTips": ["string", "string"],\n'
        '  "tasks": [\n'
        "    {\n"
        '      "id": "task-1",\n'
        '      "day": "Monday",\n'
        '      "title": "Short actionable title",\n'
        '      "plantName": "Plant Name",\n'
        '      "category": "watering|pruning|feeding|pest_check|harvesting|soil",\n'
        '      "instructions": "Clear, practical, concise instruction",\n'
        '      "estimatedMinutes": 15,\n'
        '      "tools": ["Tool 1", "Tool 2"],\n'
        '      "careTips": "Helpful botanical tip"\n'
        "    }\n"
        "  ]\n"
        "}"
    )

    user_prompt = (
        f"Garden Profile:\n"
        f"- Type: {profile.gardenType}\n"
        f"- Sunlight: {profile.sunlight}\n"
        f"- Space: {profile.spaceSize}\n"
        f"- Experience: {profile.experience}\n"
        f"- Weekly Time: {profile.weeklyTime}\n"
        f"- Plants: {json.dumps(relevant_plants, ensure_ascii=False)}\n\n"
        f"Generate 7 practical tasks (Monday through Sunday) tailored specifically to this garden setup. "
        f"Prioritize actionable instructions, realistic tool requirements, and concise times."
    )

    payload = {
        "model": model_name,
        "system": system_prompt,
        "prompt": user_prompt,
        "stream": False,
        "format": "json",
        "options": {
            "temperature": 0.4,
            "num_predict": 1500
        }
    }

    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            resp = await client.post(endpoint, json=payload)
            if resp.status_code != 200:
                return None, f"Ollama HTTP {resp.status_code}: {resp.text}"
            
            result = resp.json()
            raw_response = result.get("response", "").strip()
            
            # Clean markdown code fences if present
            if raw_response.startswith("```json"):
                raw_response = raw_response[7:]
            if raw_response.startswith("```"):
                raw_response = raw_response[3:]
            if raw_response.endswith("```"):
                raw_response = raw_response[:-3]
            raw_response = raw_response.strip()

            parsed = json.loads(raw_response)
            
            # Validate and format tasks
            tasks_data = parsed.get("tasks", [])
            tasks: List[TaskItem] = []
            for idx, t in enumerate(tasks_data):
                p_obj = find_plant(plants_db, t.get("plantName", ""))
                tasks.append(
                    TaskItem(
                        id=f"ai-task-{idx+1}-{uuid.uuid4().hex[:6]}",
                        day=t.get("day", f"Day {idx+1}"),
                        title=t.get("title", "Gardening Task"),
                        plantId=p_obj.id if p_obj else None,
                        plantName=t.get("plantName", "Garden"),
                        category=t.get("category", "watering"),
                        instructions=t.get("instructions", "Tend to your garden thoughtfully."),
                        estimatedMinutes=int(t.get("estimatedMinutes", 15)),
                        tools=t.get("tools", ["Watering can"]),
                        careTips=t.get("careTips", "Work mindfully with clean hands."),
                        completed=False
                    )
                )

            plan = WeeklyPlan(
                id=f"plan-{uuid.uuid4().hex[:12]}",
                createdAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),
                weekTheme=parsed.get("weekTheme", "Holistic Weekly Care"),
                season=parsed.get("season", "Current Season"),
                summary=parsed.get("summary", "Personalized weekly schedule generated by local AI."),
                tasks=tasks,
                gardenTips=parsed.get("gardenTips", ["Inspect plants with curiosity and patience."])
            )
            return plan, None
    except Exception as e:
        return None, str(e)
