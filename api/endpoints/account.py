from apiflask import APIBlueprint, abort
from flask import request
from sqlalchemy import select
from sqlalchemy.exc import NoResultFound
from services import db
from models import Account
from models import Person

from validators import (CreateAccountValidator, 
                        ChangePasswordValidator, 
                        LoginValidator)

from utils import encode_auth_token

import os
import jwt

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
    
    try:
        db.session.add(account)
        db.session.commit()
    except:
        db.session.rollback()
    finally:
        db.session.close()

    return {'message': 'Account created successfully'}

@account_routes.put('/change_password')
@account_routes.input(ChangePasswordValidator)
def change_password(json_data):
    
    query = select(Account) \
        .filter_by(email=json_data['email']) \
    
    account = db.session.execute(query).scalar_one()
    
    if account and account.password == json_data['current_password']:
        try:
            account.password = json_data['new_password']
            db.session.commit()
        except:
            db.session.rollback()
        finally:
            db.session.close()
        
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
            'document_number': account.person_relation.document_number,
            'is_active': account.is_active
        }
    
    abort(404, "User was not found")

@account_routes.put('/unblock')
def unblock_account():
    query = select(Account) \
        .filter_by(id=request.args['account_id'])
    
    account = db.session.execute(query).scalar_one()
    try:
        account.is_active = True
        db.session.commit()
    except:
        db.session.rollback()
    finally:
        db.session.close()
    return {'message': 'Conta ativa'}

def find_user_by_pix_key():
    document_number = clean_document_number(request.json['pix_key'])

    query = select(Account) \
        .join(Account.person_relation) \
        .filter_by(document_number=document_number) 
    
    try:
        account = db.session.execute(query).scalar_one()
        return account
    except NoResultFound:
        abort(401, "Chave pix não encontrada. Tente novamente, prestando atenção nos dígitos inseridos.") 

def clean_document_number(document_number):
    document_number = document_number.replace('-',  '')
    document_number = document_number.replace('.', '')
    return document_number