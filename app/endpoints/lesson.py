from fastapi import (
    APIRouter,
    Request,
    Depends,
    HTTPException
)

from fastapi.responses import (
    RedirectResponse
)

from app.login_config import require_authentication

from app.db.queries import (
    complete_lesson
)

lesson_endpoint = APIRouter(prefix="/lesson", tags=["Lesson"])


