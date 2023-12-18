from apiflask import APIBlueprint, abort
from sqlalchemy.sql import func
from services import db
from decimal import Decimal
from models import Transaction, Account
from validators import MakeTransfer, MakeWithdrawal, MakeDeposit


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
    
def create_transaction(json_data):
    transaction = Transaction()
    transaction.value = Decimal(json_data['value'])
    transaction.destination_account_id = json_data.get('destination_account_id')
    transaction.origin_account_id = json_data.get('origin_account_id')
    return transaction