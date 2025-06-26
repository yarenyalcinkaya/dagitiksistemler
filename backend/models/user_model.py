from database import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(300), nullable=False)  # ✅ Daha uzun yap
    wallet_address = db.Column(db.String(100), unique=True, nullable=True)
    role = db.Column(db.String(10), default="USER")
    items = db.relationship("Item", backref="owner", cascade="all, delete", passive_deletes=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    sent_transfers = db.relationship("Transfer",
                                     foreign_keys="[Transfer.from_user_id]",
                                     cascade="all, delete",
                                     passive_deletes=True)

    received_transfers = db.relationship("Transfer",
                                         foreign_keys="[Transfer.to_user_id]",
                                         cascade="all, delete",
                                         passive_deletes=True)
