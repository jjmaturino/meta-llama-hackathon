from app.db import quizzes_db
from app.pydantic_models.quiz import Quiz
from app.db.id_generators import generate_quiz_id
from typing import Optional, List

# --- CRUD Operations for Quizzes ---
def create_quiz(quiz: Quiz) -> Quiz:
    if quiz.ID == 0 or quiz.ID is None:
        quiz.ID = generate_quiz_id()

    quizzes_db[quiz.ID] = quiz
    return quiz

def get_quiz(quiz_id: int) -> Optional[Quiz]:
    return quizzes_db.get(quiz_id)

def get_all_quizzes() -> List[Quiz]:
    return list(quizzes_db.values())

def update_quiz(quiz_id: int, updated_quiz: Quiz) -> Optional[Quiz]:
    if quiz_id in quizzes_db:
        updated_quiz.id = quiz_id
        quizzes_db[quiz_id] = updated_quiz
        return updated_quiz
    return None

def delete_quiz(quiz_id: int) -> bool:
    if quiz_id in quizzes_db:
        del quizzes_db[quiz_id]
        return True
    return False
