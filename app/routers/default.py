from fastapi import (
    Request,
    APIRouter,
    Depends
)

from fastapi.responses import (
    HTMLResponse
)

from app.routers.routers_config import templates

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