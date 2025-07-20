from api.models.user import User
from config.database import db
from sqlalchemy.exc import IntegrityError

def create_user(username, password):
    """Crear un nuevo usuario"""
    try:
        user = User(username=username)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return user
    except IntegrityError:
        db.session.rollback()
        return None
    except Exception as e:
        db.session.rollback()
        raise e

def get_user_by_id(user_id):
    """Obtener usuario por ID"""
    try:
        return User.query.get(user_id)
    except Exception as e:
        raise e

def get_user_by_username(username):
    """Obtener usuario por username"""
    try:
        return User.query.filter_by(username=username).first()
    except Exception as e:
        raise e

def get_all_users():
    """Obtener todos los usuarios"""
    try:
        return User.query.all()
    except Exception as e:
        raise e

def update_user(user_id, data):
    """Actualizar usuario"""
    try:
        user = User.query.get(user_id)
        if not user:
            return None
        
        if 'username' in data:
            user.username = data['username']
        if 'password' in data:
            user.set_password(data['password'])
        
        db.session.commit()
        return user
    except IntegrityError:
        db.session.rollback()
        return None
    except Exception as e:
        db.session.rollback()
        raise e

def delete_user(user_id):
    """Eliminar usuario"""
    try:
        user = User.query.get(user_id)
        if not user:
            return False
        
        db.session.delete(user)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        raise e