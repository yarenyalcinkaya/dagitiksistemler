import jwt, os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify
import jwt
import os

print("JWT modülü:", jwt.__file__)  # geçici debug satırı


def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=1)
    }
    return jwt.encode(payload, os.getenv("SECRET_KEY"), algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            bearer = request.headers['Authorization']
            token = bearer.replace("Bearer ", "")

        if not token:
            return jsonify({'error': 'Token gerekli!'}), 401

        try:
            data = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
            current_user_id = data['user_id']
        except:
            return jsonify({'error': 'Geçersiz veya süresi dolmuş token'}), 401

        return f(current_user_id, *args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].replace("Bearer ", "")
        if not token:
            return jsonify({"error": "Token gerekli!"}), 401
        try:
            data = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
            user_id = data['user_id']
            from models.user_model import User
            user = User.query.get(user_id)
            if user.role != "ADMIN":
                return jsonify({"error": "Yetkisiz erişim"}), 403
        except:
            return jsonify({"error": "Geçersiz token"}), 401
        return f(*args, **kwargs)
    return wrapper
