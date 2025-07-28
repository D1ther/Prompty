from pydantic import (
    BaseModel,
    Field
)

class PromptModel(BaseModel):
    text: str = Field(max_length=450, default="Генеруй код мені")