from services import db
from sqlalchemy.sql import func


class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())
    name = db.Column(db.String(50), nullable=False)
    document_number = db.Column(db.String(11), nullable=False)
    birth_date = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f'<Person {self.name}>'
