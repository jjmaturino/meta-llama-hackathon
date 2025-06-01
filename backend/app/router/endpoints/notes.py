from fastapi import APIRouter, HTTPException
from typing import List
import os
from app.pydantic_models.notes import Note
from app.pydantic_models.question import Question
from pydantic import BaseModel

from app.db.notes import get_all_notes, get_note, create_note
from app.db.id_generators import generate_note_id

from app.utils import fact_judge, completeness_judge, understanding_judge, judge_all

router = APIRouter()


class CreateNoteRequest(BaseModel):
    title: str
    tags: List[str]
    cues: str
    notes: str
    summary: str
    docs: List[str]
    questions: List[Question]

@router.post("/", response_model=Note)
def create_note_handler(request: CreateNoteRequest):
    note = Note(
        id=generate_note_id(),
        title=request.title,
        tags=request.tags,
        cues=request.cues,
        notes=request.notes,
        summary=request.summary,
        docs=request.docs,
        questions=request.questions,
        comprehension_score=0
    )
    new_note = create_note(note)

    return new_note

@router.get("/", response_model=List[Note])
def get_all_notes_handler():
    # List all .md files in the notes directory, return their uuids (filenames without .md)
    return get_all_notes()

@router.get("/{uuid}", response_model=Note)
def get_note_by_uuid_handler(uuid: int):
    note = get_note(uuid)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.post("/{uuid}")
def update_note(uuid: int, note: Note):
    notes_store = get_all_notes()
    if uuid not in notes_store:
        raise HTTPException(status_code=404, detail="Note not found")
    else:
        update_note(uuid, note)
        return {"message": "Note updated successfully."}

@router.post("/{uuid}/")
def calculate_comprehension_score(uuid: int):
    note = get_note(uuid)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note.comprehension_score
