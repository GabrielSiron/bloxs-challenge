from apiflask import APIBlueprint, abort
from flask import request, jsonify, make_response
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import NoResultFound, IntegrityError

from services import db
from models import Account, AccountType
from models import Person
from validators import CreateAccountValidator, ChangePasswordValidator, LoginValidator
from utils import encode_auth_token

account_routes = APIBlueprint("account", __name__)


@account_routes.post("/signup")
@account_routes.input(CreateAccountValidator)
def create_account(json_data):
    person = Person(
        name=json_data["name"],
        document_number=json_data["document_number"],
        birth_date=json_data["birth_date"],
    )

    account = Account(
        email=json_data["email"], password=json_data["password"], person_relation=person
    )

    try:
        db.session.add(account)
        db.session.commit()

    except IntegrityError as e:
        db.session.rollback()
        return make_response(jsonify(message="cpf ou email já cadastrados"), 401)
    except Exception as e:
        return make_response(
            jsonify(message="Ops! Ocorreu um erro. Tente novamente.", error=str(e)), 401
        )
    finally:
        db.session.close()

    return login()


@account_routes.put("/change_password")
@account_routes.input(ChangePasswordValidator)
def change_password(json_data):
    query = select(Account).filter_by(id=request.args["account_id"])
    account = db.session.execute(query).scalar_one()

    if account and account.password == json_data["current_password"]:
        try:
            account.password = json_data["new_password"]
            db.session.commit()
        except:
            db.session.rollback()
        finally:
            db.session.close()

        return {"message": "Sucessfully changed password"}

    abort(400, "Senhas não coincidem")


@account_routes.post("/login")
@account_routes.input(LoginValidator)
def login(json_data):
    query = (
        select(Account.id)
        .filter_by(email=json_data["email"])
        .filter_by(password=json_data["password"])
    )

    try:
        id = db.session.execute(query).scalar_one()
        token = encode_auth_token(id)
        return {"message": "Logged in", "token": token}
    except NoResultFound:
        abort(400, "Email ou senha invalidos")


@account_routes.get("/account")
def get_account_info():
    query = (
        select(Account)
        .outerjoin(Person)
        .outerjoin(AccountType)
        .filter(Account.id == request.args["account_id"])
    )

    account = db.session.execute(query).scalar_one()

    if account:
        return {
            "message": "ok",
            "id": account.id,
            "amount": account.amount,
            "email": account.email,
            "name": account.person_relation.name,
            "document_number": account.person_relation.document_number,
            "is_active": account.is_active,
            "account_type": account.account_type_relation.title,
            "account_daily_limit": account.account_type_relation.daily_limit,
        }

    return jsonify(404, message="Usuário não foi encontrado")


@account_routes.put("/unblock")
def unblock_account():
    query = select(Account).filter_by(id=request.args["account_id"])

    account = db.session.execute(query).scalar_one()
    try:
        account.is_active = True
        db.session.commit()
    except:
        db.session.rollback()
    finally:
        db.session.close()
    return {"message": "Conta ativa"}


@account_routes.put("/block")
def block_account():
    query = select(Account).filter_by(id=request.args["account_id"])

    account = db.session.execute(query).scalar_one()
    try:
        account.is_active = False
        db.session.commit()
    except:
        db.session.rollback()
    finally:
        db.session.close()
    return {"message": "Conta desativada"}


def find_user_by_pix_key():
    document_number = Person.clean_document_number(request.json["pix_key"])

    query = (
        select(Account)
        .join(Account.person_relation)
        .filter_by(document_number=document_number)
    )

    try:
        account = db.session.execute(query).scalar_one()
        return account
    except NoResultFound:
        abort(
            401,
            "Chave pix não encontrada. Tente novamente, prestando atenção nos dígitos inseridos.",
        )
