from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.serializers import Serializer
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

class GetUser(APIView):
    serializer_class = AccountUserSerializer
    lookup_url_kwarg = 'public_key'

    def get(self, request, format=None):
        public_key = request.GET.get(self.lookup_url_kwarg)
        if public_key != None:
            user = AccountUser.objects.filter(public_key=public_key)
            if len(user) > 0:
                data = AccountUserSerializer(user[0]).data
                
                return Response(data, status=status.HTTP_200_OK)
        
            return Response({ 'User Not Found': 'Invalid Public Key. '}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class getPublicKey(APIView):
    serializer_class = AccountUserSerializer
    lookup_url_kwarg = 'username'

    def get(self, request, format=None):
        username = request.GET.get(self.lookup_url_kwarg)
        if username != None:
            user = AccountUser.objects.filter(name=username)
            if len(user) > 0:
                data = AccountUserSerializer(user[0]).data

                return Response(data ,status=status.HTTP_200_OK)
        
            return Response({ 'User Not Found': 'Invalid Public Key. '}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

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

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
