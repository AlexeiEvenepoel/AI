from flask import Blueprint, request, jsonify
from api.services.image_service import ImageService
from api.services.recipe_service import RecipeService
from api.dto.ingredient_dto import ImageAnalysisDTO
from werkzeug.utils import secure_filename
import os

image_routes = Blueprint('image_routes', __name__)
image_service = ImageService()
recipe_service = RecipeService()
image_analysis_dto = ImageAnalysisDTO()

# Configuración para subida de archivos
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'avif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@image_routes.route('/analyze', methods=['POST'])
def analyze_image():
    """Analiza una imagen y extrae ingredientes"""
    try:
        # Verificar si se subió un archivo
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No se encontró archivo de imagen'
            }), 400
        
        file = request.files['image']
        
        # Verificar si el archivo está vacío
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No se seleccionó archivo'
            }), 400
        
        # Verificar extensión del archivo
        if not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'error': 'Formato de archivo no permitido. Use: png, jpg, jpeg, gif, webp, avif'
            }), 400
        
        # Procesar la imagen
        result = image_service.analyze_image(file)
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error procesando imagen: {str(e)}'
        }), 500

@image_routes.route('/analyze-and-suggest', methods=['POST'])
def analyze_and_suggest_recipes():
    """Analiza una imagen y sugiere recetas basadas en los ingredientes detectados"""
    try:
        # Verificar archivo
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No se encontró archivo de imagen'
            }), 400
        
        file = request.files['image']
        
        if file.filename == '' or not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'error': 'Archivo inválido'
            }), 400
        
        # Analizar imagen
        analysis_result = image_service.analyze_image(file)
        
        # Buscar recetas basadas en los ingredientes detectados
        recipes = []
        if analysis_result['ingredients']:
            recipes = recipe_service.search_recipes_by_ingredients(analysis_result['ingredients'])
        
        return jsonify({
            'success': True,
            'data': {
                'analysis': analysis_result,
                'suggested_recipes': [recipe.to_dict() for recipe in recipes],
                'recipe_count': len(recipes)
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error procesando imagen: {str(e)}'
        }), 500

@image_routes.route('/test', methods=['GET'])
def test_endpoint():
    """Endpoint de prueba"""
    return jsonify({
        'success': True,
        'message': 'Image service is working!',
        'allowed_formats': list(ALLOWED_EXTENSIONS)
    }), 200
