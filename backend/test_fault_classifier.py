from app.ai.fault_classifier import classify_fault


tests = [
    (
        "streetlight",
        {
            "current": 0.02,
            "ldr": 940,
            "voltage": 228,
            "temperature": 31,
            "vibration": False
        }
    ),

    (
        "pipeline",
        {
            "pressure": 1.6,
            "flow_rate": 190,
            "water_quality": 210,
            "leak_status": True
        }
    ),

    (
        "wastebin",
        {
            "fill_level": 99,
            "gas_level": 120,
            "weight": 112,
            "battery": 88
        }
    ),

    (
        "public_toilet",
        {
            "temperature": 29,
            "humidity": 96,
            "ammonia": 90,
            "water_level": 100,
            "occupancy": False
        }
    )
]


for asset_type, sensors in tests:
    fault = classify_fault(asset_type, sensors)
    print(asset_type, "→", fault)
