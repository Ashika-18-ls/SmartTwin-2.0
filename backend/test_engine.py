from app.ai.engine import analyze_asset


wastebin = {
    "fill_level": 99,
    "gas_level": 120,
    "weight": 112,
    "battery": 88
}

result = analyze_asset("wastebin", wastebin)

print(result)
