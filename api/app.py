import os
from time import sleep

from apiflask import APIFlask
from flask_migrate import Migrate
from flask_cors import CORS
import sqlalchemy

from endpoints import account_routes
from endpoints import transaction_routes
from services import db
import models


def create_app():
    app = APIFlask(__name__)

    migrate = Migrate()

    driver = os.environ['DB_DRIVER']
    user = os.environ['DB_USER']
    password = os.environ['DB_PASSWORD']
    host = os.environ['DB_HOST']
    port = os.environ['DB_PORT']
    db_name = os.environ['DB_NAME']

    app.config["SQLALCHEMY_DATABASE_URI"] = f'{driver}://{user}:{password}@{host}:{port}/{db_name}'

    cors = CORS(app, resources={r'/*': {'origins': '*'}})
    
    with app.app_context():
        db.init_app(app)
        migrate.init_app(app, db)
        # wait the db service is ready
        # sleep(10)
        db.create_all() 

    app.register_blueprint(account_routes)
    app.register_blueprint(transaction_routes)

    @app.cli.command("populate-database")
    def populate_database():
        from models import AccountType
        from models import Account
        from models import Person

        # Creating two account types. User will be seted to the first type.
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
        first_person.name = 'Gabriel'
        first_person.birth_date = '2001-06-19'
        first_person.document_number = '99999999999'

        first_account = Account()
        first_account.email = 'testing.bloxs@gmail.com'
        first_account.password = 'password'
        first_account.amount = 10000.00
        first_account.person_relation = first_person
        first_account.account_type_relation = gold_account_type

        second_person = Person()
        second_person.name = 'Siron'
        second_person.birth_date = '2001-06-19'
        second_person.document_number = '88888888888'

        second_account = Account()
        second_account.email = 'testing.siron@gmail.com'
        second_account.password = 'password'
        second_account.amount = 10000.00
        second_account.person_relation = second_person
        second_account.account_type_relation = diamond_account_type
        
        db.session.add(diamond_account_type)
        db.session.add_all([first_account,second_account])
        try:
            db.session.commit()
        except sqlalchemy.exc.IntegrityError:
            print('Users already exists. Skipping seed...')
        
    return app


if __name__ == '__main__':
    app = create_app()
