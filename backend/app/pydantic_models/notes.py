# do something here bruh

from pydantic import BaseModel
from typing import List

class Note(BaseModel):
    title: str
    tags: List[str]
    metadata: List[str]
    questions: str
    notes: str
    summary: str
    docs: List[str]
