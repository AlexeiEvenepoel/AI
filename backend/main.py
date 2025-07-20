from flask import Flask
from flask_cors import CORS
from config.database import db, init_db
from api.routes.image_routes import image_routes
from api.routes.recipe_routes import recipe_routes
from api.routes.auth_routes import auth_routes
from api.routes.user_routes import user_routes
import os
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager

# Cargar variables de entorno
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuración (AÑADE JWT_SECRET_KEY)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')  # Para Flask
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')  # Específica para JWT
    
    # Inicializar extensiones (ASIGNA A UNA VARIABLE jwt)
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:4200"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    init_db(app)
    jwt = JWTManager(app)  # <-- Asigna a una variable
    
    # Registrar blueprints
    app.register_blueprint(image_routes, url_prefix='/api/images')
    app.register_blueprint(recipe_routes, url_prefix='/api/recipes')
    app.register_blueprint(auth_routes, url_prefix='/api/auth')
    app.register_blueprint(user_routes, url_prefix='/api/users')
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    # Crear tablas
    with app.app_context():
        db.create_all()
    
    app.run(debug=True, host='0.0.0.0', port=5000)