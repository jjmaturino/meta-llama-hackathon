from fastapi import APIRouter, HTTPException
from typing import List
import os
from app.pydantic_models.notes import Note
from app.pydantic_models.question import Question
from app.pydantic_models.multiselect_question import MultiSelectQuestion

router = APIRouter()

# In-memory dictionary of note IDs to Note objects
notes_store = {}

# Sample Note for demonstration
sample_note = Note(
    id=1,
    title="Notes on Transformers",
    tags=["AI", "ML"],
    cues="- **Transformers**\n- proposed in the paper [Attention is All You Need](https://arxiv.org/abs/1706.03762).",
    notes="- Can be used in a myriad of different applications...",
    summary="A Transformer is a type of Machine Learning Model Architecture...",
    docs=[
        "https://jalammar.github.io/illustrated-transformer/",
        "https://arxiv.org/abs/1607.06450",
        "https://arxiv.org/abs/1706.03762"
    ],
    questions=[]
)
notes_store[sample_note.id] = sample_note

# Add a second sample note
sample_note2 = Note(
    id=2,
    title="Notes on Neural Networks",
    tags=["AI", "Neural Networks"],
    cues="- **Neural Networks**\n- Inspired by the human brain.",
    notes="- Used for pattern recognition, classification, and regression tasks...",
    summary="A Neural Network is a computational model inspired by the human brain...",
    docs=[
        "https://en.wikipedia.org/wiki/Artificial_neural_network",
        "https://www.deeplearningbook.org/"
    ],
    questions=[]
)
notes_store[sample_note2.id] = sample_note2

NOTES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'notes')

@router.get("/", response_model=List[Note])
def get_all_notes():
    # List all .md files in the notes directory, return their uuids (filenames without .md)
    return list(notes_store.values())

@router.get("/{uuid}", response_model=Note)
def get_note_by_uuid(uuid: int):
    note = notes_store.get(uuid)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note
