from django.shortcuts import render
from rest_framework import generics
from .serializers import *
from .models import Account, AccountUser, Token


# Create your views here.
class AccountView(generics.ListAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

class TokenView(generics.ListAPIView):
    queryset = Token.objects.all()
    serializer_class = TokenSerializer

class AccountUserView(generics.ListAPIView):
    queryset = AccountUser.objects.all()
    serializer_class = AccountUserSerializer