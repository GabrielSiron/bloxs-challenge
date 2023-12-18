from apiflask import APIBlueprint, abort
from flask import request
from sqlalchemy.sql import func
from sqlalchemy import or_
from services import db
from decimal import Decimal
from models import Transaction, Account
from validators import MakeTransfer, MakeWithdrawal, MakeDeposit
import jwt
import os


transaction_routes = APIBlueprint('transaction', __name__)

@transaction_routes.post('/pix')
@transaction_routes.input(MakeTransfer)
def make_transfer(json_data):
    from datetime import datetime

    origin_account_id = json_data['origin_account_id']
    destination_account_id = json_data['destination_account_id']
    
    if origin_account_id == destination_account_id:
        abort(400, "Não é possível fazer um pix com origem e destino iguais.")
        
    origin_account = Account.query.filter_by(id=origin_account_id).first()
    destination_account = Account.query.filter_by(id=destination_account_id).first()
    
    if not origin_account:
        abort(404, 'Origin user not found')
        
    if not destination_account:
        abort(404, 'Destination user not found')
        
    initial_date = str(datetime.utcnow().date()) + "T00:00:00"
    final_date = str(datetime.utcnow().date()) + "T23:59:59"

    transfered_amount = db.session \
        .query(func.sum(Transaction.value)) \
        .filter(Transaction.origin_account_id == origin_account_id) \
        .filter(Transaction.created_at >= initial_date) \
        .filter(Transaction.created_at <= final_date) \
        .scalar() or 0.0
    
    if transfered_amount < origin_account.account_type_relation.daily_limit:
        transaction = create_transaction(json_data)
        origin_account.amount -= transaction.value
        destination_account.amount += transaction.value
        db.session.add_all([transaction, origin_account, destination_account])
        db.session.commit()
        return {'message': 'transaction ended successfully'}
    abort(400, 'daily limit exceeded')

@transaction_routes.post('/withdrawal')
@transaction_routes.input(MakeWithdrawal)
def make_withdrawal(json_data):
    from datetime import datetime

    origin_account_id = json_data['origin_account_id']
    origin_account = Account.query.filter_by(id=origin_account_id).first()

    if not origin_account:
        abort(404, 'User not found')

    initial_date = str(datetime.utcnow().date()) + "T00:00:00"
    final_date = str(datetime.utcnow().date()) + "T23:59:59"

    transfered_amount = db.session \
        .query(func.sum(Transaction.value)) \
        .filter(Transaction.origin_account_id == origin_account_id) \
        .filter(Transaction.created_at >= initial_date) \
        .filter(Transaction.created_at <= final_date) \
        .scalar() or 0.0
    
    if transfered_amount < origin_account.account_type_relation.daily_limit:
        transaction = create_transaction(json_data)
        origin_account.amount -= transaction.value
        db.session.add_all([transaction, origin_account])
        db.session.commit()
        return {'message': 'withdrawal ended successfully'}
    abort(400, 'daily limit exceeded')

@transaction_routes.post('/deposit')
@transaction_routes.input(MakeDeposit)
def make_deposit(json_data):
    from datetime import datetime

    destination_account_id = json_data['destination_account_id']
    destination_account = Account.query.filter_by(id=destination_account_id).first()

    transaction = create_transaction(json_data)
    destination_account.amount += transaction.value
    db.session.add_all([transaction, destination_account])
    db.session.commit()
    return {'message': 'deposit ended successfully'}

@transaction_routes.get('/transactions')
def get_transactions():
    query = request.args
    token = request.headers.get('authorization')
    payload = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
    
    total_transactions = Transaction.query.count()
    transactions = Transaction.query \
        .filter((Transaction.origin_account_id == payload['user_id']) | \
                (Transaction.destination_account_id == payload['user_id']))
                
    page = transactions.paginate(
            page=int(query.get('page', 1)),
            per_page=int(query.get('per_page', 20))
        )
    
    items = page.items
    
    response = {
        'message': 'ok',
        'has_prev': page.has_prev,
        'next_num': page.next_num,
        'prev_num': page.prev_num,
        'has_next': page.has_next,
        'transactions': []
    }

    for transaction in items:
        destination_name = ''
        if transaction.destination_account_relation:
            destination_name = transaction.destination_account_relation.person_relation.name
        response['transactions'].append(
            {
                'id': transaction.id,
                'value': transaction.value,
                'date': transaction.created_at,
                'origin_account_id': transaction.origin_account_id,
                'destination_account_name': destination_name,
                'destination_account_id': transaction.destination_account_id,
            }
        )

    return response
    
def create_transaction(json_data):
    transaction = Transaction()
    transaction.value = Decimal(json_data['value'])
    transaction.destination_account_id = json_data.get('destination_account_id')
    transaction.origin_account_id = json_data.get('origin_account_id')
    return transaction

