from flask import Blueprint, jsonify, request
from models.user_model import User
from utils.jwt_util import token_required  # token kontrolü için

user_bp = Blueprint("user_bp", __name__)

@user_bp.route('/users/by-username/<username>', methods=['GET'])
def get_user_by_username(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "Kullanıcı bulunamadı"}), 404
    return jsonify({"id": user.id, "username": user.username}), 200

@user_bp.route("/users", methods=["GET"])
@token_required
def list_users(current_user_id):
    users = User.query.filter(User.id != current_user_id).all()
    result = []
    for user in users:
        result.append({
            "id": user.id,
            "username": user.username
        })
    return jsonify(result), 200
