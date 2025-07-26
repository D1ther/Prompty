from fastapi import FastAPI

from app.endpoints.users import user_router

endpoints_list = [
    user_router,

]

def including_endpoints(app: FastAPI):
    for endpoint in endpoints_list:
        app.include_router(endpoint)