from fastapi import APIRouter, HTTPException
from typing import List, Tuple, Union
from app.db.quizzes import get_quiz, create_quiz

from app.pydantic_models.quiz import Quiz
from app.pydantic_models.question import Question
from app.pydantic_models.multiselect_question import MultiSelectQuestion
from pydantic import BaseModel
from app.utils.tools import create_questions
from app.db.notes import get_all_notes

router = APIRouter()


class CreateQuizRequest(BaseModel):
    type: str  # "short answer" or "multiselect"
    playermode: str  # "single" or "multi"
    notes: List[int]  # List of note IDs to link questions to

@router.post("/")
def create_quiz_handler(request: CreateQuizRequest):
    content = ""
    all_notes = get_all_notes()

    for note_id in request.notes:   
        content += all_notes[note_id].notes

    new_questions = create_questions(document=content, number_of_questions=4, question_type=request.type)
    q_answered = [False] * len(new_questions)


    quiz = Quiz(
        ID = 0,    
        questions=new_questions,
        are_q_answered=q_answered,
        score=0,
        notes=request.notes,
        type=request.type,
        playermode=request.playermode)
 
    
    new_quiz = create_quiz(quiz)
    return new_quiz

@router.get("/{quiz_id}")
def get_quiz_handler(quiz_id: int):
    quiz = get_quiz(quiz_id)

    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz


