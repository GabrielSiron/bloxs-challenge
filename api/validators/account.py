from apiflask import Schema
from apiflask.fields import String, DateTime
from apiflask.validators import Length


class CreateAccountValidator(Schema):
    email = String(required=True, validate=Length(0, 50))
    password = String(required=True, validate=Length(0, 50))
    name = String(required=True, validate=Length(0, 50))
    document_number = String(required=True, validate=Length(0, 50))
    birth_date = DateTime(required=True)

class ChangePasswordValidator(Schema):
    email = String(required=True, validate=Length(0, 50))
    current_password = String(required=True, validate=Length(0, 50))
    new_password = String(required=True, validate=Length(0, 50))

class LoginValidator(Schema):
    email = String(required=True, validate=Length(0, 50))
    password = String(required=True, validate=Length(0, 50))