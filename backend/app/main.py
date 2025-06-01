import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import notes_db, guest_quizzes_db, quizzes_db
from app.db.quizzes import get_quiz, update_quiz
from app.pydantic_models.multiplayer import PlayerJoinedRequest, PlayerJoinedResponse, QuestionAskedRequest, \
    QuestionAskedResponse, QuestionAnsweredRequest, QuestionAnsweredResponse, GameEndedResponse, GameEndedRequest
from app.pydantic_models.question import Question
from app.pydantic_models.quiz import Quiz
from app.router.instance import api_router
from app.pydantic_models.notes import Note


# Simple ID counters for each type


def get_application() -> FastAPI:
    application = FastAPI(
        title="llamas go yeerrrrr", openapi_url=f"/v1/openapi.json"
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    note_ds = []

    application.include_router(
        api_router, prefix='/v1'
    )  # uses api router that is imported above

    return application

# Create Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins="*"
)

app = get_application()  # fastapi processes

# Wrap FastAPI app with Socket.IO
socket_app = socketio.ASGIApp(sio, app)


# Socket.IO event handlers with Pydantic validation
@sio.event
async def connect(sid, environ):
    print(f"Client {sid} connected")

@sio.event
async def disconnect(sid):
    print(f"Client {sid} disconnected")


@sio.event
async def player_joined(sid, data):
    try:
        request = PlayerJoinedRequest(**data)

        quiz = get_quiz(request.game_id)
        quiz.number_of_players += 1

        if request.player_name == "Guest":
            guest_quizzes_db[0] = quiz
        else:
            updated_quiz = update_quiz(request.game_id, quiz)

        response = PlayerJoinedResponse(
            game_id=request.game_id or "default_game",
            joined_by=sid,
        )

        if quiz.number_of_players == 2:
            await sio.emit('ask_question', response.model_dump())
        else:
            await sio.emit('player_joined', response.model_dump())


    except Exception as e:
        await sio.emit('error', {'message': str(e)}, room=sid)

def previous_question_asked(userQuiz: Quiz, guestQuiz: Quiz, question_idx: int ) -> bool:
    if question_idx == 0 or (userQuiz.are_q_answered[question_idx] == False and guestQuiz.are_q_answered[question_idx] == False):
        return True
    else:
        return False

@sio.event
async def ask_question(sid, data):
    try:
        request = QuestionAskedRequest(**data)

        quiz = get_quiz(request.quiz_id)


        if previous_question_asked(quiz, guest_quizzes_db, question_id=request.question_id):
            quizzes_db[request.quiz_id].questions_answered[request.question_id] = True
            guest_quizzes_db[0].questions_answered[request.question_id] = True

            response = QuestionAskedResponse(
                question=guest_quizzes_db[0].questions[0],
                question_id=guest_quizzes_db[0].questions[0].ID,
                asked_by=sid,
            )

            await sio.emit('question_asked', response.model_dump())
            return
        else:
            response = QuestionAskedResponse(
                question=quiz.questions[0],
                question_id=quiz.questions[0].ID,
                asked_by=sid,
            )
            await sio.emit('waiting_for_user_to_answer_previous_question', response.model_dump())

        await sio.emit('question_asked', response.model_dump())
    except Exception as e:
        await sio.emit('error', {'message': str(e)}, room=sid)


def is_correct(question: Question, answer: int) -> bool:
        return answer == question.correct_answer

@sio.event
async def answer_question(sid, data):
    try:

        request = QuestionAnsweredRequest(**data)
        if request.user_id == "Guest":
            question = guest_quizzes_db[0].questions[request.question_id]

            if is_correct(question, request.answer):
                guest_quizzes_db[0].score += 1
                guest_quizzes_db[0].notes.append(request.answer)
                response = QuestionAnsweredResponse(
                    question_id=request.question_id,
                    answer=request.answer,
                    answered_by=sid,
                    is_correct=True,
                )
                await sio.emit('question_answered', response.model_dump())
                return
            else:
                response = QuestionAnsweredResponse(
                    question_id=request.question_id,
                    answer=request.answer,
                    answered_by=sid,
                    is_correct=False,
                )
                await sio.emit('question_answered', response.model_dump())
                return
        else:
            if is_correct(quizzes_db[request.quiz_id].questions[request.question_id], request.answer):
                quizzes_db[request.quiz_id].score += 1
                quizzes_db[request.quiz_id].questions_answered[request.question_id] = True

                response = QuestionAnsweredResponse(
                    question_id=request.question_id,
                    answer=request.answer,
                    answered_by=sid,
                    is_correct=True,
                )
                await sio.emit('question_answered', response.model_dump())
                return
            else:
                response = QuestionAnsweredResponse(
                    question_id=request.question_id,
                    answer=request.answer,
                    answered_by=sid,
                    is_correct=False,
                )
                await sio.emit('question_answered', response.model_dump())
                return


    except Exception as e:
        await sio.emit('error', {'message': str(e)}, room=sid)


@sio.event
async def quiz_ended(sid, data):
    try:
        request = GameEndedRequest(**data)
        homeuser_quiz = get_quiz(request.game_id)
        guestuser_quiz = guest_quizzes_db[0]

        response = GameEndedResponse(
            reason=request.reason,
            ended_by=sid,
            final_scores={
                "homeuser": homeuser_quiz.score,
                "guestuser": guestuser_quiz.score
            }
        )

        winner = 0 if homeuser_quiz.score > guestuser_quiz.score else 1

        if winner == 1 and request.user_id == "Guest":
            response.you_won = True
        elif winner == 0 and request.user_id == "Home":
            response.you_won = True
        else:
            response.you_won = False

        await sio.emit('game_ended', response.model_dump())

    except Exception as e:
        await sio.emit('error', {'message': str(e)}, room=sid)