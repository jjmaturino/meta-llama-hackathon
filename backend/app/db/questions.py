# --- CRUD Operations for Questions ---
def create_question(question: Question) -> Question:
    if question.id is None:
        question.id = generate_question_id()
    questions_db[question.id] = question
    return question

def get_question(question_id: int) -> Optional[Question]:
    return questions_db.get(question_id)

def get_all_questions() -> List[Question]:
    return list(questions_db.values())

def update_question(question_id: int, updated_question: Question) -> Optional[Question]:
    if question_id in questions_db:
        updated_question.id = question_id
        questions_db[question_id] = updated_question
        return updated_question
    return None

def delete_question(question_id: int) -> bool:
    if question_id in questions_db:
        del questions_db[question_id]
        return True
    return False