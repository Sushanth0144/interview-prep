from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash

from config import Config
from app.models import db, User, Topic, Question


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Init
    db.init_app(app)
    jwt = JWTManager(app)

    CORS(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=True
    )

    # ---------------- Helpers ----------------
    def admin_required(fn):
        from functools import wraps
        @wraps(fn)
        def wrapper(*args, **kwargs):
            current_user = get_jwt_identity()
            user = User.query.filter_by(username=current_user).first()
            if not user or not user.is_admin():
                return jsonify({"message": "Admin only"}), 403
            return fn(*args, **kwargs)
        return wrapper

    # ---------------- Auth ----------------
    @app.post("/api/register")
    def register():
        data = request.get_json() or {}
        username = data.get("username")
        password = data.get("password")
        role = data.get("role", "user")

        if not username or not password:
            return jsonify({"message": "Username and password are required"}), 400

        if User.query.filter_by(username=username).first():
            return jsonify({"message": "Username already exists"}), 400

        hashed = generate_password_hash(password)
        user = User(username=username, password=hashed, role=role)
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201

    @app.post("/api/login")
    def login():
        data = request.get_json() or {}
        username = data.get("username")
        password = data.get("password")

        user = User.query.filter_by(username=username).first()
        if not user or not check_password_hash(user.password, password):
            return jsonify({"message": "Invalid credentials"}), 401

        access = create_access_token(identity=user.username)
        refresh = create_refresh_token(identity=user.username)
        return jsonify({
            "message": "Login successful",
            "access_token": access,
            "refresh_token": refresh,
            "role": user.role
        }), 200

    @app.post("/api/token/refresh")
    @jwt_required(refresh=True)
    def refresh_token():
        current_user = get_jwt_identity()
        new_token = create_access_token(identity=current_user)
        return jsonify({"access_token": new_token}), 200

    # ---------------- Public Data ----------------
    @app.get("/api/topics")
    def list_topics():
        topics = Topic.query.all()
        return jsonify([
            {
                "id": t.id,
                "name": t.name,
                "description": t.description,
                "link": t.link,
                "questionsCount": len(t.questions)
            } for t in topics
        ])

    @app.get("/api/topics/<int:topic_id>/questions")
    def get_questions(topic_id):
        topic = Topic.query.get_or_404(topic_id)
        return jsonify({
            "topic": {
                "id": topic.id,
                "name": topic.name,
                "description": topic.description,
                "link": topic.link
            },
            "questions": [
                {"id": q.id, "text": q.text} for q in topic.questions
            ]
        })

    # ---------------- Admin CRUD ----------------
    @app.post("/api/topics")
    @jwt_required()
    @admin_required
    def create_topic():
        data = request.get_json() or {}
        name = data.get("name")
        if not name:
            return jsonify({"message": "Name is required"}), 400
        topic = Topic(
            name=name,
            description=data.get("description"),
            link=data.get("link")
        )
        db.session.add(topic)
        db.session.commit()
        return jsonify({"message": "Topic created", "id": topic.id}), 201

    @app.put("/api/topics/<int:topic_id>")
    @jwt_required()
    @admin_required
    def update_topic(topic_id):
        topic = Topic.query.get_or_404(topic_id)
        data = request.get_json() or {}
        topic.name = data.get("name", topic.name)
        topic.description = data.get("description", topic.description)
        topic.link = data.get("link", topic.link)
        db.session.commit()
        return jsonify({"message": "Topic updated"})

    @app.delete("/api/topics/<int:topic_id>")
    @jwt_required()
    @admin_required
    def delete_topic(topic_id):
        topic = Topic.query.get_or_404(topic_id)
        db.session.delete(topic)
        db.session.commit()
        return jsonify({"message": "Topic deleted"})

    @app.post("/api/topics/<int:topic_id>/questions")
    @jwt_required()
    @admin_required
    def add_question(topic_id):
        topic = Topic.query.get_or_404(topic_id)
        data = request.get_json() or {}
        text = data.get("text")
        if not text:
            return jsonify({"message": "Question text required"}), 400
        q = Question(text=text, topic=topic)
        db.session.add(q)
        db.session.commit()
        return jsonify({"message": "Question added", "id": q.id}), 201

    @app.put("/api/questions/<int:question_id>")
    @jwt_required()
    @admin_required
    def update_question(question_id):
        q = Question.query.get_or_404(question_id)
        data = request.get_json() or {}
        q.text = data.get("text", q.text)
        db.session.commit()
        return jsonify({"message": "Question updated"})

    @app.delete("/api/questions/<int:question_id>")
    @jwt_required()
    @admin_required
    def delete_question(question_id):
        q = Question.query.get_or_404(question_id)
        db.session.delete(q)
        db.session.commit()
        return jsonify({"message": "Question deleted"})

    # -------------- bootstrap --------------
    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
