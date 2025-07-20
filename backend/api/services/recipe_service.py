from api.models.recipe import Recipe
from api.models.ingredient import Ingredient, RecipeIngredient
from config.database import db
from typing import List, Optional

class RecipeService:
    
    @staticmethod
    def get_all_recipes() -> List[Recipe]:
        """Obtiene todas las recetas"""
        return Recipe.query.all()
    
    @staticmethod
    def get_recipe_by_id(recipe_id: int) -> Optional[Recipe]:
        """Obtiene una receta por ID"""
        return Recipe.query.get(recipe_id)
    
    @staticmethod
    def create_recipe(recipe_data: dict) -> Recipe:
        """Crea una nueva receta"""
        recipe = Recipe(
            name=recipe_data.get('name'),
            description=recipe_data.get('description'),
            instructions=recipe_data.get('instructions'),
            prep_time=recipe_data.get('prep_time'),
            cook_time=recipe_data.get('cook_time'),
            servings=recipe_data.get('servings')
        )
        
        db.session.add(recipe)
        db.session.flush()  # Para obtener el ID de la receta
        
        # Agregar ingredientes si existen
        if 'ingredients' in recipe_data:
            for ing_data in recipe_data['ingredients']:
                ingredient = RecipeService._get_or_create_ingredient(ing_data['ingredient_name'])
                recipe_ingredient = RecipeIngredient(
                    recipe_id=recipe.id,
                    ingredient_id=ingredient.id,
                    quantity=ing_data.get('quantity'),
                    notes=ing_data.get('notes')
                )
                db.session.add(recipe_ingredient)
        
        db.session.commit()
        return recipe
    
    @staticmethod
    def update_recipe(recipe_id: int, recipe_data: dict) -> Optional[Recipe]:
        """Actualiza una receta existente"""
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return None
        
        recipe.name = recipe_data.get('name', recipe.name)
        recipe.description = recipe_data.get('description', recipe.description)
        recipe.instructions = recipe_data.get('instructions', recipe.instructions)
        recipe.prep_time = recipe_data.get('prep_time', recipe.prep_time)
        recipe.cook_time = recipe_data.get('cook_time', recipe.cook_time)
        recipe.servings = recipe_data.get('servings', recipe.servings)
        
        db.session.commit()
        return recipe
    
    @staticmethod
    def delete_recipe(recipe_id: int) -> bool:
        """Elimina una receta"""
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return False
        
        db.session.delete(recipe)
        db.session.commit()
        return True
    
    @staticmethod
    def search_recipes_by_ingredients(ingredient_names: List[str]) -> List[Recipe]:
        """Busca recetas que contengan los ingredientes especificados"""
        if not ingredient_names:
            return []
        
        # Buscar recetas que contengan cualquiera de los ingredientes
        recipes = db.session.query(Recipe).join(RecipeIngredient).join(Ingredient).filter(
            Ingredient.name.in_([name.lower() for name in ingredient_names])
        ).distinct().all()
        
        return recipes
    
    @staticmethod
    def _get_or_create_ingredient(ingredient_name: str) -> Ingredient:
        """Obtiene un ingrediente existente o crea uno nuevo"""
        ingredient = Ingredient.query.filter_by(name=ingredient_name.lower()).first()
        if not ingredient:
            ingredient = Ingredient(name=ingredient_name.lower())
            db.session.add(ingredient)
            db.session.flush()
        return ingredient
