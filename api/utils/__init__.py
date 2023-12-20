from flask import request
import bcrypt
from services import db
import os
import jwt
from datetime import datetime, timedelta

def token_has_expired(expiration_date):
    return datetime.utcnow() > expiration_date

def encode_auth_token(account_id):
    try:
        payload = {
            'expires_in': str(datetime.utcnow() + timedelta(days=30)),
            'created_at': str(datetime.utcnow()),
            'account_id': str(account_id),
        }

        return jwt.encode(
            payload,
            os.environ['SECRET_KEY'],
            algorithm="HS256"
        )
    except Exception as e:
        return str(e)
    
def encript_password(password):
    hashed = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt())
    return hashed