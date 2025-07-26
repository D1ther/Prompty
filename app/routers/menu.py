from fastapi import (
    APIRouter,
    Request,
    Depends
)

from fastapi.responses import (
    HTMLResponse,
    RedirectResponse
)

from app.routers.routers_config import templates

from app.login_config import require_authentication

menu_router = APIRouter(prefix="/menu", tags=["menu", "Templates"])

@menu_router.get("/choise-learning-program", response_class=HTMLResponse)
async def menu_learning_program(requst: Request, user = Depends(require_authentication)):

    if user:
        return templates.TemplateResponse(
            "choice_mod.html",
            {
                "request": requst,
                "user": user
            }
        )
    
    return RedirectResponse(
        "/auth/login",
        status_code=303
    )

