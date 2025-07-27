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
    get_user_by_email,
    get_all_lessons
)

from app.login_config import require_authentication

from app.routers.routers_config import templates

user_router = APIRouter(prefix="/user", tags=["users", "Templates"])

@user_router.get("/{email}")
async def show_user_profile(request: Request, email: str, user = Depends(require_authentication)):

    if not user:
        RedirectResponse(
            "/auth/login",
            status_code=303
        )

    if user["email"] != email:
        return RedirectResponse(
            "/error/403",
            status_code=403
        )
    
    user_data = get_user_by_email(email)
    total_lessons = get_all_lessons()

    return templates.TemplateResponse(
        "profile.html",
        {
            "request": request,
            "user_data": user_data,
            "total_lessons": total_lessons,
            "user": user
        }
    )
    