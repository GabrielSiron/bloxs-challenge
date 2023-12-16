from apiflask import APIFlask
from services import db
import models

app = APIFlask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://root:password@localhost:3306/db"

with app.app_context():
    db.init_app(app)
    db.create_all()

@app.get('/')
def home():
    return 'Hello World!'