from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from app.database.database import Base


class WasteBinTelemetry(Base):
    __tablename__ = "wastebin_telemetry"

    id = Column(Integer, primary_key=True, index=True)

    asset_id = Column(String, nullable=False)
    sensor_module = Column(String, default="MAIN")

    latitude = Column(Float)
    longitude = Column(Float)

    device_timestamp = Column(String)
    received_timestamp = Column(DateTime, default=datetime.utcnow)

    fill_level = Column(Float)
    gas_level = Column(Float)
    weight = Column(Float)
    battery = Column(Float)

    status = Column(String, default="Healthy")
    fault = Column(String, default="None")
