def normalize_telemetry(asset_type, record):
    """
    Convert asset-specific telemetry into a common format
    for the SmartTwin AI Fusion Engine.
    """

    common_data = {
        "asset_id": record.asset_id,
        "asset_type": asset_type,
        "location": {
            "latitude": record.latitude,
            "longitude": record.longitude,
        },
        "timestamp": record.device_timestamp,
        "status": record.status,
        "fault": record.fault,
        "sensors": {}
    }

    if asset_type == "streetlight":
        common_data["sensors"] = {
            "current": record.current,
            "voltage": record.voltage,
            "temperature": record.temperature,
            "ldr": record.ldr,
            "vibration": record.vibration,
        }

    elif asset_type == "pipeline":
        common_data["sensors"] = {
            "pressure": record.pressure,
            "flow_rate": record.flow_rate,
            "water_quality": record.water_quality,
            "leak_status": record.leak_status,
        }

    elif asset_type == "wastebin":
        common_data["sensors"] = {
            "fill_level": record.fill_level,
            "gas_level": record.gas_level,
            "weight": record.weight,
            "battery": record.battery,
        }

    elif asset_type == "public_toilet":
        common_data["sensors"] = {
            "temperature": record.temperature,
            "humidity": record.humidity,
            "ammonia": record.ammonia,
            "water_level": record.water_level,
            "occupancy": record.occupancy,
        }

    return common_data
