from flask import Flask
from flask_cors import CORS  # CORS eklendi
from database import db, create_app
from routes.auth_routes import auth_bp
from routes.transfer import transfer_bp
from routes.item import item_bp
from routes.blockchain_view import blockchain_bp
from routes.user import user_bp
from routes.admin_routes import admin_bp
from blockchain.blockchain import Blockchain
from blockchain.blockchain_instance import set_blockchain_instance


app = create_app()
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

with app.app_context():
    db.create_all()
    blockchain_instance = Blockchain()
    set_blockchain_instance(blockchain_instance)

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(transfer_bp, url_prefix="/api")
    app.register_blueprint(item_bp, url_prefix="/api")
    app.register_blueprint(blockchain_bp, url_prefix="/api")
    app.register_blueprint(user_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True, port=5000)
