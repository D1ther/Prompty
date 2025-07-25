from fastapi import (
    Request,
    APIRouter
)

from fastapi.responses import (
    HTMLResponse
)

from app.routers.routers_config import templates

default_router = APIRouter(prefix="", tags=["default"])

@default_router.get("/", response_class=HTMLResponse)
async def default_route(request: Request):

    return templates.TemplateResponse(
        "home.html",
        {"request": request}
    )