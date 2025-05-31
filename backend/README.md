# This files describes how to get backend up and running for local development

1. Set up **Poetry**
2. Activate **Poetry's** Virtual Env
3. Run ***poetry install***
4. Run ***uvicorn app.main:app --reload --env-file ./.env***
   1. This allows for hot reloads during development
5. Head to ***localhost:8000/docs*** to view auto-generated api docs