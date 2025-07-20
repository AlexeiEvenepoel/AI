from flask import Blueprint, request, jsonify
from api.services.recipe_service import RecipeService
from api.dto.recipe_dto import RecipeDTO, CreateRecipeDTO
from marshmallow import ValidationError

recipe_routes = Blueprint('recipe_routes', __name__)
recipe_service = RecipeService()
recipe_dto = RecipeDTO()
create_recipe_dto = CreateRecipeDTO()

@recipe_routes.route('/', methods=['GET'])
def get_all_recipes():
    """Obtiene todas las recetas"""
    try:
        recipes = recipe_service.get_all_recipes()
        return jsonify({
            'success': True,
            'data': [recipe.to_dict() for recipe in recipes]
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@recipe_routes.route('/<int:recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    """Obtiene una receta por ID"""
    try:
        recipe = recipe_service.get_recipe_by_id(recipe_id)
        if not recipe:
            return jsonify({
                'success': False,
                'error': 'Receta no encontrada'
            }), 404
        
        return jsonify({
            'success': True,
            'data': recipe.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@recipe_routes.route('/', methods=['POST'])
def create_recipe():
    """Crea una nueva receta"""
    try:
        # Validar datos de entrada
        recipe_data = create_recipe_dto.load(request.json)
        
        # Crear receta
        recipe = recipe_service.create_recipe(recipe_data)
        
        return jsonify({
            'success': True,
            'data': recipe.to_dict()
        }), 201
    except ValidationError as e:
        return jsonify({
            'success': False,
            'error': 'Datos inválidos',
            'details': e.messages
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@recipe_routes.route('/<int:recipe_id>', methods=['PUT'])
def update_recipe(recipe_id):
    """Actualiza una receta existente"""
    try:
        recipe_data = request.json
        recipe = recipe_service.update_recipe(recipe_id, recipe_data)
        
        if not recipe:
            return jsonify({
                'success': False,
                'error': 'Receta no encontrada'
            }), 404
        
        return jsonify({
            'success': True,
            'data': recipe.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@recipe_routes.route('/<int:recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    """Elimina una receta"""
    try:
        success = recipe_service.delete_recipe(recipe_id)
        
        if not success:
            return jsonify({
                'success': False,
                'error': 'Receta no encontrada'
            }), 404
        
        return jsonify({
            'success': True,
            'message': 'Receta eliminada exitosamente'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@recipe_routes.route('/search', methods=['POST'])
def search_recipes():
    """Busca recetas por ingredientes"""
    try:
        data = request.json
        ingredients = data.get('ingredients', [])
        
        if not ingredients:
            return jsonify({
                'success': False,
                'error': 'Se requiere al menos un ingrediente'
            }), 400
        
        recipes = recipe_service.search_recipes_by_ingredients(ingredients)
        
        return jsonify({
            'success': True,
            'data': [recipe.to_dict() for recipe in recipes],
            'count': len(recipes)
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
