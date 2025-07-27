from fastapi import FastAPI

from app.endpoints.users import user_endpoint
from app.endpoints.directlies import directly_router

endpoints_list = [
    user_endpoint,
    directly_router
]

def including_endpoints(app: FastAPI):
    for endpoint in endpoints_list:
        app.include_router(endpoint)