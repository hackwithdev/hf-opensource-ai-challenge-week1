from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class PestProblem(BaseModel):
    problem: str
    solution: str

class Plant(BaseModel):
    id: str
    name: str
    scientificName: str
    category: str
    difficulty: str
    sunlight: str
    sunlightHours: str
    watering: str
    wateringInstructions: str
    soil: str
    idealTemperature: str
    spacing: str
    daysToHarvest: Optional[int] = None
    companionPlants: List[str] = Field(default_factory=list)
    pestsAndProblems: List[PestProblem] = Field(default_factory=list)
    careTips: List[str] = Field(default_factory=list)
    icon: str = "🌱"

class GardenProfile(BaseModel):
    gardenType: str = Field(..., description="indoor, balcony, terrace, backyard")
    sunlight: str = Field(..., description="full_sun, partial_sun, indirect, shade")
    spaceSize: str = Field(default="medium", description="compact, medium, large")
    experience: str = Field(default="beginner", description="beginner, intermediate, expert")
    weeklyTime: str = Field(default="1-2 hours", description="available time per week")
    plants: List[str] = Field(default_factory=list, description="IDs or names of plants grown")
    notes: Optional[str] = None

class TaskItem(BaseModel):
    id: str
    day: str = Field(..., description="e.g. Monday, Tuesday, or Day 1")
    title: str
    plantId: Optional[str] = None
    plantName: str
    category: str = Field(..., description="watering, pruning, feeding, pest_check, harvesting, soil")
    instructions: str
    estimatedMinutes: int = 15
    tools: List[str] = Field(default_factory=list)
    careTips: str
    completed: bool = False
    observation: Optional[str] = None

class WeeklyPlan(BaseModel):
    id: str
    createdAt: str
    weekTheme: str
    season: str
    summary: str
    tasks: List[TaskItem]
    gardenTips: List[str] = Field(default_factory=list)

class GeneratePlanRequest(BaseModel):
    profile: GardenProfile
    modelName: Optional[str] = "gemma:2b"
    ollamaUrl: Optional[str] = "http://localhost:11434"

class GeneratePlanResponse(BaseModel):
    plan: WeeklyPlan
    engineUsed: str  # "ollama" or "botanical_heuristic"
    modelUsed: Optional[str] = None
    notes: Optional[str] = None

class HealthStatus(BaseModel):
    status: str
    ollamaAvailable: bool
    ollamaUrl: str
    models: List[str] = Field(default_factory=list)
    plantCount: int

class AdviceRequest(BaseModel):
    question: str
    plantName: Optional[str] = None
    modelName: Optional[str] = "gemma:2b"
    ollamaUrl: Optional[str] = "http://localhost:11434"

class AdviceResponse(BaseModel):
    answer: str
    source: str
