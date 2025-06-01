from fastapi import APIRouter, HTTPException
from typing import List, Tuple, Union
from app.pydantic_models.quiz import Quiz
from app.pydantic_models.question import Question
from app.pydantic_models.multiselect_question import MultiSelectQuestion

router = APIRouter()

# In-memory store of quizzes
quizes = {}

# Sample quiz for demonstration
sample_quiz = Quiz(
    ID="quiz1",
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

@router.get("/quizes/{quiz_id}")
def get_quiz(quiz_id: str):
    quiz = quizes.get(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz 