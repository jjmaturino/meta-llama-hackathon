from pydantic import BaseModel
from typing import List, Literal

class MultiSelectQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: Literal[0, 1, 2, 3]  # index of the correct answer, must be 0, 1, 2, or 3
    #tags: List[str] = [] 