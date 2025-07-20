from marshmallow import Schema, fields

class IngredientDTO(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    category = fields.Str()
    created_at = fields.DateTime(dump_only=True)

class CreateIngredientDTO(Schema):
    name = fields.Str(required=True)
    category = fields.Str()

class ImageAnalysisDTO(Schema):
    description = fields.Str(dump_only=True)
    ingredients = fields.List(fields.Str(), dump_only=True)
    confidence = fields.Float(dump_only=True)

class ImageUploadDTO(Schema):
    image = fields.Raw(required=True, description="Image file to analyze")
