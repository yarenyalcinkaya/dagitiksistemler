from flask import Blueprint, request, jsonify
from models.item_model import Item
from database import db
from utils.jwt_util import token_required

item_bp = Blueprint("item_bp", __name__)

@item_bp.route("/items", methods=["POST"])
def create_item():
    data = request.get_json()
    name = data.get("name")
    owner_id = data.get("owner_id")

    if not name or not owner_id:
        return jsonify({"error": "İsim ve owner_id zorunludur"}), 400

    new_item = Item(name=name, owner_id=owner_id)
    db.session.add(new_item)
    db.session.commit()

    return jsonify({"message": "Item başarıyla oluşturuldu", "item_id": new_item.id}), 201

@item_bp.route("/items", methods=["GET"])
@token_required  # isteğe bağlı: sadece giriş yapanlar görebilsin
def list_items(current_user_id):
    items = Item.query.filter_by(owner_id=current_user_id).all()
    result = []
    for item in items:
        result.append({
            "id": item.id,
            "name": item.name,
            "owner_id": item.owner_id
        })
    return jsonify(result), 200