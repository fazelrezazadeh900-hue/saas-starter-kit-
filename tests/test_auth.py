"""
Basic smoke tests for the auth flow.
Run with: pytest
(Uses a throwaway SQLite DB so no external database is required.)
"""
import os

os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ["SECRET_KEY"] = "test-secret-key"

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_register_and_login():
    email = "test_user@example.com"
    password = "supersecret123"

    register_resp = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": password, "full_name": "Test User"},
    )
    assert register_resp.status_code == 201
    assert register_resp.json()["email"] == email

    login_resp = client.post(
        "/api/v1/auth/login",
        data={"username": email, "password": password},
    )
    assert login_resp.status_code == 200
    body = login_resp.json()
    assert "access_token" in body
    assert "refresh_token" in body


def test_login_wrong_password_fails():
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "nonexistent@example.com", "password": "wrong"},
    )
    assert response.status_code == 401
