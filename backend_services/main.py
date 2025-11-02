from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import router as api_router

app = FastAPI()

# Set up CORS
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://.*prodaive.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"Hello": "World"}
