from services import db
from sqlalchemy.sql import func
from sqlalchemy import event

from models.account_type import AccountType
from models import Person


class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())
    email = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False, default=0.0)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    person_id = db.Column(db.Integer, db.ForeignKey("person.id"), unique=True)
    person_relation = db.relationship(
        "Person", backref="Account", foreign_keys=person_id, uselist=False
    )

    account_type_id = db.Column(db.Integer, db.ForeignKey("account_type.id"))
    account_type_relation = db.relationship(
        "AccountType", backref="Account", foreign_keys=account_type_id, uselist=False
    )

    def __repr__(self):
        return f"<Account {self.id}>"

    @classmethod
    def __declare_last__(cls):
        event.listen(cls, "before_insert", cls.lowercase)
        event.listen(cls, "before_insert", cls.add_account_type)

    @staticmethod
    def lowercase(mapper, connection, target):
        target.email = target.email.lower()

    @staticmethod
    def add_account_type(mapper, connection, target):
        from sqlalchemy import select

        query = select(AccountType.id).where(AccountType.title == "Gold")
        gold_account_type = db.session.execute(query).first()
        target.account_type_id = gold_account_type.id
