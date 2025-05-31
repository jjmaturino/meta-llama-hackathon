from fastapi import APIRouter, HTTPException
from typing import List
import os

router = APIRouter()

NOTES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'notes')

@router.get("/notes", response_model=List[str])
def get_all_notes():
    # List all .md files in the notes directory, return their uuids (filenames without .md)
    try:
        files = [f for f in os.listdir(NOTES_DIR) if f.endswith('.md')]
        uuids = [os.path.splitext(f)[0] for f in files]
        return uuids
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/notes/{uuid}")
def get_note_by_uuid(uuid: str):
    # Retrieve the content of a note by uuid
    note_path = os.path.join(NOTES_DIR, f"{uuid}.md")
    if not os.path.isfile(note_path):
        raise HTTPException(status_code=404, detail="Note not found")
    with open(note_path, 'r', encoding='utf-8') as f:
        content = f.read()
    return {"uuid": uuid, "content": content}
