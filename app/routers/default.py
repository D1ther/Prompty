from fastapi import (
    Request,
    APIRouter,
    Depends
)

from fastapi.responses import (
    HTMLResponse
)

from app.routers.routers_config import templates
from app.login_config import require_authentication

default_router = APIRouter(prefix="", tags=["default", "Templates"])

@default_router.get("/", response_class=HTMLResponse)
async def default_route(request: Request):

    user = request.session.get("user", None)

    return templates.TemplateResponse(
        "home.html",
        {
            "request": request,
            "user": user
        }
    )

@default_router.get("/contacts", response_class=HTMLResponse)
async def opportunities_route(request: Request):

    user = request.session.get("user", None)
    return templates.TemplateResponse(
        "contacts.html",
        {
            "request": request,
            "user": user
        }
    )

@default_router.get("/about-us", response_class=HTMLResponse)
async def about_us_route(request: Request):

    user = request.session.get("user", None)
    return templates.TemplateResponse(
        "about-us.html",
        {
            "request": request,
            "user": user
        }
    )