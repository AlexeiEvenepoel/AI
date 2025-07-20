from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from api.services.user_service import (
    create_user, get_user_by_id, get_all_users, 
    update_user, delete_user, get_user_by_username
)
from api.dto.user_dto import UserDTO, UserCreateDTO, UserUpdateDTO

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/', methods=['GET'])
@jwt_required()
def get_users():
    """Obtener todos los usuarios"""
    try:
        users = get_all_users()
        return jsonify([UserDTO().dump(u) for u in users]), 200
    except Exception as e:
        return jsonify({'message': 'Error fetching users', 'error': str(e)}), 500

@user_routes.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """Obtener usuario por ID"""
    try:
        user = get_user_by_id(user_id)
        if user:
            return jsonify(UserDTO().dump(user)), 200
        return jsonify({'message': 'User not found'}), 404
    except Exception as e:
        return jsonify({'message': 'Error fetching user', 'error': str(e)}), 500

@user_routes.route('/', methods=['POST'])
@jwt_required()
def create_new_user():
    """Crear nuevo usuario"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        # Validar datos con el DTO
        user_create_dto = UserCreateDTO()
        try:
            validated_data = user_create_dto.load(data)
        except ValidationError as err:
            return jsonify({'message': 'Validation error', 'errors': err.messages}), 400
        
        # Verificar si el usuario ya existe
        if get_user_by_username(validated_data['username']):
            return jsonify({'message': 'Username already exists'}), 409
        
        user = create_user(validated_data['username'], validated_data['password'])
        if user:
            return jsonify(UserDTO().dump(user)), 201
        return jsonify({'message': 'User creation failed'}), 400
    
    except Exception as e:
        return jsonify({'message': 'Error creating user', 'error': str(e)}), 500

@user_routes.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user_route(user_id):
    """Actualizar usuario"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        # Validar datos con el DTO
        user_update_dto = UserUpdateDTO()
        try:
            validated_data = user_update_dto.load(data)
        except ValidationError as err:
            return jsonify({'message': 'Validation error', 'errors': err.messages}), 400
        
        # Verificar si el usuario existe
        existing_user = get_user_by_id(user_id)
        if not existing_user:
            return jsonify({'message': 'User not found'}), 404
        
        # Si se está actualizando el username, verificar que no exista otro usuario con ese nombre
        if 'username' in validated_data and validated_data['username'] != existing_user.username:
            if get_user_by_username(validated_data['username']):
                return jsonify({'message': 'Username already exists'}), 409
        
        user = update_user(user_id, validated_data)
        if user:
            return jsonify(UserDTO().dump(user)), 200
        return jsonify({'message': 'User update failed'}), 400
    
    except Exception as e:
        return jsonify({'message': 'Error updating user', 'error': str(e)}), 500

@user_routes.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user_route(user_id):
    """Eliminar usuario"""
    try:
        current_user_id = get_jwt_identity()
        
        # Evitar que un usuario se elimine a sí mismo
        if int(current_user_id) == user_id:
            return jsonify({'message': 'Cannot delete your own account'}), 400
        
        # Verificar si el usuario existe
        if not get_user_by_id(user_id):
            return jsonify({'message': 'User not found'}), 404
        
        result = delete_user(user_id)
        if result:
            return jsonify({'message': 'User deleted successfully'}), 200
        return jsonify({'message': 'User deletion failed'}), 400
    
    except Exception as e:
        return jsonify({'message': 'Error deleting user', 'error': str(e)}), 500
