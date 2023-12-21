from apiflask import APIFlask, abort
from datetime import datetime
from flask_migrate import Migrate
from flask_cors import CORS
import jwt
import os
from werkzeug.datastructures import ImmutableMultiDict

from endpoints import account_routes
from endpoints import transaction_routes
from services import db
from seeder import seed_database

import models
from utils import token_has_expired


def create_app():
    app = APIFlask(__name__)

    migrate = Migrate()

    testing = "Testando o limite de caracteres por linha definido no BLACK e testando se o pre-commit ira funcioncar corretamente."
    driver = os.environ["DB_DRIVER"]
    user = os.environ["DB_USER"]
    password = os.environ["DB_PASSWORD"]
    host = os.environ["DB_HOST"]
    port = os.environ["DB_PORT"]
    db_name = os.environ["DB_NAME"]

    app.config[
        "SQLALCHEMY_DATABASE_URI"
    ] = f"{driver}://{user}:{password}@{host}:{port}/{db_name}"

    cors = CORS(app, resources={r"/*": {"origins": "*"}})

    with app.app_context():
        db.init_app(app)
        migrate.init_app(app, db)
        db.create_all()
        seed_database()

    app.register_blueprint(account_routes)
    app.register_blueprint(transaction_routes)

    @app.before_request
    def is_authenticated():
        from flask import request

        if request.method == "OPTIONS":
            return

        if request.path in ["/login", "/signup"]:
            return

        token = request.headers.get("Authorization")

        if token:
            try:
                payload = jwt.decode(
                    token, os.getenv("SECRET_KEY"), algorithms=["HS256"]
                )
                expiration_date = datetime.strptime(
                    payload["expires_in"][:19], "%Y-%m-%d %H:%M:%S"
                )
                if token_has_expired(expiration_date):
                    abort(403, "Token has expired. Please log in")

                http_args = request.args.to_dict()
                http_args["account_id"] = payload["account_id"]

                request.args = ImmutableMultiDict(http_args)
            except Exception as e:
                abort(403, str(e))
        else:
            abort(403, "Token is missing")

    return app


if __name__ == "__main__":
    app = create_app()
