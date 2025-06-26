# models/block_model.py
from database import db

class BlockModel(db.Model):
    __tablename__ = 'blocks'

    id = db.Column(db.Integer, primary_key=True)
    index = db.Column(db.Integer, nullable=False)
    data = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.String, nullable=False)
    previous_hash = db.Column(db.String, nullable=False)
    hash = db.Column(db.String, nullable=False)
    nonce = db.Column(db.Integer, nullable=False)

