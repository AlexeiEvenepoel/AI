from marshmallow import Schema, fields, validate

class UserDTO(Schema):
    """DTO para mostrar información del usuario"""
    id = fields.Int(dump_only=True)
    username = fields.Str()

class UserCreateDTO(Schema):
    """DTO para crear usuario"""
    username = fields.Str(
        required=True, 
        validate=validate.Length(min=3, max=80),
        error_messages={'required': 'Username is required'}
    )
    password = fields.Str(
        required=True,
        validate=validate.Length(min=6, max=128),
        error_messages={'required': 'Password is required'}
    )

class UserUpdateDTO(Schema):
    """DTO para actualizar usuario"""
    username = fields.Str(
        validate=validate.Length(min=3, max=80),
        missing=None
    )
    password = fields.Str(
        validate=validate.Length(min=6, max=128),
        missing=None
    )