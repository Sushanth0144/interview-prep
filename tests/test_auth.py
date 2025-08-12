def test_register_and_login(client):
    # register
    resp = client.post("/api/register", json={"username": "john", "password": "doe"})
    assert resp.status_code == 201

    # login
    resp = client.post("/api/login", json={"username": "john", "password": "doe"})
    assert resp.status_code == 200
    data = resp.get_json()
    assert "access_token" in data
    assert "refresh_token" in data
