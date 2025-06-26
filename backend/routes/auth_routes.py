from flask import Blueprint, request, jsonify
from models.user_model import User
from database import db
from utils.jwt_util import generate_token

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Kullanıcı adı zaten mevcut"}), 400

    user = User(username=username)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Kayıt başarılı"})

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    expected_role = data.get("expected_role")  # 👈 gelen rol kontrolü

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Geçersiz kullanıcı adı ya da şifre"}), 401

    if expected_role and user.role != expected_role:
        return jsonify({"error": f"{expected_role} girişi yapamazsınız."}), 403

    token = generate_token(user.id)
    return jsonify({
        "token": token,
        "role": user.role,
        "userId": user.id
    })

    return jsonify({"error": "Geçersiz kullanıcı adı ya da şifre"}), 401



