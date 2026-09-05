def classify_fault(asset_type, sensors):
    if asset_type == "streetlight":

        if sensors["current"] <= 0.1 and sensors["ldr"] >= 850:
            return "Lamp Failure"

        if sensors["vibration"] and sensors["current"] >= 4.4:
            return "Pole Hit"

        if sensors["voltage"] == 0 and sensors["current"] == 0:
            return "Power Failure"

        if sensors["voltage"] <= 195:
            return "Low Voltage"

        if sensors["ldr"] >= 999 and sensors["temperature"] >= 88:
            return "Sensor Failure"

    elif asset_type == "pipeline":

        if sensors["leak_status"] and sensors["pressure"] <= 2.0:
            return "Leak"

        if sensors["flow_rate"] <= 10 and sensors["pressure"] >= 9.0:
            return "Blockage"

        if sensors["pressure"] <= 1.0:
            return "Pressure Drop"

        if sensors["flow_rate"] == 0 and sensors["pressure"] <= 0.5:
            return "Valve Failure"

    elif asset_type == "wastebin":

        if sensors["fill_level"] >= 92 and sensors["weight"] >= 105:
            return "Overflow"

        if sensors["gas_level"] >= 700:
            return "Gas Leak"

        if sensors["fill_level"] == 0 and sensors["weight"] == 0:
            return "Sensor Failure"

        if sensors["battery"] <= 12:
            return "Battery Low"

    elif asset_type == "public_toilet":

        if sensors["ammonia"] >= 650:
            return "Bad Odor"

        if sensors["humidity"] >= 92 and sensors["water_level"] >= 95:
            return "Overflow"

        if sensors["water_level"] <= 8:
            return "Water Shortage"

        if sensors["ammonia"] >= 400 and sensors["humidity"] >= 80:
            return "Cleaning Required"

    return None