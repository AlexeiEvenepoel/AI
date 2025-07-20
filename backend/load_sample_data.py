import json
import os
import sys
from main import create_app
from config.database import db
from api.models.recipe import Recipe
from api.models.ingredient import Ingredient, RecipeIngredient

def load_sample_data():
    """
    Carga datos de ejemplo en la base de datos
    """
    app = create_app()
    
    with app.app_context():
        try:
            # Crear tablas si no existen
            db.create_all()
            print("✅ Tablas creadas exitosamente")
            
            # Verificar si ya hay datos
            if Recipe.query.count() > 0:
                print("⚠️  Ya existen recetas en la base de datos")
                response = input("¿Desea continuar y agregar más datos? (y/n): ")
                if response.lower() != 'y':
                    return
            
            # Cargar datos del archivo JSON
            json_path = os.path.join('data', 'sample_recipes.json')
            if not os.path.exists(json_path):
                print("❌ No se encontró el archivo de datos de ejemplo")
                return
            
            with open(json_path, 'r', encoding='utf-8') as f:
                recipes_data = json.load(f)
            
            print(f"📖 Cargando {len(recipes_data)} recetas...")
            
            for recipe_data in recipes_data:
                # Crear receta
                recipe = Recipe(
                    name=recipe_data['name'],
                    description=recipe_data['description'],
                    instructions=recipe_data['instructions'],
                    prep_time=recipe_data['prep_time'],
                    cook_time=recipe_data['cook_time'],
                    servings=recipe_data['servings']
                )
                
                db.session.add(recipe)
                db.session.flush()  # Para obtener el ID
                
                # Agregar ingredientes
                for ing_data in recipe_data['ingredients']:
                    # Buscar o crear ingrediente
                    ingredient = Ingredient.query.filter_by(name=ing_data['name']).first()
                    if not ingredient:
                        ingredient = Ingredient(name=ing_data['name'])
                        db.session.add(ingredient)
                        db.session.flush()
                    
                    # Crear relación receta-ingrediente
                    recipe_ingredient = RecipeIngredient(
                        recipe_id=recipe.id,
                        ingredient_id=ingredient.id,
                        quantity=ing_data['quantity'],
                        notes=ing_data['notes']
                    )
                    db.session.add(recipe_ingredient)
                
                print(f"✅ Receta agregada: {recipe.name}")
            
            db.session.commit()
            print("🎉 Datos cargados exitosamente!")
            
            # Mostrar estadísticas
            recipe_count = Recipe.query.count()
            ingredient_count = Ingredient.query.count()
            print(f"📊 Total de recetas: {recipe_count}")
            print(f"📊 Total de ingredientes únicos: {ingredient_count}")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error cargando datos: {e}")

if __name__ == "__main__":
    load_sample_data()
