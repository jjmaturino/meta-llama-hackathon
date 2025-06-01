from pydantic import BaseModel

class Score(BaseModel):
    reason: str #reason for the score
    score: int #score for the answer