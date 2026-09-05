from app.ai.health import calculate_health_score

print(calculate_health_score([]))
print(calculate_health_score(["High temperature"]))
print(calculate_health_score(["Critical temperature"]))
print(calculate_health_score(["Critical temperature", "High current"]))
