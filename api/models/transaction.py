from services import db
from sqlalchemy.sql import func


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())
    value = db.Column(db.Numeric, nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey("account.id"), unique=True)
    account_relation = db.relationship("Account", backref="Transaction", foreign_keys=account_id, uselist=False)

    def __repr__(self):
        return f'<Transaction {self.value}>'