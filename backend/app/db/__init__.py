from typing import Dict

from app.pydantic_models.notes import Note
from app.pydantic_models.question import Question
from app.pydantic_models.quiz import Quiz

notes_db: Dict[int, Note] = {}
questions_db: Dict[int, Question] = {}
quizzes_db: Dict[int, Quiz] = {}
next_note_id: int = 2
next_question_id: int = 1
next_quiz_id: int = 1

# In-memory "databases"
notes_db[0] = Note(
    id=0,
    title="Notes on Transformers",
    tags=["AI", "ML"],
    cues="- **Transformers**\n- proposed in the paper [Attention is All You Need](https://arxiv.org/abs/1706.03762).",
    notes="- Can be used in a myriad of different applications...",
    summary="A Transformer is a type of Machine Learning Model Architecture...",
    docs=[
        "https://jalammar.github.io/illustrated-transformer/",
        "https://arxiv.org/abs/1607.06450",
        "https://arxiv.org/abs/1706.03762"
    ],
    questions=[]
)
notes_db[1] = Note(
    id=1,
    title="Notes on Neural Networks",
    tags=["AI", "Neural Networks"],
    cues="- **Neural Networks**\n- Inspired by the human brain.",
    notes="- Used for pattern recognition, classification, and regression tasks...",
    summary="A Neural Network is a computational model inspired by the human brain...",
    docs=[
        "https://en.wikipedia.org/wiki/Artificial_neural_network",
        "https://www.deeplearningbook.org/"
    ],
    questions=[]
)

