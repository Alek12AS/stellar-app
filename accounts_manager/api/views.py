from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.serializers import Serializer
from .serializers import *
from .models import Account, AccountUser, Token
from rest_framework.views import APIView
from rest_framework.response import Response


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

class CreateKeysView(APIView):
    
    serializer_class = CreateKeysSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            name = serializer.data.get('name')
            public_key = serializer.data.get('public_key')
        
        user = AccountUser(name=name, public_key=public_key)
        user.save()
        
        return Response(AccountUserSerializer(user).data, status=status.HTTP_201_CREATED)
