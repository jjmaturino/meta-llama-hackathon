# do something here bruh
from pydantic import BaseModel
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
    docs: List[str]
    questions: List[Union[Question, MultiSelectQuestion]]
