from fastapi import (
    APIRouter,
    Request,
    HTTPException,
    Depends
)

from fastapi.responses import (
    RedirectResponse
)

from app.login_config import require_authentication

directly_router = APIRouter(prefix="/directly", tags=["directly"])

