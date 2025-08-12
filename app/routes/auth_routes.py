# app/routes/auth_routes.py
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity
)
from ..models import User
from .. import db

auth_bp = Blueprint('auth', __name__)

def validate_body(*fields):
    data = request.get_json() or {}
    missing = [f for f in fields if not data.get(f)]
    if missing:
        return None, jsonify({"message": f"Missing field(s): {', '.join(missing)}"}), 400
    return data, None, None

@auth_bp.route('/register', methods=['POST'])
def register():
    data, err_resp, code = validate_body('username', 'password')
    if err_resp:
        return err_resp, code

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists'}), 400

    user = User(
        username=data['username'],
        password=generate_password_hash(data['password']),
        role=data.get('role', 'user')
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data, err_resp, code = validate_body('username', 'password')
    if err_resp:
        return err_resp, code

    user = User.query.filter_by(username=data['username']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401

    identity = {"username": user.username, "role": user.role}
    access_token = create_access_token(identity=identity)
    refresh_token = create_refresh_token(identity=identity)

    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'role': user.role,
        'username': user.username
    }), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    identity = get_jwt_identity()  # the dict you stored (username, role)
    new_access_token = create_access_token(identity=identity)
    return jsonify(access_token=new_access_token), 200

# Optional – handy for the frontend to re-check role/username
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    return jsonify(get_jwt_identity()), 200
