from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from app.routers import including_routers
from app.endpoints import including_endpoints

import uvicorn

app = FastAPI(
    title="Prompty app",
    debug=True
)

app.add_middleware(
    SessionMiddleware,
    secret_key="prompty-secret-key-2025-change-in-production"
)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

def main():
    including_endpoints(app)
    including_routers(app)
    uvicorn.run(
        app=app,
        port=8000,
        host="127.0.0.1"
    )

