from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from app.database.database import Base


class PipelineTelemetry(Base):
    __tablename__ = "pipeline_telemetry"

    id = Column(Integer, primary_key=True, index=True)

    asset_id = Column(String, nullable=False)
    sensor_module = Column(String, default="MAIN")

    latitude = Column(Float)
    longitude = Column(Float)

    device_timestamp = Column(String)
    received_timestamp = Column(DateTime, default=datetime.utcnow)

    pressure = Column(Float)
    flow_rate = Column(Float)
    water_quality = Column(Float)
    leak_status = Column(String)

    status = Column(String, default="Healthy")
    fault = Column(String, default="None")
