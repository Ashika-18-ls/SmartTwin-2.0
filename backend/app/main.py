from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.sensors import router as sensor_router

from app.database.database import Base, engine
from app.database.models import *

app = FastAPI(title="SmartTwin Edge Gateway")

# Allow requests from the VSS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all database tables
Base.metadata.create_all(bind=engine)

app.include_router(health_router)
app.include_router(sensor_router)