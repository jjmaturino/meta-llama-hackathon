from pydantic import BaseModel
from typing import List

class MultiSelectQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answers: List[str]
    #tags: List[str] = [] 