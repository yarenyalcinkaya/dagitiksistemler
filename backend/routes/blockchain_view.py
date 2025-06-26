from flask import Blueprint, jsonify
from blockchain.blockchain_instance import blockchain  # ✅ Global instance buradan çekiliyor
from utils.jwt_util import admin_required
from models.block_model import BlockModel
from database import db

blockchain_bp = Blueprint("blockchain_bp", __name__)

@blockchain_bp.route("/blockchain", methods=["GET"])
def get_blockchain():
    if blockchain is None:
        return jsonify({"error": "Blockchain başlatılamadı."}), 500

    chain_data = []
    for block in blockchain.chain:
        chain_data.append({
            "index": block.index,
            "data": block.data,
            "timestamp": block.timestamp,
            "hash": block.hash,
            "previous_hash": block.previous_hash
        })
    return jsonify(chain_data), 200


@blockchain_bp.route("/admin/blockchain/validate", methods=["GET"])
@admin_required
def validate_blockchain():
    if blockchain is None:
        return jsonify({"valid": False, "message": "Blockchain yüklenemedi."}), 500

    is_valid, error_index = blockchain.is_chain_valid()
    if is_valid:
        return jsonify({"valid": True, "message": "✅ Blockchain geçerli."}), 200
    else:
        return jsonify({
            "valid": False,
            "error_index": error_index,
            "message": f"❌ Zincir bozuk! Hata {error_index}. blokta."
        }), 200

@blockchain_bp.route('/blockchain/blocks', methods=['GET'])
def get_all_blocks():
    blocks = BlockModel.query.order_by(BlockModel.index).all()
    return jsonify([
        {
            "index": b.index,
            "data": b.data,
            "timestamp": b.timestamp,
            "previous_hash": b.previous_hash,
            "hash": b.hash,
            "nonce": getattr(b, 'nonce', None)  # nonce varsa göster
        } for b in blocks
    ]), 200
