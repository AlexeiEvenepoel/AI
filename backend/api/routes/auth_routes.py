from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.services.auth_service import login_user, register_user, get_current_user
from api.dto.user_dto import UserDTO

auth_routes = Blueprint('auth_routes', __name__)

@auth_routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400
    
    token = login_user(username, password)
    if token:
        return jsonify({'access_token': token}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@auth_routes.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400
    
    user = register_user(username, password)
    if user:
        return jsonify(UserDTO().dump(user)), 201
    return jsonify({'message': 'Username already exists'}), 400

@auth_routes.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    try:
        user = get_current_user()
        if user:
            return jsonify(UserDTO().dump(user)), 200
        return jsonify({'message': 'User not found'}), 404
    except Exception as e:
        return jsonify({'message': 'Invalid token'}), 401