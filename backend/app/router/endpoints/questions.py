from fastapi import APIRouter
from app.pydantic_models.quiz import Quiz
from app.pydantic_models.question import Question
from app.pydantic_models.multiselect_question import MultiSelectQuestion

router = APIRouter()

@router.get("/questions", response_model=Quiz)
def get_questions():
    # Hardcoded template with one normal question and one multiselect question
    quiz = Quiz(questions=[
        Question(
            question="What is the capital of France?",
            answer="Paris"
        ),
        MultiSelectQuestion(
            question="Which of the following are programming languages?",
            options=["Python", "HTML", "JavaScript", "CSS"],
            correct_answer=0
        )
    ])
    return quiz
