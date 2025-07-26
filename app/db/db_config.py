from sqlalchemy import (
    create_engine,
)

from sqlalchemy.orm import (
    sessionmaker,
    DeclarativeBase
)

engine = create_engine("sqlite:///app.db", echo=True)

Session = sessionmaker(engine)

class Base(DeclarativeBase):
    ...

from app.db.models import *

def create_db():
    Base.metadata.create_all(engine)

def drop_db():
    Base.metadata.drop_all(engine)