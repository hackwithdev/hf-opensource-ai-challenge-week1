from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert "ollamaAvailable" in data
    assert data["plantCount"] >= 30

def test_list_plants():
    resp = client.get("/api/plants")
    assert resp.status_code == 200
    plants = resp.json()
    assert len(plants) >= 30
    
    # Test category filter
    herb_resp = client.get("/api/plants?category=herb")
    assert herb_resp.status_code == 200
    herbs = herb_resp.json()
    assert all(p["category"] == "herb" for p in herbs)

def test_single_plant():
    resp = client.get("/api/plants/sweet-basil")
    assert resp.status_code == 200
    plant = resp.json()
    assert plant["name"] == "Sweet Basil"
    assert plant["difficulty"] == "easy"
    assert len(plant["careTips"]) > 0
    assert len(plant["pestsAndProblems"]) > 0

def test_generate_plan_endpoint():
    payload = {
        "profile": {
            "gardenType": "balcony",
            "sunlight": "full_sun",
            "spaceSize": "compact",
            "experience": "beginner",
            "weeklyTime": "1-2 hours",
            "plants": ["sweet-basil", "cherry-tomato"]
        },
        "modelName": "gemma:2b",
        "ollamaUrl": "http://localhost:11434"
    }
    resp = client.post("/api/plan/generate", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "plan" in data
    plan = data["plan"]
    assert len(plan["tasks"]) == 7
    assert plan["tasks"][0]["tools"] is not None
    assert plan["tasks"][0]["estimatedMinutes"] > 0
    assert data["engineUsed"] in ["ollama", "botanical_heuristic"]

def test_advice_endpoint():
    payload = {
        "question": "How often should I water sweet basil?",
        "plantName": "Sweet Basil",
        "modelName": "gemma:2b"
    }
    resp = client.post("/api/advice", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "answer" in data
    assert len(data["answer"]) > 20

if __name__ == "__main__":
    test_health_check()
    test_list_plants()
    test_single_plant()
    test_generate_plan_endpoint()
    test_advice_endpoint()
    print("ALL BACKEND TESTS PASSED SUCCESSFULLY!")
