from app.db import next_note_id, next_question_id, next_quiz_id

def generate_note_id() -> int:
    global next_note_id
    _id = next_note_id
    next_note_id += 1
    return _id

def generate_question_id() -> int:
    global next_question_id
    _id = next_question_id
    next_question_id += 1
    return _id

def generate_quiz_id() -> int:
    global next_quiz_id
    _id = next_quiz_id
    next_quiz_id += 1
    return _id