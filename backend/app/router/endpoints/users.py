from fastapi import APIRouter

users = APIRouter()

# Hardcoded user info
db_users = {
    "alice": {"name": "Alice", "email": "alice@example.com"},
    "bob": {"name": "Bob", "email": "bob@example.com"},
}

@users.get("/")
def get_user(username: str):
    return db_users.get(username, {"error": "User not found"})
