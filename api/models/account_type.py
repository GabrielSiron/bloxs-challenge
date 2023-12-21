from services import db
from sqlalchemy.sql import func


class AccountType(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())
    title = db.Column(db.String(20), nullable=False)
    description = db.Column(db.Text, nullable=False)
    daily_limit = db.Column(db.Numeric(10, 2), nullable=False)

    def __repr__(self):
        return f"<AccountType {self.title}>"
