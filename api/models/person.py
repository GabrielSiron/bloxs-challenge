from services import db
from sqlalchemy.sql import func
from apiflask import abort


class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())
    name = db.Column(db.String(50), nullable=False)
    document_number = db.Column(db.String(11), nullable=False, unique=True)
    birth_date = db.Column(db.DateTime, nullable=False)

    def __init__(self, **kwargs):
        super(Person, self).__init__(**kwargs)
        self.document_number = self.clean_document_number(kwargs.get("document_number"))

    def __repr__(self):
        return f"<Person {self.name}>"

    @staticmethod
    def clean_document_number(document_number):
        document_number = document_number.replace("-", "")
        document_number = document_number.replace(".", "")
        return document_number
