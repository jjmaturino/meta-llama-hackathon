from pydantic import BaseModel
from typing import List

class Question(BaseModel):
    question: str
    answer: str
    #tags: List[str] = [] 