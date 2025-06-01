from fastapi import APIRouter, HTTPException
from typing import List
import os
from app.pydantic_models.notes import Note
from app.pydantic_models.question import Question
from pydantic import BaseModel

from app.db.notes import get_all_notes, get_note, create_note
from app.db.id_generators import generate_note_id

from app.utils import fact_judge, completeness_judge, understanding_judge, judge_all, src_to_md

import requests

import asyncio
from firecrawl import AsyncFirecrawlApp
from app.pydantic_models.source_mat import SourceMaterial
from app.db.source_mat import create_source_material
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
async def create_note_handler(request: CreateNoteRequest):
    source_material_ids = []
    for doc in request.docs:
        response_md = await src_to_md(doc)
        src_mat = SourceMaterial(
            id=0,
            content=response_md
        )
        new_src_mat = create_source_material(src_mat)
        source_material_ids.append(new_src_mat.id)
    note = Note(
        id=generate_note_id(),
        title=request.title,
        tags=request.tags,
        cues=request.cues,
        notes=request.notes,
        summary=request.summary,
        docs=request.docs,
        questions=request.questions,
        source_material_ids=source_material_ids,
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
async def calculate_comprehension_score(uuid: int):
    note = get_note(uuid)

    content = []


    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note.comprehension_score
