from flask_jwt_extended import get_jwt_identity
from flask import request

def get_current_user_identity():
    return get_jwt_identity()
