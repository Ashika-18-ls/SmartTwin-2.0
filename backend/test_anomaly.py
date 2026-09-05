from app.ai.anomaly import detect_anomalies


# Test 1: Normal waste bin
normal_bin = {
    "fill_level": 42,
    "gas_level": 120,
    "weight": 18,
    "battery": 88
}

print("Normal bin:")
print(detect_anomalies("wastebin", normal_bin))


# Test 2: Waste bin overflow
overflow_bin = {
    "fill_level": 99,
    "gas_level": 120,
    "weight": 112,
    "battery": 88
}

print("\nOverflow bin:")
print(detect_anomalies("wastebin", overflow_bin))
