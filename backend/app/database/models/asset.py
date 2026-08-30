from sqlalchemy import (
    Column,
    String,
    Float,
    Boolean
)

from app.database.database import Base


class Asset(Base):
    __tablename__ = "assets"

    # Primary Key
    asset_id = Column(String, primary_key=True)

    # Asset Information
    asset_type = Column(String, nullable=False)

    asset_name = Column(String)

    ward = Column(String)

    # GPS Location
    latitude = Column(Float)

    longitude = Column(Float)

    # Device Information
    installation_date = Column(String)

    manufacturer = Column(String)

    firmware_version = Column(String)

    # Asset Status
    is_active = Column(Boolean, default=True)