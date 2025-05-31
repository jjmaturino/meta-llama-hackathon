from pydantic import BaseModel
from typing import List, Union
from .question import Question
from .multiselect_question import MultiSelectQuestion

class Quiz(BaseModel):
    questions: List[Union[Question, MultiSelectQuestion]]
