# do something here bruh
from pydantic import BaseModel
from typing import List

class Note(BaseModel):
    title: str
    tags: List[str]
    cues: str
    notes: str
    summary: str
    docs: List[str]
