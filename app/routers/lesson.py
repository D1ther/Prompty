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
    get_lesson_by_id
)

from app.routers.routers_config import templates

from app.login_config import require_authentication

lesson_router = APIRouter(prefix="/lesson", tags=["lesson", "Templates"])

@lesson_router.get("/chat/{lesson_id}")
async def lesson_chat(request: Request, lesson_id: int, user = Depends(require_authentication)):
    if not user:
        return RedirectResponse(
            "/auth/login",
            status_code=303
        )
    
    lesson = get_lesson_by_id(lesson_id)

    if not lesson:
        return RedirectResponse(
            "/error/404.html"
        )
    
    return templates.TemplateResponse(
        "lesson_chat.html",
        {
            "request": request,
            "user": user,
            "lesson": lesson
        }
    )

