from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routers import including_routers

import uvicorn

app = FastAPI(
    title="Prompty app",
    debug=True
)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

def main():
    including_routers(app)
    uvicorn.run(
        app=app,
        port=8000,
        host="127.0.0.1"
    )

