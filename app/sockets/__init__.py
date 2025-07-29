from fastapi import FastAPI

from app.sockets.chat import (
    chat_websocket
)

def init_sockets(app: FastAPI):
    app.include_router(chat_websocket)