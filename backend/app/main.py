from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.router.instance import api_router


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



app = get_application()  # fastapi processes

@app.get("/")
def read_root():
    return {"message": "Hello World"}

