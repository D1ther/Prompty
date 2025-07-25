from fastapi import FastAPI

from app.routers.default import default_router

routers = [
    default_router
]

def including_routers(app: FastAPI):
    for route in routers:
        app.include_router(route)