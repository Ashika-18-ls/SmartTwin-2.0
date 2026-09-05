def detect_anomalies(asset_type, sensors):
    anomalies = []

    if asset_type == "streetlight":
        if sensors["current"] >= 4.4:
            anomalies.append("Critical current")
        elif sensors["current"] >= 3.5:
            anomalies.append("High current")

        if sensors["ldr"] >= 850:
            anomalies.append("Critical ambient light")
        elif sensors["ldr"] >= 600:
            anomalies.append("High ambient light")

        if sensors["voltage"] <= 195:
            anomalies.append("Critical low voltage")
        elif sensors["voltage"] <= 210:
            anomalies.append("Low voltage")

        if sensors["temperature"] >= 70:
            anomalies.append("Critical temperature")
        elif sensors["temperature"] >= 55:
            anomalies.append("High temperature")

        if sensors["vibration"]:
            anomalies.append("Vibration detected")

    elif asset_type == "pipeline":
        if sensors["pressure"] <= 1.0:
            anomalies.append("Critical low pressure")
        elif sensors["pressure"] <= 2.0:
            anomalies.append("Low pressure")

        if sensors["flow_rate"] <= 10:
            anomalies.append("Critical low flow")
        elif sensors["flow_rate"] <= 40:
            anomalies.append("Low flow")

        if sensors["water_quality"] >= 800:
            anomalies.append("Critical water quality")
        elif sensors["water_quality"] >= 500:
            anomalies.append("Poor water quality")

        if sensors["leak_status"]:
            anomalies.append("Leak detected")

    elif asset_type == "wastebin":
        if sensors["fill_level"] >= 92:
            anomalies.append("Critical fill level")
        elif sensors["fill_level"] >= 75:
            anomalies.append("High fill level")

        if sensors["gas_level"] >= 700:
            anomalies.append("Critical gas level")
        elif sensors["gas_level"] >= 450:
            anomalies.append("High gas level")

        if sensors["weight"] >= 105:
            anomalies.append("Critical weight")
        elif sensors["weight"] >= 85:
            anomalies.append("High weight")

        if sensors["battery"] <= 12:
            anomalies.append("Critical low battery")
        elif sensors["battery"] <= 30:
            anomalies.append("Low battery")

    elif asset_type == "public_toilet":
        if sensors["temperature"] >= 44:
            anomalies.append("Critical temperature")
        elif sensors["temperature"] >= 38:
            anomalies.append("High temperature")

        if sensors["humidity"] >= 92:
            anomalies.append("Critical humidity")
        elif sensors["humidity"] >= 80:
            anomalies.append("High humidity")

        if sensors["ammonia"] >= 650:
            anomalies.append("Critical ammonia")
        elif sensors["ammonia"] >= 400:
            anomalies.append("High ammonia")

        if sensors["water_level"] <= 8:
            anomalies.append("Critical low water level")
        elif sensors["water_level"] <= 25:
            anomalies.append("Low water level")

    return anomalies
