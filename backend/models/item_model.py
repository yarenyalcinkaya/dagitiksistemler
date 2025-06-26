# models/item_model.py
from database import db

class Item(db.Model):
    __tablename__ = "items"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    owner_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='CASCADE'),  # ✅ foreign key cascade
        nullable=False
    )


class Transfer(db.Model):
    __tablename__ = "transfers"
    id = db.Column(db.Integer, primary_key=True)

    item_id = db.Column(
        db.Integer,
        db.ForeignKey('items.id', ondelete='CASCADE'),
        nullable=False
    )

    from_user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False
    )

    to_user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False
    )

    timestamp = db.Column(db.DateTime, default=db.func.now())
