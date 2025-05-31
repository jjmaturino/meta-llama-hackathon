from fastapi import APIRouter
from app.pydantic_models.quiz import Quiz
from app.pydantic_models.question import Question
from app.pydantic_models.multiselect_question import MultiSelectQuestion

router = APIRouter()

@router.get("/questions", response_model=Quiz)
def get_questions():
    # Hardcoded template with several normal and multiselect questions
    quiz = Quiz(questions=[
        Question(
            question="What is the capital of France?",
            answer="Paris"
        ),
        MultiSelectQuestion(
            question="Which of the following are programming languages?",
            options=["Python", "HTML", "JavaScript", "CSS"],
            correct_answer=0
        ),
        Question(
            question="What is the rest energy of an electron (in MeV)?",
            answer="0.511"
        ),
        MultiSelectQuestion(
            question="Which of the following particles is a boson?",
            options=["Photon", "Electron", "Neutrino", "Muon"],
            correct_answer=0
        ),
        Question(
            question="What equation relates total energy, momentum, and rest mass in special relativity?",
            answer="E² = (pc)² + (mc²)²"
        ),
        MultiSelectQuestion(
            question="Which of these functions is an eigenfunction of the one-dimensional free-particle Schrödinger operator?",
            options=[
                "Plane wave e^{ikx}",
                "Gaussian wave packet",
                "Polynomial x²",
                "Lorentzian 1/(x²+1)"
            ],
            correct_answer=0
        ),
        Question(
            question="Which theorem connects continuous symmetries to conservation laws in physics?",
            answer="Noether's theorem"
        )
    ])
    return quiz
