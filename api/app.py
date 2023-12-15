from apiflask import APIFlask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

app = APIFlask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://root:password@localhost/db"
db.init_app(app)

@app.get('/')
def home():
    return 'Hello  World!'