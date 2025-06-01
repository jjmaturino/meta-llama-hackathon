# from openai import OpenAI
# import os
# from dotenv import load_dotenv

# load_dotenv()
# from app.pydantic_models.question import Question
# from app.pydantic_models.quiz import Quiz
# from app.pydantic_models.score import Score
# from typing import Literal
# from firecrawl_py import AsyncFirecrawlApp


# def create_questions(document: str, number_of_questions: int, question_type: Literal["short", "multiple"]) -> list[Question]:
#     client = OpenAI(
#     api_key=os.environ.get("LLAMA_API_KEY"), 
#     base_url="https://api.llama.com/compat/v1/"
# )
#     if question_type == "short":
#         # prompt here for generating x short answer questions
#         inference = client.beta.chat.completions.parse(
#     model="Cerebras-Llama-4-Maverick-17B-128E-Instruct",
#     messages=[
#         {"role": "system", "content": f"""You are a quiz creator. You will be given a document and you will need to create a quiz from it, wtith {number_of_questions} questions.
#          You must generate questions of type {question_type}.
#          eg: short: type: "short", question: "question", reference: (location in the document where the answer can be found),answer: "answer".
#          """},
#         {
#           "role": "user",
#           "content": f"Generate a quiz based on the following document.\n\n{document}"
#         },
#     ],
#             response_format=Quiz,
#         )

#         res = inference.choices[0].message.parsed.questions

#         return res
#     elif question_type == "multiple":
#         # prompt here for generating x multiple choice questions
#         inference = client.beta.chat.completions.parse(
#     model="Cerebras-Llama-4-Maverick-17B-128E-Instruct",
#     messages=[
#         {"role": "system", "content": f"""You are a quiz creator. You will be given a document and you will need to create a quiz from it, wtith {number_of_questions} questions.
#          You must generate questions of type {question_type}.
#          eg: multiple: type: "multiple", question: "question", reference: (location in the document where the answer can be found), options=[option1, option2, option3, option4], correct_answer: 0.
#           the correct answer is the index of the correct option in the options list."""},
#         {
#           "role": "user",
#           "content": f"Generate a quiz based on the following document.\n\n{document}"
#         },
#     ],
#             response_format=Quiz,
#         )

#         res = inference.choices[0].message.parsed.questions
#         return res


# def fact_judge(my_notes: str,sources_content: str) -> Score:
#     client = OpenAI(
#     api_key=os.environ.get("LLAMA_API_KEY"), 
#     base_url="https://api.llama.com/compat/v1/"
# )
#     completion = client.beta.chat.completions.parse(
#     model="Cerebras-Llama-4-Maverick-17B-128E-Instruct",
#     messages=[
#         {"role": "system", "content": """You judge the correctness of written notes based on source notes. 
#          Reminder that you only check correctness. Notes could be incomplete but don't worry about that.
#          You must give a score out of between 0 and 3 (0 being horrificly wrong, and 3 being correct) anywhere inbetween is a mix of correctness and incorrectness
#          written notes don't have to be 1-1 with the source notes, but be accurate with source notes"""},
#         {
#           "role": "user",
#           "content": f"generate a correctness score for the following written notes based on the source notes.\n\nSource notes: {sources_content}\n\nWritten notes: {my_notes}"
#         },
#     ],
#     response_format=Score,
# )
#     return completion.choices[0].message.parsed

# def completeness_judge(my_notes: str,sources_content: str) -> Score:
#     client = OpenAI(
#     api_key=os.environ.get("LLAMA_API_KEY"), 
#     base_url="https://api.llama.com/compat/v1/"
# )
#     completion = client.beta.chat.completions.parse(
#     model="Cerebras-Llama-4-Maverick-17B-128E-Instruct",
#     messages=[
#         {"role": "system", "content": """You judge the completeness of written notes based on source notes. 
#          Reminder that you only check completeness (if it covers the content of the source notes). Notes could be incorrect but don't worry about that.
#          You must give a score out of between 0 and 3 (0 being horrificly incomplete, and 3 being complete, anywhere inbetween is a mix of completeness and incompleteness)
#          Can be more lenient in terms of written notes don't have to be exactly the same as the source notes or have same depth/detail, just cover same content.
#          Be more punishing with missing content in terms of completeness. Lack of mention of important content is a big issue"""},
#         {
#           "role": "user",
#           "content": f"generate a completeness score for the following written notes based on the source notes.\n\nSource notes: {sources_content}\n\nWritten notes: {my_notes}"
#         },
#     ],
#     response_format=Score,
# )
#     return completion.choices[0].message.parsed


# def understanding_judge(my_notes: str,sources_content: str) -> Score:
#     client = OpenAI(
#     api_key=os.environ.get("LLAMA_API_KEY"), 
#     base_url="https://api.llama.com/compat/v1/"
# )
#     completion = client.beta.chat.completions.parse(
#     model="Cerebras-Llama-4-Maverick-17B-128E-Instruct",
#     messages=[
#         {"role": "system", "content": """You judge the understanding of written notes based on source notes. 
#          Reminder that you only check understanding. Rank understanding by how well concepts are explained
#          in their own words. Give a score out of between 0 and 3 (0 being horrificly wrong, and 3 being correct)
#          anywhere inbetween is a mix of understanding and misunderstanding.
#          An exact replication of the source notes is not the best understanding, but a good understanding is when the notes are
#          in their own words and the meaning is correct. Be more strict with note copying.""",
#         },
#         {
#           "role": "user",
#           "content": f"generate a understanding score for the following written notes based on the source notes.\n\nSource notes: {sources_content}\n\nWritten notes: {my_notes}"
#         },
#     ],
#     response_format=Score,
# )
#     return completion.choices[0].message.parsed


# def judge_all(my_notes: str,sources_content: str) -> Score:
#     fact_result = fact_judge(my_notes,sources_content)
#     completeness_result = completeness_judge(my_notes,sources_content)
#     understanding_result = understanding_judge(my_notes,sources_content)
#     total_score = (fact_result.score + completeness_result.score + understanding_result.score)
#     print(f"""Fact score: {fact_result.score}\n
# reasoning: {fact_result.reason}\n

# Completeness score: {completeness_result.score}\n
# reasoning: {completeness_result.reason}\n

# Understanding score: {understanding_result.score}\n
# reasoning: {understanding_result.reason}\n

# Total score: {total_score}""")
#     return total_score


# async def src_to_md(link: str) -> str:
#     app = AsyncFirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
#     response = await app.scrape_url(
#         url=link,		
#         formats= [ 'markdown' ],
#         only_main_content= True
#     )
#     return response.markdown
