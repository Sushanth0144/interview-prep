from werkzeug.security import generate_password_hash
from app.models import db, User, Topic


def auth_headers(client, username, password, role="admin"):
    # build the user
    with client.application.app_context():
        u = User(username=username, password=generate_password_hash(password), role=role)
        db.session.add(u)
        db.session.commit()
    # login
    resp = client.post("/api/login", json={"username": username, "password": password})
    token = resp.get_json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_create_topic_as_admin(client):
    headers = auth_headers(client, "admin", "admin123", role="admin")
    resp = client.post("/api/topics", json={"name": "TestTopic"}, headers=headers)
    assert resp.status_code == 201

def test_create_topic_as_user_forbidden(client):
    headers = auth_headers(client, "user", "user123", role="user")
    resp = client.post("/api/topics", json={"name": "TestTopic"}, headers=headers)
    assert resp.status_code == 403
