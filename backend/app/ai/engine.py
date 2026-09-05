from app.ai.anomaly import detect_anomalies
from app.ai.fault_classifier import classify_fault
from app.ai.health import calculate_health_score
from app.ai.priority import calculate_priority
from app.ai.recommendation import get_recommendation


def analyze_asset(asset_type, sensors):
    anomalies = detect_anomalies(asset_type, sensors)

    fault = classify_fault(asset_type, sensors)

    health_score = calculate_health_score(anomalies)

    priority = calculate_priority(health_score, fault)

    recommendation = get_recommendation(asset_type, fault)

    return {
        "anomalies": anomalies,
        "fault": fault,
        "health_score": health_score,
        "priority": priority,
        "recommendation": recommendation
    }
