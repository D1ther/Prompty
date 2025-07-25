from fastapi import FastAPI

from app.routers.default import default_router
from app.routers.autorization import auth_router
from app.routers.rules import rules_router

routers = [
    default_router,
    auth_router,
    rules_router
]

def including_routers(app: FastAPI):
    for route in routers:
        app.include_router(route)