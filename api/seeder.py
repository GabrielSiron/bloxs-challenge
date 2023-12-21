from models import Account
from models import AccountType
from models import Person
from services import db

def seed_database():
    user = Account.query.all()
    if not user:
        gold_account_type = AccountType()
        gold_limit = 500.00
        gold_account_type.title = 'Gold'
        gold_account_type.description = f'Contas GOLD possuem limite diário de R${gold_limit}'
        gold_account_type.daily_limit = gold_limit

        diamond_account_type = AccountType()
        diamond_limit = 1500.00
        diamond_account_type.title = 'Diamond'
        diamond_account_type.description = f'Contas Diamond possuem limite diário de R${diamond_limit}'
        diamond_account_type.daily_limit = diamond_limit

        first_person = Person()
        first_person.name = 'Gabriel Menezes'
        first_person.birth_date = '2001-06-19'
        first_person.birth_date = '2001-06-19'
        first_person.document_number = '99999999999'

        first_account = Account()
        first_account.email = 'gabriel@bloxs.com'
        first_account.password = 'password'
        first_account.amount = 10000.00
        first_account.person_relation = first_person
        first_account.account_type_relation = gold_account_type

        second_person = Person()
        second_person.name = 'Lucas Ayres'
        second_person.birth_date = '2001-06-19'
        second_person.birth_date = '2001-06-19'
        second_person.document_number = '88888888888'

        second_account = Account()
        second_account.email = 'lucas@bloxs.com'
        second_account.password = 'password'
        second_account.amount = 10000.00
        second_account.person_relation = second_person
        second_account.account_type_relation = diamond_account_type
        
        try:
            db.session.add(diamond_account_type)
            db.session.add_all([first_account,second_account])
            db.session.commit()
        except:
            db.session.rollback()
        finally:
            db.session.close()