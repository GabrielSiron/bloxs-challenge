from services import db
from sqlalchemy.sql import func


class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())
    balance = db.Column(db.Numeric, nullable=False)
    daily_limit = db.Column(db.Numeric, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
    person_id = db.Column(db.Integer, db.ForeignKey("person.id"), unique=True)
    person_relation = db.relationship("Person", backref="Account", foreign_keys=person_id, uselist=False)

    account_type_id = db.Column(db.Integer, db.ForeignKey("account_type.id"), unique=True)
    account_type_relation = db.relationship("AccountType", backref="Account", foreign_keys=account_type_id, uselist=False)

    def __repr__(self):
        return f'<Account {self.id}>'
