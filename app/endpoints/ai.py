from fastapi import (
    APIRouter,
    Request,
    HTTPException,
    Depends
)

from fastapi.responses import (
    RedirectResponse,
    JSONResponse
)

from app.validators import (
    PromptModel
)

from app.tools.ai import (
    AiEvaluationModel,
    AiGenerateResultModel
)

from app.login_config import require_authentication

ai_router = APIRouter(prefix="/ai", tags=["AI"])

@ai_router.post("/chat", response_class=JSONResponse)
async def chat_with_ai(prompt: PromptModel):
    try:
        print(f"Received prompt: {prompt.text}")
        ai_model = AiEvaluationModel(theme="code")
        evaluation = await ai_model.evaluate(prompt.text)
        return JSONResponse(evaluation)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@ai_router.post("/generate", response_class=JSONResponse)
async def generate_content(prompt: PromptModel):
    try:
        print(f"Generating content for prompt: {prompt.text}")
        ai_model = AiGenerateResultModel(theme="code")
        result = await ai_model.generate_result(prompt.text)
        return JSONResponse(result)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))