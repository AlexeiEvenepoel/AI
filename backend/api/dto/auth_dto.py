from marshmallow import Schema, fields

class AuthDTO(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True)
