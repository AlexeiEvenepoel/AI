from marshmallow import Schema, fields

class RecipeDTO(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    description = fields.Str()
    instructions = fields.Str()
    prep_time = fields.Int()
    cook_time = fields.Int()
    servings = fields.Int()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    ingredients = fields.List(fields.Nested('RecipeIngredientDTO'), dump_only=True)

class CreateRecipeDTO(Schema):
    name = fields.Str(required=True)
    description = fields.Str()
    instructions = fields.Str()
    prep_time = fields.Int()
    cook_time = fields.Int()
    servings = fields.Int()
    ingredients = fields.List(fields.Nested('CreateRecipeIngredientDTO'))

class RecipeIngredientDTO(Schema):
    id = fields.Int(dump_only=True)
    recipe_id = fields.Int()
    ingredient_id = fields.Int()
    quantity = fields.Str()
    notes = fields.Str()
    ingredient = fields.Nested('IngredientDTO', dump_only=True)

class CreateRecipeIngredientDTO(Schema):
    ingredient_name = fields.Str(required=True)
    quantity = fields.Str()
    notes = fields.Str()
