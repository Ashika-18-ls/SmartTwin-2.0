from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime
)

from datetime import datetime

from app.database.database import Base


class StreetlightTelemetry(Base):
    __tablename__ = "streetlight_telemetry"

    id = Column(Integer, primary_key=True, index=True)

    asset_id = Column(String, nullable=False)

    sensor_module = Column(String, default="MAIN")

    latitude = Column(Float)
    longitude = Column(Float)

    device_timestamp = Column(String)

    received_timestamp = Column(
        DateTime,
        default=datetime.utcnow
    )

    current = Column(Float)

    voltage = Column(Float)

    temperature = Column(Float)

    ldr = Column(Float)

    vibration = Column(Boolean)

    status = Column(String)

    fault = Column(String)