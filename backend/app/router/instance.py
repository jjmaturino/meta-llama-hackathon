from fastapi import APIRouter

from app.router.endpoints import(
    notes,
    users,
)



api_router = APIRouter()

api_router.include_router(
    notes.router,
    prefix="/notes",
    tags=["notes"],
    dependencies=[],
)

api_router.include_router(
    users.router,
    prefix="/users",
    tags=["users"],
    dependencies=[],
)