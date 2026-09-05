from app.ai.engine import analyze_asset
from app.database.database import SessionLocal
from app.database.models.wastebin import WasteBinTelemetry

db = SessionLocal()

record = db.query(WasteBinTelemetry).order_by(
    WasteBinTelemetry.id.desc()
).first()

if record:
    sensors = {
        "fill_level": record.fill_level,
        "gas_level": record.gas_level,
        "weight": record.weight,
        "battery": record.battery
    }

    result = analyze_asset("wastebin", sensors)
    print(result)
else:
    print("No waste bin data found.")

db.close()
