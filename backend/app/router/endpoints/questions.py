from fastapi import APIRouter
from app.pydantic_models.quiz import Quiz
from app.pydantic_models.question import Question

from app.db.questions import get_all_questions

# Explicitly load the .env file from backend/.env
router = APIRouter()

@router.get("/questions", response_model=Quiz)
def get_questions_handler():
    questions = get_all_questions()

    return questions


@router.post("/answers" )
def check_answer_handler(answer: str, question: Question, source_material: str):
    # TODO

    return