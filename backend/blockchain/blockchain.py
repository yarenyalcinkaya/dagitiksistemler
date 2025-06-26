# blockchain.py
import hashlib
import datetime

from database import db
from models.block_model import BlockModel

class Blockchain:
    def __init__(self):
        self.load_chain_from_db()


    def load_chain_from_db(self):
        self.chain = BlockModel.query.order_by(BlockModel.index).all()
        if not self.chain:
            genesis = self.create_genesis_block()
            db.session.add(genesis)
            db.session.commit()
            self.chain = [genesis]

    def create_genesis_block(self):
        timestamp = str(datetime.datetime.now())
        data = "Genesis Block"
        nonce = 0  # Genesis bloğu için nonce sabit olabilir
        hash_value = hashlib.sha256(f"0{data}{timestamp}0{nonce}".encode()).hexdigest()

        genesis = BlockModel(
            index=0,
            data=data,
            timestamp=timestamp,
            previous_hash="0",
            hash=hash_value,
            nonce=nonce
        )
        return genesis

    def get_last_block(self):
        return BlockModel.query.order_by(BlockModel.index.desc()).first()

    def add_transfer_block(self, item_id, from_user, to_user):
        last_block = self.get_last_block()
        index = last_block.index + 1
        timestamp = str(datetime.datetime.now())
        data = str({
            'type': 'transfer',
            'item_id': item_id,
            'from': from_user,
            'to': to_user
        })
        previous_hash = last_block.hash

        # Yeni hash ve nonce hesaplama
        hash_value, nonce = self.calculate_valid_hash(index, data, timestamp, previous_hash)

        new_block = BlockModel(
            index=index,
            data=data,
            timestamp=timestamp,
            previous_hash=previous_hash,
            hash=hash_value,
            nonce=nonce
        )

        db.session.add(new_block)
        db.session.commit()
        self.chain.append(new_block)

        return new_block

    def is_chain_valid(self):
        self.chain = BlockModel.query.order_by(BlockModel.index).all()

        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i - 1]

            # 1. Previous hash bağlantısı kontrolü
            if current.previous_hash != previous.hash:
                return False, i

            # 2. Index sırası kontrolü
            if current.index != previous.index + 1:
                return False, i

            # 3. Hash doğru mu yeniden hesapla (nonce dahil!)
            recalculated_hash = hashlib.sha256(
                f"{current.index}{current.data}{current.timestamp}{current.previous_hash}{current.nonce}".encode()
            ).hexdigest()

            if current.hash != recalculated_hash:
                return False, i

        return True, None

    def calculate_valid_hash(self, index, data, timestamp, previous_hash):
        nonce = 0
        while True:
            hash_input = f"{index}{data}{timestamp}{previous_hash}{nonce}"
            hash_result = hashlib.sha256(hash_input.encode()).hexdigest()
            if hash_result.startswith("9513"):  # zorluğu sen belirlersin
                return hash_result, nonce
            nonce += 1



