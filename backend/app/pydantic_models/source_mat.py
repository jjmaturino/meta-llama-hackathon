from pydantic import BaseModel, Field
from typing import List, Union
from .question import Question
from .multiselect_question import MultiSelectQuestion

class SourceMaterial(BaseModel):
    id: int
    content: str
