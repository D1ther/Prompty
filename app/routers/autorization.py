from fastapi import (
    APIRouter,
    Request,
    Depends,
    HTTPException
)

from dotenv import load_dotenv

from fastapi.responses import (
    HTMLResponse,
    RedirectResponse
)

from app.routers.default import templates
from app.login_config import require_authentication

import requests
import os

auth_router = APIRouter(prefix="/auth", tags=["Authorization", "Templates"])

load_dotenv()
STANDART_URL = os.getenv("STANDART_URL")

# Вхід в акаунт
@auth_router.get("/login")
async def login(request: Request, user=Depends(require_authentication)):

    if not user:
        return templates.TemplateResponse(
            "login.html",
            {"request": request}
        )
    
    return RedirectResponse(
        "/"
    )

# Реєстраці
@auth_router.get("/register", response_class=HTMLResponse)
async def register(request: Request, user=Depends(require_authentication)):

    if not user:
        return templates.TemplateResponse(
            "register.html",
            {"request": request}
        )
    
    return RedirectResponse(
        "/"
    )

# Вихід з акаунту
@auth_router.get("/logout", response_class=RedirectResponse)
async def logout(request: Request, user=Depends(require_authentication)):
    try:

        request.session.clear()

        return RedirectResponse(
            f"/",
            status_code=303
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )