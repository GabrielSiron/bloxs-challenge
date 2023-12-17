from apiflask import APIBlueprint, abort
from services import db
from models import Account
from models import AccountType
from models import Person
from validators import CreateAccountValidator, ChangePasswordValidator, LoginValidator

account_routes = APIBlueprint('account', __name__)

@account_routes.post('/account')
@account_routes.input(CreateAccountValidator)
def create_account(json_data):
    person = Person()
    account = Account()

    person.name = json_data['name']
    person.document_number = json_data['document_number']
    person.birth_date = json_data['birth_date']

    account.email = json_data['email']
    account.password = json_data['password']
    
    gold_account_type = AccountType.query.filter_by(title='Gold') \
        .with_entities(AccountType.id) \
        .first()
    
    account.account_type_id = gold_account_type.id
    account.person_relation = person
    db.session.add(account)
    db.session.commit()

    return {'message': 'Account created successfully'}

@account_routes.put('/change_password')
@account_routes.input(ChangePasswordValidator)
def change_password(json_data):
    
    account = Account.query \
        .filter_by(email=json_data['email']) \
        .first()
    
    if account and account.password == json_data['current_password']:
        account.password = json_data['new_password']
        db.session.commit()
        return {'message': 'Sucessfully changed password'}
    abort(400, 'Unable to change password')

@account_routes.post('/login')
@account_routes.input(LoginValidator)
def login(json_data):
    account = Account.query \
        .filter_by(email=json_data['email']) \
        .filter_by(password=json_data['password']) \
        .first()
    
    if account:
        return {'message': 'Logged in'}
    
    abort(400, 'Unable to login')