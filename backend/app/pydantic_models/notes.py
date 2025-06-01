# do something here bruh
from pydantic import BaseModel, Field
from typing import List, Union
from .question import Question
from .multiselect_question import MultiSelectQuestion

class Note(BaseModel):
    id: int
    title: str
    tags: List[str]
    cues: str
    notes: str
    summary: str
    source_material: List[str] = Field(alias="docs", serialization_alias="source_material")
    source_material_ids: List[int] = Field(default_factory=list,alias="source_material_ids", serialization_alias="source_material_ids") 
    questions: List[Question]
    comprehension_score: int = 0
