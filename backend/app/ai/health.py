def calculate_health_score(anomalies, fault=None):
    score = 100

    for anomaly in anomalies:
        if "Critical" in anomaly:
            score -= 25
        else:
            score -= 10

    if fault is not None:
        score -= 30

    return max(score, 0)
