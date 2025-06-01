from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
from app.pydantic_models.question import Question
from app.pydantic_models.quiz import Quiz
from pydantic import BaseModel, Field, model_validator, ValidationError
from typing import List, Optional, Literal





def create_questions(document: str, number_of_questions: int, question_type: Literal["short", "multiple"]) -> list[Question]:
    client = OpenAI(
    api_key=os.environ.get("LLAMA_API_KEY"), 
    base_url="https://api.llama.com/compat/v1/"
)
    print(document)
    if question_type == "short":
        # prompt here for generating x short answer questions
        inference = client.beta.chat.completions.parse(
    model="Cerebras-Llama-4-Maverick-17B-128E-Instruct",
    messages=[
        {"role": "system", "content": f"""You are a quiz creator. You will be given a document and you will need to create a quiz from it, wtith {number_of_questions} questions.
         You must generate questions of type {question_type}.
         eg: short: type: "short", question: "question", reference: (location in the document where the answer can be found),answer: "answer".
         """},
        {
          "role": "user",
          "content": f"Generate a quiz based on the following document.\n\n{document}"
        },
    ],
            response_format=Quiz,
        )

        res = inference.choices[0].message.parsed.questions

        return res
    elif question_type == "multiple":
        # prompt here for generating x multiple choice questions
        inference = client.beta.chat.completions.parse(
    model="Cerebras-Llama-4-Maverick-17B-128E-Instruct",
    messages=[
        {"role": "system", "content": f"""You are a quiz creator. You will be given a document and you will need to create a quiz from it, wtith {number_of_questions} questions.
         You must generate questions of type {question_type}.
         eg: multiple: type: "multiple", question: "question", reference: (location in the document where the answer can be found), options=[option1, option2, option3, option4], correct_answer: 0.
          the correct answer is the index of the correct option in the options list."""},
        {
          "role": "user",
          "content": f"Generate a quiz based on the following document.\n\n{document}"
        },
    ],
            response_format=Quiz,
        )

        res = inference.choices[0].message.parsed.questions
        return res
