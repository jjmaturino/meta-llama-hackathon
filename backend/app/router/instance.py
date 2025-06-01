from fastapi import APIRouter

from app.router.endpoints import(
    notes,
    users,
    questions,
    answers,
)



api_router = APIRouter()

api_router.include_router(
    notes.router,
    prefix="/notes",
    tags=["notes"],
    dependencies=[],
)

api_router.include_router(
    questions.router,
    prefix="/questions",
    tags=["questions"],
    dependencies=[],
)

api_router.include_router(
    users.router,
    prefix="/users",
    tags=["users"],
    dependencies=[],
)

api_router.include_router(
    answers.router,
    prefix="/answers",
    tags=["answers"],
    dependencies=[],
)

