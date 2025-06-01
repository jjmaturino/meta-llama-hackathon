from pydantic import BaseModel
from typing import List, Tuple, Union
from .question import Question
from .multiselect_question import MultiSelectQuestion

class Quiz(BaseModel):
    ID: int
    questions: List[Question]
    are_q_answered: List[bool]
    score: int
    notes: List[int]
    type: str
    playermode: str

class QuizResponse(BaseModel):
    questions: List[Tuple[bool, Question]]
    score: int
    notes: List[int]
    type: str
    playermode: str
