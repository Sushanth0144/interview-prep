from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from ..models import Topic
from .. import db

quiz_bp = Blueprint('quiz', __name__)

@quiz_bp.route('/topics', methods=['GET'])
@jwt_required()
def get_topics():
    topics = Topic.query.all()
    return jsonify([
        {
            "name": t.name,
            "questions": len(t.questions)
        } for t in topics
    ])

@quiz_bp.route('/questions/<string:topic_name>', methods=['GET'])
@jwt_required()
def get_questions(topic_name):
    topic = Topic.query.filter_by(name=topic_name).first()
    if not topic:
        return jsonify({'message': 'Topic not found'}), 404
    return jsonify([
        q.question_text for q in topic.questions
    ])
