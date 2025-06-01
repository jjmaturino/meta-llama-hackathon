from fastapi import APIRouter
from app.pydantic_models.quiz import Quiz
from app.pydantic_models.question import Question
from app.pydantic_models.multiselect_question import MultiSelectQuestion
from openai import OpenAI
import os
from dotenv import load_dotenv

# Explicitly load the .env file from backend/.env
router = APIRouter()

@router.get("/questions", response_model=Quiz)
def get_questions():
    # Hardcoded template with several normal and multiselect questions
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), '.env'))

    client = OpenAI(
    api_key=os.environ.get("LLAMA_API_KEY"), 
    base_url="https://api.llama.com/compat/v1/"
)
    
    # Build the path to the markdown file dynamically
    notes_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))),
        "notes",
        "Notes on Transforms d557c60e03b64da285174f30cb0e2c18.md"
    )
    with open(notes_path, "r", encoding="utf-8") as f:
        trans_content = f.read()
    
    completion = client.beta.chat.completions.parse(
    model="Cerebras-Llama-4-Maverick-17B-128E-Instruct",
    messages=[
        {"role": "system", "content": "You are a quiz creator. You create short answer questions (not multiselect) only. You will be given a document and you will need to create a quiz from it, wtith 3 questions."},
        {
          "role": "user",
          "content": f"Generate a quiz based on the following document.\n\n{trans_content}"
        }
    ],
    response_format=Quiz,
)
    quiz = completion.choices[0].message.parsed
    # quiz = Quiz(questions=[
    #     Question(
    #         question="What is the capital of France?",
    #         answer="Paris"
    #     ),
    #     MultiSelectQuestion(
    #         question="Which of the following are programming languages?",
    #         options=["Python", "HTML", "JavaScript", "CSS"],
    #         correct_answer=0
    #     ),
    #     Question(
    #         question="What is the rest energy of an electron (in MeV)?",
    #         answer="0.511"
    #     ),
    #     MultiSelectQuestion(
    #         question="Which of the following particles is a boson?",
    #         options=["Photon", "Electron", "Neutrino", "Muon"],
    #         correct_answer=0
    #     ),
    #     Question(
    #         question="What equation relates total energy, momentum, and rest mass in special relativity?",
    #         answer="E² = (pc)² + (mc²)²"
    #     ),
    #     MultiSelectQuestion(
    #         question="Which of these functions is an eigenfunction of the one-dimensional free-particle Schrödinger operator?",
    #         options=[
    #             "Plane wave e^{ikx}",
    #             "Gaussian wave packet",
    #             "Polynomial x²",
    #             "Lorentzian 1/(x²+1)"
    #         ],
    #         correct_answer=0
    #     ),
    #     Question(
    #         question="Which theorem connects continuous symmetries to conservation laws in physics?",
    #         answer="Noether's theorem"
    #     )
    # ])
    return quiz
