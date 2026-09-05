from app.ai.recommendation import get_recommendation

print(get_recommendation("streetlight", "Lamp Failure"))
print(get_recommendation("pipeline", "Leak"))
print(get_recommendation("wastebin", "Overflow"))
print(get_recommendation("public_toilet", "Water Shortage"))
print(get_recommendation("streetlight", None))
