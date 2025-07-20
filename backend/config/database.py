from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    """Inicializa la base de datos con la aplicación Flask"""
    db.init_app(app)
