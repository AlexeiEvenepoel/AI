from config.database import db

class Ingredient(db.Model):
    __tablename__ = 'ingredients'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    category = db.Column(db.String(50))  # ej: vegetable, meat, dairy, etc.
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class RecipeIngredient(db.Model):
    __tablename__ = 'recipe_ingredients'
    
    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredients.id'), nullable=False)
    quantity = db.Column(db.String(50))  # ej: "2 cups", "1 lb", "3 pieces"
    notes = db.Column(db.String(200))  # ej: "chopped", "diced", "optional"
    
    # Relaciones
    ingredient = db.relationship('Ingredient', backref='recipe_ingredients', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'recipe_id': self.recipe_id,
            'ingredient_id': self.ingredient_id,
            'quantity': self.quantity,
            'notes': self.notes,
            'ingredient': self.ingredient.to_dict() if self.ingredient else None
        }
