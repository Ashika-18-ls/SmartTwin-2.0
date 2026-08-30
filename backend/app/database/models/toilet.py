from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from datetime import datetime

from app.database.database import Base


class ToiletTelemetry(Base):
    __tablename__ = "toilet_telemetry"

    id = Column(Integer, primary_key=True, index=True)

    asset_id = Column(String, nullable=False)
    sensor_module = Column(String, default="MAIN")

    latitude = Column(Float)
    longitude = Column(Float)

    device_timestamp = Column(String)
    received_timestamp = Column(DateTime, default=datetime.utcnow)

    humidity = Column(Float)
    occupancy = Column(Boolean)
    water_level = Column(Float)
    ammonia = Column(Float)

    status = Column(String, default="Healthy")
    fault = Column(String, default="None")
