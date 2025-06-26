from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

db = SQLAlchemy()

def create_app():
    load_dotenv()

    app = Flask(__name__)
    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'connect_args': {'options': '-c timezone=utc'}
    }

    db.init_app(app)

    return app
