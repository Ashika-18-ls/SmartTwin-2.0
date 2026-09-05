def calculate_health_score(anomalies):
    score = 100

    for anomaly in anomalies:
        if "Critical" in anomaly:
            score -= 25
        else:
            score -= 10

    return max(score, 0)
