from fastapi import APIRouter, HTTPException
from typing import List, Tuple, Union
from app.pydantic_models.quiz import Quiz
from app.pydantic_models.question import Question
from app.pydantic_models.multiselect_question import MultiSelectQuestion
from pydantic import BaseModel

router = APIRouter()

# In-memory store of quizzes
quizes = {}
next_quiz_id = 1  # Start from 1

# Sample quiz for demonstration
sample_quiz = Quiz(
    ID="1",
    questions=[
        (False, Question(question="What is the capital of France?", answer="Paris")),
        (True, Question(question="What is 2+2?", answer="4")),
        (False, MultiSelectQuestion(question="Which are fruits?", options=["Apple", "Car", "Banana", "Dog"], correct_answer=0)),
    ],
    score=0,
    notes=["note1", "note2", "note3"],
    type="short answer",
    playermode="single"
)
quizes[sample_quiz.ID] = sample_quiz
next_quiz_id = 2  # Next available ID

class CreateQuizRequest(BaseModel):
    type: str  # "short answer" or "multiselect"
    playermode: str  # "single" or "multi"
    notes: List[str]  # List of note IDs to link questions to

@router.post("/")
def create_quiz(request: CreateQuizRequest):
    global next_quiz_id
    quiz_id = str(next_quiz_id)
    next_quiz_id += 1

    # Placeholder: Call AI endpoint to generate questions based on notes and type
    if request.type == "short answer":
        questions = [
            (False, Question(question="What is the capital of France?", answer="Paris")),
            (False, Question(question="What is 2+2?", answer="4")),
        ]
    else:
        questions = [
            (False, MultiSelectQuestion(question="Which are fruits?", options=["Apple", "Car", "Banana", "Dog"], correct_answer=0)),
            (False, MultiSelectQuestion(question="Which are colors?", options=["Red", "Table", "Blue", "Chair"], correct_answer=0)),
        ]

    quiz = Quiz(
        ID=quiz_id,
        questions=questions,
        score=0,
        notes=request.notes,
        type=request.type,
        playermode=request.playermode
    )
    quizes[quiz_id] = quiz
    return quiz

@router.get("/{quiz_id}")
def get_quiz(quiz_id: str):
    quiz = quizes.get(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz 