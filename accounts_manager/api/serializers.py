from rest_framework import serializers
from .models import Account, AccountUser, Transaction

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('name', 'created_at')

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('code','XDR', 'amount', 'notes', 'available_to_sign', 'total_signature_weight', 'created_at', 'completed')

class AccountUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountUser
        fields = ('name', 'public_key')