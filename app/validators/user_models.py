from pydantic import (
    BaseModel,
    Field,
    EmailStr,
)

class RegiterUserModel(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=8, max_length=32)
    email: EmailStr = Field()

class LogginUserModel(BaseModel):
    email: EmailStr = Field()
    password: str = Field(min_length=8, max_length=32)