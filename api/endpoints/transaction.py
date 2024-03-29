from apiflask import APIBlueprint, abort
from flask import request
from sqlalchemy import select
from sqlalchemy import desc
from sqlalchemy.sql import func
from sqlalchemy.exc import NoResultFound
from datetime import datetime
from flask import Response
from services import db
from decimal import Decimal
from models import Transaction, Account
from validators import MakePix, MakeWithdrawal, MakeDeposit
from endpoints.account import find_user_by_pix_key

transaction_routes = APIBlueprint("transaction", __name__)


@transaction_routes.post("/pix")
@transaction_routes.input(MakePix)
def make_transfer(json_data):
    if not account_is_active():
        abort(401, 'Conta não está ativa. Ative-a na página "Minha Conta"')

    destination_account = find_user_by_pix_key()
    origin_account_id = request.args.get("account_id")
    destination_account_id = destination_account.id
    json_data["destination_account_id"] = destination_account.id

    if origin_account_id == destination_account_id:
        abort(400, "Não é possível fazer um pix com origem e destino iguais.")

    query = select(Account).filter_by(id=origin_account_id)

    origin_account = db.session.execute(query).scalar_one()

    if not origin_account:
        abort(404, "Usuário de origem não encontrado")

    if not destination_account:
        abort(404, "Usuário de destino não encontrado")

    verify_transaction(json_data, origin_account, destination_account)

    transaction = create_transaction(json_data)
    transaction.origin_account_id = origin_account_id
    origin_account.amount -= transaction.value
    destination_account.amount += transaction.value

    try:
        db.session.add_all([transaction, origin_account, destination_account])
        db.session.commit()
    except:
        db.session.rollback()
    finally:
        db.session.close()

    return {"message": "Transação realizada com sucesso"}


@transaction_routes.post("/withdrawal")
@transaction_routes.input(MakeWithdrawal)
def make_withdrawal(json_data):
    if not account_is_active():
        abort(401, 'Conta não está ativa. Ative-a na página "Minha Conta"')

    origin_account_id = request.args.get("account_id")

    query = select(Account).filter_by(id=origin_account_id)

    origin_account = db.session.execute(query).scalar_one()

    if not origin_account:
        abort(404, "User not found")

    initial_date = str(datetime.utcnow().date()) + "T00:00:00"
    final_date = str(datetime.utcnow().date()) + "T23:59:59"

    query = (
        select(func.sum(Transaction.value))
        .filter_by(origin_account_id=origin_account_id)
        .filter(Transaction.created_at >= initial_date)
        .filter(Transaction.created_at <= final_date)
    )

    transfered_amount = db.session.execute(query).scalar_one() or 0

    if (
        transfered_amount + json_data["value"]
        < origin_account.account_type_relation.daily_limit
    ):
        transaction = create_transaction(json_data)
        transaction.origin_account_id = origin_account_id
        origin_account.amount -= transaction.value
        try:
            db.session.add_all([transaction, origin_account])
            db.session.commit()
        except:
            db.session.rollback()
        finally:
            db.session.close()

        return {"message": "Saque realizado com sucesso"}
    abort(400, "Limite diário excedido")


@transaction_routes.post("/deposit")
@transaction_routes.input(MakeDeposit)
def make_deposit(json_data):
    if not account_is_active():
        abort(401, 'Conta não está ativa. Ative-a na página "Minha Conta"')

    destination_account_id = request.args.get("account_id")

    query = select(Account).filter_by(id=destination_account_id)

    destination_account = db.session.execute(query).scalar_one()

    transaction = create_transaction(json_data)
    transaction.destination_account_id = destination_account_id
    destination_account.amount += transaction.value
    try:
        db.session.add_all([transaction, destination_account])
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        abort(401, str(e))
    finally:
        db.session.close()

    return {"message": "Depósito realizado com sucesso"}


@transaction_routes.get("/transactions")
def get_transactions():
    query = request.args
    account_id = request.args.get("account_id")

    page = db.paginate(
        select(Transaction)
        .filter(
            (Transaction.origin_account_id == account_id)
            | (Transaction.destination_account_id == account_id)
        )
        .order_by(desc(Transaction.created_at)),
        page=int(query.get("page", 1)),
        per_page=int(query.get("per_page", 6)),
    )

    items = page.items

    response = {
        "message": "ok",
        "has_prev": page.has_prev,
        "next_num": page.next_num,
        "prev_num": page.prev_num,
        "has_next": page.has_next,
        "transactions": [],
    }

    for transaction in items:
        response["transactions"].append(
            {
                "id": transaction.id,
                "value": transaction.value,
                "date": transaction.created_at,
                "origin_account_id": transaction.origin_account_id,
                "destination_account_name": transaction.destination_account_relation.person_relation.name
                if transaction.destination_account_relation
                else "",
                "destination_account_id": transaction.destination_account_id,
            }
        )

    return response


def create_transaction(json_data):
    transaction = Transaction()
    transaction.value = Decimal(json_data["value"])
    transaction.destination_account_id = json_data.get("destination_account_id")
    transaction.origin_account_id = json_data.get("origin_account_id")
    return transaction


def verify_transaction(json_data, origin_account, destination_account=None):
    from decimal import Decimal

    initial_date = str(datetime.utcnow().date()) + "T00:00:00"
    final_date = str(datetime.utcnow().date()) + "T23:59:59"

    query = (
        select(func.sum(Transaction.value))
        .filter_by(origin_account_id=origin_account.id)
        .filter(Transaction.created_at >= initial_date)
        .filter(Transaction.created_at <= final_date)
    )

    transfered_amount = db.session.execute(query).scalar_one()

    json_data["value"] = Decimal(json_data["value"])

    if json_data["value"] > origin_account.amount:
        abort(401, "Saldo não pode ser negativo")

    if not transfered_amount:
        transfered_amount = 0

    suspicious_percentage = Decimal(0.7)

    if (
        json_data["value"]
        > origin_account.account_type_relation.daily_limit * suspicious_percentage
    ):
        query = (
            select(Transaction)
            .filter_by(origin_account_id=origin_account.id)
            .filter_by(destination_account_id=destination_account.id)
        )

        try:
            db.session.execute(query).scalar_one()
        except NoResultFound:
            try:
                origin_account.is_active = False
                db.session.commit()
            except:
                db.session.rollback()
            finally:
                abort(
                    400,
                    'Conta Bloqueada por Transação Suspeita. Ative-a na aba "Minha Conta"',
                )
                db.session.close()

    if (
        transfered_amount + json_data["value"]
        > origin_account.account_type_relation.daily_limit
    ):
        abort(400, "Limite Diário Excedido")


def account_is_active():
    id = request.args.get("account_id")
    query = select(Account.is_active).filter_by(id=id)

    is_active = db.session.execute(query).scalar_one()

    return is_active
