from app.db import notes_db
from app.pydantic_models.notes import Note
from app.db.id_generators import generate_note_id
from typing import Optional, List

# --- CRUD Operations for Notes ---
def create_note(note: Note) -> Note:
    if note.id is None:
        note.id = generate_note_id()
    notes_db[note.id] = note
    return note

def get_note(note_id: int) -> Optional[Note]:
    return notes_db.get(note_id)

def get_all_notes() -> List[Note]:
    return list(notes_db.values())

def update_note(note_id: int, updated_note: Note) -> Optional[Note]:
    if note_id in notes_db:
        updated_note.id = note_id  # Ensure the ID remains consistent
        notes_db[note_id] = updated_note
        return updated_note
    return None

def delete_note(note_id: int) -> bool:
    if note_id in notes_db:
        del notes_db[note_id]
        return True
    return False