from fastapi import (
    APIRouter,
    WebSocket,
    Depends
)

from fastapi.responses import RedirectResponse

from fastapi.exceptions import WebSocketException

from app.tools.ai import (
    AiEvaluationModel,
    AiGenerateResultModel
)

from app.db.queries import (
    get_lesson_by_id,
    add_prompt,
    get_all_prompts
)

from app.login_config import require_authentication

import json

chat_websocket = APIRouter(prefix="/ws/chat", tags=["Chat"])

@chat_websocket.websocket("/chat")
async def chat_lesson(websocket: WebSocket, lesson_id: int):

    await websocket.accept()

    try:
        user = websocket.session["user"]
        if not user:
            await websocket.close(code=1008, reason="Authentication required")
            return 
        
        lesson = get_lesson_by_id(lesson_id)

        if not lesson:
            await websocket.close(code=1008, reason="Lesson not found")
            return 

        await websocket.send_text(
            json.dumps(lesson)
        )

        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)

            if message_data.get("prompt"):
                prompt = message_data["prompt"]
                add_prompt(user["email"], lesson_id, prompt)

                try:
                    prompts = get_all_prompts(user["email"])

                    evaluation_model = AiEvaluationModel(theme=lesson["directly"]["title"], lesson_description=lesson["description"], last_prompts=prompts)

                    result_model = AiGenerateResultModel(theme=lesson["directly"]["title"], last_prompts=prompts)

                    evaluation = await evaluation_model.evaluate(prompt)

                    evaluation_response = {
                        "type": "evaluation",
                        "evaluation": evaluation
                    }

                    await websocket.send_text(
                        json.dumps(evaluation_response)
                    )

                    generated_content = await result_model.generate_result(prompt)
                    
                    result_response = {
                        "type": "result",
                        "content": generated_content,
                        "result": generated_content
                    }

                    await websocket.send_text(
                        json.dumps(result_response)
                    )
                    

                except Exception as ai_error:
                    error_response = {
                        "type": "error",
                        "message": f"Помилка AI: {str(ai_error)}"
                    }
                    await websocket.send_text(
                        json.dumps(error_response)
                    )

    except Exception as e:
        await websocket.close(code=1011, reason=str(e))
        raise WebSocketException(
            code=1011,
            reason=str(e)
        )


