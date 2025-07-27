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

# головна сторінка
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

# контакти
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

# про нас
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

# як це працює
@default_router.get("/how-it-works", response_class=HTMLResponse)
async def how_it_works_route(request: Request):

    user = request.session.get("user", None)

    return templates.TemplateResponse(
        "how_it_work.html",
        {
            "request": request,
            "user": user
        }
    )

# Можливості
@default_router.get("/features", response_class=HTMLResponse)
async def error_route(request: Request):
    user = request.session.get("user", None)

    return templates.TemplateResponse(
        "features.html",
        {
            "request": request,
            "user": user
        }
    )

