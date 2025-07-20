from api.models.user import User
from config.database import db
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity

def authenticate_user(username, password):
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        return user
    return None

def login_user(username, password):
    user = authenticate_user(username, password)
    if user:
        # Convertir user.id a string para evitar el error "Subject must be a string"
        access_token = create_access_token(identity=str(user.id))
        return access_token
    return None

def register_user(username, password):
    if User.query.filter_by(username=username).first():
        return None
    user = User(username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return user

def get_current_user():
    user_id = get_jwt_identity()
    # Convertir de vuelta a int si es necesario para la consulta
    return User.query.get(int(user_id))