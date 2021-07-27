from rest_framework import serializers
from .models import Account, AccountUser, Transaction

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('name', 'public_key', 'created_at')

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('code','XDR', 'requestee_username', 'amount', 'asset_type', 'destination', 'notes', 'available_to_sign', 'total_signature_weight', 'created_at', 'completed')

class CreateTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields=('XDR', 'amount', 'asset_type', 'destination', 'notes', 'total_signature_weight', 'completed', 'available_to_sign')

class AccountUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountUser
        fields = ('name', 'public_key')