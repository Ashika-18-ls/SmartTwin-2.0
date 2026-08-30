from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models.streetlight import StreetlightTelemetry
from app.database.models.pipeline import PipelineTelemetry
from app.database.models.wastebin import WasteBinTelemetry
from app.database.models.toilet import ToiletTelemetry

router = APIRouter()


@router.post("/sensor-data")
def receive_sensor_data(data: dict, db: Session = Depends(get_db)):

    asset_type = data.get("asset_type")

    print("\n===== SENSOR DATA RECEIVED =====")
    print(data)
    print("================================\n")

    # Currently handle streetlight data only.
    # Other asset types will get their own models/routes next.

    if asset_type == "streetlight":

        telemetry = StreetlightTelemetry(
            asset_id=data.get("node_id"),
            sensor_module=data.get("sensor_module", "MAIN"),
            latitude=data.get("latitude"),
            longitude=data.get("longitude"),
            device_timestamp=data.get("timestamp"),
            current=data.get("current"),
            voltage=data.get("voltage"),
            temperature=data.get("temperature"),
            ldr=data.get("ldr"),
            vibration=data.get("vibration"),
            status=data.get("status", "Healthy"),
            fault=data.get("fault", "None")
        )

        db.add(telemetry)
        db.commit()
        db.refresh(telemetry)

        return {
            "status": "success",
            "message": "Streetlight telemetry stored",
            "id": telemetry.id
        }

    if asset_type == "pipeline":

        telemetry = PipelineTelemetry(
            asset_id=data.get("node_id"),
            sensor_module=data.get("sensor_module", "MAIN"),
            latitude=data.get("latitude"),
            longitude=data.get("longitude"),
            device_timestamp=data.get("timestamp"),

            pressure=data.get("pressure"),
            flow_rate=data.get("flow_rate"),
            water_quality=data.get("water_quality"),
            leak_status=data.get("leak_status"),

            status=data.get("status", "Healthy"),
            fault=data.get("fault", "None")
        )

        db.add(telemetry)
        db.commit()
        db.refresh(telemetry)

        return {
            "status": "success",
            "message": "Pipeline telemetry stored",
            "id": telemetry.id
        }

    if asset_type == "waste_bin":

        telemetry = WasteBinTelemetry(
            asset_id=data.get("node_id"),
            sensor_module=data.get("sensor_module", "MAIN"),

            latitude=data.get("latitude"),
            longitude=data.get("longitude"),

            device_timestamp=data.get("timestamp"),

            fill_level=data.get("fill_level"),
            gas_level=data.get("gas_level"),
            weight=data.get("weight"),
            battery=data.get("battery"),

            status=data.get("status", "Healthy"),
            fault=data.get("fault", "None")
        )

        db.add(telemetry)
        db.commit()
        db.refresh(telemetry)

        return {
            "status": "success",
            "message": "Waste bin telemetry stored",
            "id": telemetry.id
        }

    if asset_type == "public_toilet":

        telemetry = ToiletTelemetry(
            asset_id=data.get("node_id"),
            sensor_module=data.get("sensor_module", "MAIN"),

            latitude=data.get("latitude"),
            longitude=data.get("longitude"),

            device_timestamp=data.get("timestamp"),

            humidity=data.get("humidity"),
            occupancy=data.get("occupancy"),
            water_level=data.get("water_level"),
            ammonia=data.get("ammonia"),

            status=data.get("status", "Healthy"),
            fault=data.get("fault", "None")
        )

        db.add(telemetry)
        db.commit()
        db.refresh(telemetry)

        print("Toilet telemetry stored:", telemetry.id)

        return {
            "status": "success",
            "message": "Toilet telemetry stored",
            "id": telemetry.id
        }


    return {
        "status": "received",
        "message": f"Asset type '{asset_type}' not yet connected to its telemetry table"
    }
