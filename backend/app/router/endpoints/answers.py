from fastapi import APIRouter
from pydantic import BaseModel
from app.pydantic_models.question import Question
from openai import OpenAI
import os
from dotenv import load_dotenv

router = APIRouter()

class Reply(BaseModel):
    reply: str
    correct: bool

@router.post("/answers", response_model=Reply)
def check_answer(answer: str, question: Question, source_material: str):
    # Load environment variables
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), '.env'))

    client = OpenAI(
        api_key=os.environ.get("LLAMA_API_KEY"),
        base_url="https://api.llama.com/compat/v1/"
    )

    # Compose the prompt for the Llama API
    system_prompt = (
        "You are an expert answer checker. You will be given a question, a user's answer, and the source material. "
        "Determine if the answer is correct based on the question and the source material. "
        "Return your reply as a JSON object with two fields: 'reply' (a string explanation) and 'correct' (a boolean)."
    )
    user_prompt = (
        f"Question: {question.question}\n"
        f"User's Answer: {answer}\n"
        f"Source Material: {source_material}\n"
        "\nRespond in the following JSON format: {\"reply\": string, \"correct\": boolean}"
    )

    completion = client.beta.chat.completions.parse(
        model="Cerebras-Llama-4-Maverick-17B-128E-Instruct",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        response_format=Reply,
    )
    reply = completion.choices[0].message.parsed
    return reply 