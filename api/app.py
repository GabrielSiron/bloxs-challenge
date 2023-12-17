from apiflask import APIFlask
from services import db
from endpoints.account import account_routes
from os import getenv
from flask_migrate import Migrate
from flask_cors import CORS
import models
import os
from time import sleep

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
        sleep(10)
        db.create_all() 

    app.register_blueprint(account_routes)

    @app.cli.command("populate-database")
    def populate_database():
        from models.account_type import AccountType
        from models.account import Account
        from models.person import Person

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

        person = Person()
        person.name = 'Gabriel'
        person.birth_date = '2001-06-19'
        person.document_number = '99999999999'

        account = Account()
        account.email = 'testing.bloxs@gmail.com'
        account.password = 'password'
        account.person_relation = person
        account.account_type_relation = gold_account_type
        
        db.session.add(diamond_account_type)
        db.session.add(account)
        db.session.commit()
    return app


if __name__ == '__main__':
    app = create_app()
