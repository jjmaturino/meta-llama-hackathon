from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.router.instance import api_router
from typing import Dict
from app.pydantic_models.notes import Note
from app.pydantic_models.question import Question
from app.pydantic_models.quiz import Quiz


# In-memory "databases"
notes_db: Dict[int, Note] = {}
questions_db: Dict[int, Question] = {}
quizzes_db: Dict[int, Quiz] = {}

# Simple ID counters for each type
next_note_id: int = 1
next_question_id: int = 1
next_quiz_id: int = 1


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
