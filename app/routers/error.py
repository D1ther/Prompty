from fastapi import (
    Request,
    APIRouter,
    Depends
)

from fastapi.responses import HTMLResponse

from app.routers.routers_config import templates
from app.login_config import require_authentication

error_router = APIRouter(prefix="/error", tags=["error", "Templates"])

@error_router.get("/404", response_class=HTMLResponse)
async def error_404(request: Request, user = Depends(require_authentication)):
    return templates.TemplateResponse(
        "/errors/404.html",
        {
            "request": request,
            "user": user if user else None
        }
    )