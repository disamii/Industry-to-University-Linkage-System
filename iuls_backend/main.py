from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import engine
import models
from routers import users, industry, org_units, posts, assignments, kpis, auth

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="IULS Backend API")

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    # Add other origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(industry.router)
app.include_router(org_units.router)
app.include_router(posts.router)
app.include_router(assignments.router)
app.include_router(kpis.router)


@app.get("/")
def read_root():
    return {"message": "IULS Backend API"}
