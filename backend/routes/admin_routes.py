from flask import Blueprint, jsonify, request
from sqlalchemy import func

from blockchain.blockchain_instance import blockchain, get_blockchain_instance
from models.user_model import User
from utils.jwt_util import admin_required
from models.item_model import Item, Transfer
from database import db

admin_bp = Blueprint("admin_bp", __name__)

@admin_bp.route("/admin/users", methods=["GET"])
@admin_required
def list_all_users():
    users = User.query.all()
    result = []
    for user in users:
        result.append({
            "id": user.id,
            "username": user.username,
            "role": user.role
        })
    return jsonify(result), 200

@admin_bp.route("/admin/items", methods=["POST"])
@admin_required
def add_item_to_user():
    data = request.get_json()
    name = data.get("name")
    owner_id = data.get("owner_id")

    if not name or not owner_id:
        return jsonify({"error": "İsim ve owner_id gerekli"}), 400

    item = Item(name=name, owner_id=owner_id)
    db.session.add(item)
    db.session.commit()

    return jsonify({"message": f"Eşya '{name}' kullanıcıya eklendi.", "item_id": item.id}), 201


@admin_bp.route("/admin/transfers", methods=["GET"])
@admin_required
def list_all_transfers():
    transfers = Transfer.query.order_by(Transfer.timestamp.desc()).all()
    result = []
    for t in transfers:
        result.append({
            "id": t.id,
            "item_id": t.item_id,
            "from_user_id": t.from_user_id,
            "to_user_id": t.to_user_id,
            "timestamp": t.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        })
    return jsonify(result), 200

@admin_bp.route("/admin/users/<int:user_id>", methods=["DELETE"])
@admin_required
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Kullanıcı bulunamadı"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"Kullanıcı ID {user_id} başarıyla silindi."}), 200

@admin_bp.route("/admin/stats", methods=["GET"])
@admin_required
def get_admin_stats():
    total_users = db.session.query(func.count(User.id)).scalar()
    total_items = db.session.query(func.count(Item.id)).scalar()
    total_transfers = db.session.query(func.count(Transfer.id)).scalar()

    # En çok transfer yapan kullanıcıyı bul (from_user_id bazlı)
    top_sender_data = (
        db.session.query(User.username, func.count(Transfer.id).label("transfer_count"))
        .join(Transfer, Transfer.from_user_id == User.id)
        .group_by(User.id)
        .order_by(func.count(Transfer.id).desc())
        .first()
    )

    top_sender = top_sender_data.username if top_sender_data else None

    return jsonify({
        "total_users": total_users,
        "total_items": total_items,
        "total_transfers": total_transfers,
        "top_sender": top_sender
    }), 200

@admin_bp.route("/admin/items", methods=["GET"])
@admin_required  # varsa sadece admin için
def get_all_items():
    items = Item.query.all()
    return jsonify([
        {
            "id": item.id,
            "name": item.name,
            "owner_id": item.owner_id
        } for item in items
    ])

@admin_bp.route("/admin/transfers", methods=["GET"])
@admin_required
def get_all_transfers():
    from models.item_model import Transfer
    transfers = Transfer.query.all()
    return jsonify([
        {
            "id": t.id,
            "item_id": t.item_id,
            "from_user_id": t.from_user_id,
            "to_user_id": t.to_user_id,
            "timestamp": t.timestamp
        } for t in transfers
    ])

@admin_bp.route("/admin/validate-chain", methods=["GET"])
@admin_required
def validate_blockchain():
    blockchain = get_blockchain_instance()
    if not blockchain:
        return jsonify({"valid": False, "message": "Blockchain yüklenemedi!"}), 500

    is_valid, broken_index = blockchain.is_chain_valid()
    if is_valid:
        return jsonify({"valid": True, "message": "Zincir geçerli"}), 200
    else:
        return jsonify({
            "valid": False,
            "message": f"Zincir bozuk! Blok {broken_index} geçersiz."
        }), 200
