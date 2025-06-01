from fastapi import APIRouter, HTTPException
from typing import List, Tuple, Union
from app.db.quizzes import get_quiz, create_quiz

from app.pydantic_models.quiz import Quiz
from app.pydantic_models.question import Question
from app.pydantic_models.multiselect_question import MultiSelectQuestion
from pydantic import BaseModel

router = APIRouter()


class CreateQuizRequest(BaseModel):
    type: str  # "short answer" or "multiselect"
    playermode: str  # "single" or "multi"
    notes: List[str]  # List of note IDs to link questions to

@router.post("/")
def create_quiz_handler(request: CreateQuizRequest):

    new_quiz = create_quiz(request)

    return new_quiz

@router.get("/{quiz_id}")
def get_quiz_handler(quiz_id: str):
    quiz = get_quiz(quiz_id)

    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz


