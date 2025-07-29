from fastapi import FastAPI

from app.endpoints.users import user_endpoint
from app.endpoints.directlies import directly_router
from app.endpoints.ai import ai_router
from app.endpoints.lesson import lesson_endpoint

endpoints_list = [
    user_endpoint,
    directly_router,
    ai_router,
    lesson_endpoint
]

def including_endpoints(app: FastAPI):
    for endpoint in endpoints_list:
        app.include_router(endpoint)