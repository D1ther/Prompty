from fastapi import Request
from fastapi.responses import RedirectResponse

async def require_authentication(request: Request):
    user = request.session.get("user", None)

    if not user:
        return None
    
    return user