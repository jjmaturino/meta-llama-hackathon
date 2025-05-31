from fastapi import FastAPI
from app.router.instance import api_router

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World"}

def get_application() -> FastAPI:
    application = FastAPI(
        title="llamas go yeerrrrr", openapi_url=f"/v1/openapi.json"
    )

    application.include_router(
        api_router, prefix='/v1'
    )  # uses api router that is imported above






app = get_application()  # fastapi processes
