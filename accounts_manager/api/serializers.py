from rest_framework import serializers
from .models import Account, AccountUser, Transaction

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('public_key',)

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('XDR', 'notes', 'available_to_sign', 'total_signature_weight', 'completed')

class AccountUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountUser
        fields = ('name', 'public_key')