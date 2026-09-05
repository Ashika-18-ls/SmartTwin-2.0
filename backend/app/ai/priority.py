def calculate_priority(health_score, fault):
    if health_score < 50:
        return "HIGH"
    elif health_score < 75:
        return "MEDIUM"
    else:
        return "LOW"