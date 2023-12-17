import os
from time import sleep

from apiflask import APIFlask
from flask_migrate import Migrate
from flask_cors import CORS
import sqlalchemy

from endpoints import account_routes
from endpoints import transaction_routes
from services import db
from seeder import seed_database
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
        db.create_all() 
        seed_database()

    app.register_blueprint(account_routes)
    app.register_blueprint(transaction_routes)
        
    return app


if __name__ == '__main__':
    app = create_app()
