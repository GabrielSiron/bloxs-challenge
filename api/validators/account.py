from apiflask import Schema, abort
from apiflask.fields import String, Integer, DateTime
from apiflask.validators import Length


class CreateAccountValidator(Schema):
    email = String(required=True, validate=Length(10, 50))
    password = String(required=True, validate=Length(8, 50))
    name = String(required=True, validate=Length(3, 50))
    document_number = String(required=True, validate=Length(14, 14))
    birth_date = DateTime(required=True)


class ChangePasswordValidator(Schema):
    current_password = String(required=True, validate=Length(8, 50))
    new_password = String(required=True, validate=Length(8, 50))


class LoginValidator(Schema):
    email = String(required=True, validate=Length(10, 50))
    password = String(required=True, validate=Length(8, 50))
    name = String(validate=Length(3, 50))
    document_number = String(validate=Length(14, 14))
    birth_date = DateTime()


class GetAccountInfo(Schema):
    email = String(required=True, validate=Length(10, 50))
