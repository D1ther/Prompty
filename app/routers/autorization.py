from fastapi import (
    APIRouter,
    Request
)

from fastapi.responses import HTMLResponse

from app.routers.default import templates

auth_router = APIRouter(prefix="/auth", tags=["Authorization", "Templates"])

@auth_router.get("/login", response_class=HTMLResponse)
async def login(request: Request):
    
    return templates.TemplateResponse(
        "login.html",
        {"request": request}
    )

@auth_router.get("/register", response_class=HTMLResponse)
async def register(request: Request):
    return templates.TemplateResponse(
        "register.html",
        {"request": request}
    )