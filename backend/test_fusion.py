from app.ai.fusion import normalize_telemetry
from app.database.database import SessionLocal
from app.database.models.streetlight import StreetlightTelemetry


db = SessionLocal()

record = db.query(StreetlightTelemetry).first()

if record:
    result = normalize_telemetry("streetlight", record)
    print(result)
else:
    print("No streetlight telemetry found.")

db.close()
