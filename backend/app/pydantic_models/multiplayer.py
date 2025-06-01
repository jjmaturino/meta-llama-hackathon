# app/pydantic_models/socketio_events.py
from pydantic import BaseModel
from typing import Optional, Union
from app.pydantic_models.question import Question

class PlayerJoinedRequest(BaseModel):
    player_name: str
    game_id: Optional[int] = None

class PlayerJoinedResponse(BaseModel):
    game_id: int
    joined_by: str

class QuestionAskedRequest(BaseModel):
    question_id: Optional[int] = None
    quiz_id: Optional[int] = None
    user_id: Optional[str] = None

class QuestionAskedResponse(BaseModel):
    question: Question
    asked_by: str

class QuestionAnsweredRequest(BaseModel):
    user_id: Optional[str] = None
    question_id: Optional[str] = None  # if you want to track specific questions
    answer: int # just multiple choice

class QuestionAnsweredResponse(BaseModel):
    question_id: Optional[str] = None
    answer: Union[str, int]
    answered_by: str
    is_correct: Optional[bool] = None  # you can add validation logic

class GameEndedRequest(BaseModel):
    reason: Optional[str] = None  # "completed", "player_quit", etc.
    game_id: Optional[int] = None
    user_id: Optional[str] = None

class GameEndedResponse(BaseModel):
    reason: Optional[str] = None
    ended_by: str
    final_scores: Optional[dict] = None
    you_won: Optional[bool] = None