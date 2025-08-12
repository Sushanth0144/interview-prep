from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Topic, Question
from .. import db

admin_bp = Blueprint('admin', __name__)

def admin_required():
    identity = get_jwt_identity()
    if identity.get('role') != 'admin':
        return jsonify({'message': 'Admins only'}), 403

@admin_bp.route('/add-topic', methods=['POST'])
@jwt_required()
def add_topic():
    if admin_required(): return admin_required()
    data = request.get_json()
    topic = Topic(name=data['name'])
    db.session.add(topic)
    db.session.commit()
    return jsonify({'message': 'Topic added'}), 201

@admin_bp.route('/add-question', methods=['POST'])
@jwt_required()
def add_question():
    if admin_required(): return admin_required()
    data = request.get_json()
    topic = Topic.query.filter_by(name=data['topic']).first()
    if not topic:
        return jsonify({'message': 'Topic not found'}), 404
    question = Question(question_text=data['question'], topic=topic)
    db.session.add(question)
    db.session.commit()
    return jsonify({'message': 'Question added'}), 201
