from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import notes_db
from app.router.instance import api_router
from app.pydantic_models.notes import Note


# Simple ID counters for each type


def get_application() -> FastAPI:
    application = FastAPI(
        title="llamas go yeerrrrr", openapi_url=f"/v1/openapi.json"
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    note_ds = []

    application.include_router(
        api_router, prefix='/v1'
    )  # uses api router that is imported above

    return application



app = get_application()  # fastapi processes
