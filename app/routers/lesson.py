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
    get_lesson_by_id,
    complete_lesson,
    get_completed_lessons,
    get_directly_by_id,
    get_user_by_email,
    set_user_level
    
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

@lesson_router.get("/complete/{lesson_id}")
async def complete_lesson_endpoint(request: Request, lesson_id: int, user=Depends(require_authentication)):
    
    if not user:
        return RedirectResponse(
            "/auth/login",
            status_code=303
        )

    result = complete_lesson(user["email"], lesson_id)
    user = get_user_by_email(user["email"])

    if not user:
        return RedirectResponse(
            "/error/404.html"
        )
    
    levels = {
        10: 1,
        20: 2,
        30: 3
    }

    if len(user["completed_lessons"]) in levels:
        level_id = levels[len(user["completed_lessons"])]
        set_user_level(user["email"], level_id)

    if "error" in result:
        return RedirectResponse(
            "/error/404.html",
        )
        
    return templates.TemplateResponse(
        "choice_mod.html",
        {
            "request": request,
            "user": user
        }
    )
