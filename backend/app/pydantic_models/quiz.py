from pydantic import BaseModel
from typing import List, Tuple, Union
from .question import Question
from .multiselect_question import MultiSelectQuestion

class Quiz(BaseModel):
    ID: str
    questions: List[Tuple[bool, Union[Question, MultiSelectQuestion]]]
    score: int
    notes: List[str]
    type: str
    playermode: str

