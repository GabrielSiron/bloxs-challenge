from apiflask import Schema
from apiflask.fields import Integer, Float


class MakeTransfer(Schema):
    value = Float(required=True)
    origin_account_id = Integer(required=True)
    destination_account_id = Integer(required=True)

class MakeWithdrawal(Schema):
    value = Float(required=True)
    origin_account_id = Integer(required=True)

class MakeDeposit(Schema):
    value = Float(required=True)
    destination_account_id = Integer(required=True)