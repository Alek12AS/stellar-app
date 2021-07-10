from rest_framework import serializers
from .models import Account, AccountUser, Token

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('id', 'code', 'created_at', 'high_weight', 'medium_weight', 'low_weight')

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ('id', 'code', 'balance', 'created_at', 'account')

class AccountUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountUser
        fields = ('name', 'public_key')

class CreateKeysSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountUser
        fields = ('name','public_key')