from ml.blip.image_processor import BlipImageProcessor
from ml.utils.ingredient_extractor import extract_ingredients_from_text
from PIL import Image
import io
from typing import Dict, List

class ImageService:
    
    def __init__(self):
        self.blip_processor = BlipImageProcessor()
    
    def analyze_image(self, image_file) -> Dict:
        """
        Analiza una imagen y extrae ingredientes
        
        Args:
            image_file: Archivo de imagen subido
            
        Returns:
            Dict con descripción, ingredientes detectados y confianza
        """
        try:
            # Convertir el archivo a imagen PIL
            image = Image.open(io.BytesIO(image_file.read())).convert('RGB')
            
            # Procesar con BLIP
            description = self.blip_processor.process_image(image)
            
            # Extraer ingredientes del texto generado
            ingredients = extract_ingredients_from_text(description)
            
            # Calcular confianza básica (puedes mejorarlo)
            confidence = self._calculate_confidence(description, ingredients)
            
            return {
                'description': description,
                'ingredients': ingredients,
                'confidence': confidence
            }
            
        except Exception as e:
            raise Exception(f"Error procesando imagen: {str(e)}")
    
    def _calculate_confidence(self, description: str, ingredients: List[str]) -> float:
        """
        Calcula un score de confianza básico
        """
        if not ingredients:
            return 0.0
        
        # Score simple basado en la cantidad de ingredientes encontrados
        # y la longitud de la descripción
        base_score = min(len(ingredients) * 0.2, 0.8)
        description_score = min(len(description.split()) * 0.01, 0.2)
        
        return round(base_score + description_score, 2)
