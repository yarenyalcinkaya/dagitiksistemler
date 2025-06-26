# routes/transfer.py
from flask import Blueprint, request, jsonify
from models.item_model import Item, Transfer
from models.user_model import User
from database import db
from blockchain.blockchain_instance import blockchain
from blockchain.blockchain_instance import get_blockchain_instance
from utils.jwt_util import token_required

print("Transfer dosyası çalıştı!")
transfer_bp = Blueprint('transfer_bp', __name__)
@transfer_bp.route('/transfer', methods=['POST'])
@token_required
def transfer_item(current_user_id):  # JWT'den gelen user_id
    data = request.get_json()
    item_id = data.get('item_id')
    to_user_id = data.get('to_user_id')

    item = Item.query.get(item_id)
    if not item or item.owner_id != current_user_id:
        return jsonify({"error": "Bu öğe bu kullanıcıya ait değil"}), 400

    blockchain = get_blockchain_instance()
    if not blockchain:
        return jsonify({"error": "Blockchain henüz yüklenmedi"}), 500

    item.owner_id = to_user_id
    new_transfer = Transfer(
        item_id=item_id,
        from_user_id=current_user_id,
        to_user_id=to_user_id
    )
    db.session.add(new_transfer)
    blockchain.add_transfer_block(item_id, current_user_id, to_user_id)
    db.session.commit()

    return jsonify({"message": "Transfer başarılı"}), 200

@transfer_bp.route('/transfers', methods=['GET'])
def list_transfers():
    transfers = Transfer.query.all()
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

@transfer_bp.route('/transfers/mine', methods=['GET'])
@token_required
def list_my_transfers(current_user_id):
    transfers = Transfer.query.filter(
        (Transfer.from_user_id == current_user_id) | (Transfer.to_user_id == current_user_id)
    ).all()

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
