from fastapi import (
    APIRouter,
    HTTPException,
    Request
)

from fastapi.responses import JSONResponse

from app.db.queries import (
    create_user,
    get_user_by_email,
    verefy_user
)

from app.validators import (
    RegiterUserModel,
    LogginUserModel
)

from fastapi_login.exceptions import InvalidCredentialsException

user_router = APIRouter(prefix="/users", tags=["users"])

# Реєстрація нового юзера
@user_router.post("/register_user")
async def register_new_user(user: RegiterUserModel, request: Request):

    try:
        result = create_user(
            username=user.username,
            email=user.email,
            password=user.password
        )

        if "error" in result:
            raise HTTPException(
                status_code=result["status"],
                detail=result["error"]
            )
        
        request.session["user"] = {
            "username": user.username,
            "email": user.email
        }
        
        return result
    
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
# Вхід в акаунт
@user_router.post("/login")
async def login_user(user: LogginUserModel, request: Request):
    try:
        verefication = verefy_user(
            email=user.email,
            password=user.password
        )

        if "error" in verefication:
            raise HTTPException(
                status_code=verefication["status"],
                detail=verefication["error"]
            )
        
        request.session["user"] = {
            "username": verefication["username"],
            "email": verefication["email"]
        }

        return verefication
    
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
