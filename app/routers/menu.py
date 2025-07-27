from fastapi import (
    APIRouter,
    Request,
    Depends
)

from fastapi.responses import (
    HTMLResponse,
    RedirectResponse
)

from app.db.queries import (
    get_directly_by_id
)

from app.routers.routers_config import templates

from app.login_config import require_authentication


menu_router = APIRouter(prefix="/menu", tags=["menu", "Templates"])

# Вибір програми
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

# Деталі програми
@menu_router.get("/directly/{program_id}", response_class=HTMLResponse)
async def menu_directly_program(request: Request, program_id: int, user = Depends(require_authentication)):

    if not user:
        return RedirectResponse(
            "/auth/login",
            status_code=303
        )
    
    directly = get_directly_by_id(program_id)

    if not directly:
        return RedirectResponse(
            "/error/404"
        )
    
    return templates.TemplateResponse(
        "directly_program.html",
        {
            "request": request,
            "user": user,
            "program_info": directly,
            "program": directly["lessons"]
        }
    )
    