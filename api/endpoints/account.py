from apiflask import APIBlueprint, abort
from flask import request
from sqlalchemy import select
from services import db
from models import Account
from models import Person

from validators import (CreateAccountValidator, 
                        ChangePasswordValidator, 
                        LoginValidator)

from utils import encode_auth_token

account_routes = APIBlueprint('account', __name__)

@account_routes.post('/signup')
@account_routes.input(CreateAccountValidator)
def create_account(json_data):
    person = Person()
    account = Account()

    person.name = json_data['name']
    person.document_number = json_data['document_number']
    person.birth_date = json_data['birth_date']

    account.email = json_data['email']
    account.password = json_data['password']
    
    account.person_relation = person
    
    db.session.add(account)
    db.session.commit()

    return {'message': 'Account created successfully'}

@account_routes.put('/change_password')
@account_routes.input(ChangePasswordValidator)
def change_password(json_data):
    
    query = select(Account) \
        .filter_by(email=json_data['email']) \
    
    account = db.session.execute(query).scalar_one()
    
    if account and account.password == json_data['current_password']:
        account.password = json_data['new_password']
        db.session.commit()
        return {'message': 'Sucessfully changed password'}
    abort(400, 'Unable to change password')

@account_routes.post('/login')
@account_routes.input(LoginValidator)
def login(json_data):
    query = select(Account) \
        .filter_by(email=json_data['email']) \
        .filter_by(password=json_data['password'])
    
    account = db.session.execute(query).scalar_one()
    
    if account:
        token = encode_auth_token(account.id)
        return {
            'message': 'Logged in',
            'token': token
        }
    
    abort(400, 'Unable to login')

@account_routes.get('/account')
def get_account_info():
    id = request.args['account_id']

    query = select(Account) \
        .filter_by(id=id)
    
    account = db.session.execute(query).scalar_one()
    
    if account:
        return {
            'message': 'ok',
            'id': account.id,
            'amount': account.amount,
            'email': account.email,
            'name': account.person_relation.name,
            'document_number': account.person_relation.document_number
        }
    
    abort(404, "User was not found")

@account_routes.get('/pix-key')
def find_pix_key():
    document_number = clean_document_number(request.args['document_number'])

    query = select(Account) \
        .join(Account.person_relation) \
        .filter_by(document_number=document_number) 
    
    account = db.session.execute(query).scalar_one()

    if account:
        return {
            'message': 'Usuário encontrado!',
            'id': account.id
        }
    
    abort(400, "Chave pix não foi encontrada. Verifique-a e tente novamente.")

def clean_document_number(document_number):
    document_number = document_number.replace('-',  '')
    document_number = document_number.replace('.', '')
    return document_number