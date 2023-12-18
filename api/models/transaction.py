from services import db
from sqlalchemy.sql import func


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())
    value = db.Column(db.Numeric(10,2), nullable=False)
    origin_account_id = db.Column(db.Integer, db.ForeignKey("account.id"))
    origin_account_relation = db.relationship("Account", foreign_keys=origin_account_id, uselist=False)
    destination_account_id = db.Column(db.Integer, db.ForeignKey("account.id"))
    destination_account_relation = db.relationship("Account", foreign_keys=destination_account_id, uselist=False)

    def __repr__(self):
        return f'<Transaction {self.value}>'