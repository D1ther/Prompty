from fastapi import (
    APIRouter,
    Request
)

from fastapi.responses import HTMLResponse

from app.routers.routers_config import templates

rules_router = APIRouter(prefix="/rules", tags=["rules"])

@rules_router.get("/of_use", response_class=HTMLResponse)
async def rules_of_use(request: Request):

    return templates.TemplateResponse(
        "rules_of_use.html",
        {
            "request": request
        }
    )

@rules_router.get("/privacy", response_class=HTMLResponse)
async def privacy_policy(request: Request):
    return templates.TemplateResponse(
        "privacy_policy.html",
        {
            "request": request
        }
    )