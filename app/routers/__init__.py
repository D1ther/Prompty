from fastapi import FastAPI

from app.routers.default import default_router
from app.routers.autorization import auth_router
from app.routers.rules import rules_router
from app.routers.menu import menu_router
from app.routers.error import error_router
from app.routers.users import user_router

routers = [
    default_router,
    auth_router,
    rules_router,
    menu_router,
    error_router,
    user_router
]

def including_routers(app: FastAPI):
    for route in routers:
        app.include_router(route)