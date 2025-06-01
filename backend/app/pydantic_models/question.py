from pydantic import BaseModel
from pydantic import BaseModel, Field, model_validator, ValidationError
from typing import List, Optional, Literal

class Question(BaseModel):
    type: Literal["short", "multi"]
    question: str

    refrernce: str

    # short-answer fields
    answer: Optional[str] = None

    # multiple-choice fields
    options: Optional[List[str]] = None
    correct_answer: Optional[int] = Field(default=None)

    @model_validator(mode="after")
    def _check_by_type(self):
        if self.type == "short":
            if self.answer is None:
                raise ValueError("`answer` is required for short-answer questions")
            if self.options or self.correct_answer is not None:
                raise ValueError("`options`/`correct_answer` forbidden for short-answer")
        else:  # type == "multi"
            if self.options is None or self.correct_answer is None:
                raise ValueError("`options` and `correct_answer` required for multiple-choice")
            if self.answer is not None:
                raise ValueError("`answer` forbidden for multiple-choice")
            if not (0 <= self.correct_answer < len(self.options)):
                raise ValueError("`correct_answer` out of range")
        return self
