from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from .serializers import *
from .models import Account, AccountUser, Transaction


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

class getTransactions(APIView):
    serializer_class = TransactionSerializer
    lookup_url_kwarg = 'account_id'
    
    def get(self, request, format=None):
        public_key = request.GET.get(self.lookup_url_kwarg)
        
        if public_key != None:
            account = Account.objects.filter(public_key=public_key)
            if len(account) > 0:
                data = []
                for t in account[0].transaction_set.all():
                    new_dataSet = TransactionSerializer(t)
                    new_dataSet.data["signers"] = []
                    new_dataSet["signed"] = False

                    for s in t.signers.all():
                        new_dataSet["signers"].append(s.public_key)
                    
                    data.append(new_dataSet)
                
                return Response(data, status=status.HTTP_200_OK)
            
            return Response({ 'Account Not Found': 'Invalid Public Key. '}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class getAccountDetails(APIView):

    serializer_class = AccountSerializer
    lookup_url_kwarg = 'account_id'
    
    def get(self, request, format=None):
        account_id = request.GET.get(self.lookup_url_kwarg)
        
        if account_id != None:
            account = Account.objects.filter(public_key=account_id)
            if len(account) > 0:
                data = AccountSerializer(account[0]).data

                return Response(data, status=status.HTTP_200_OK)
            
            return Response({ 'Account Not Found': 'Invalid Public Key. '}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)



class CreateKeysView(APIView):
    
    serializer_class = AccountUserSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
        
            name = serializer.data.get('name')
            public_key = serializer.data.get('public_key')
        
            user = AccountUser(name=name, public_key=public_key)
            user.save()
        
            return Response(AccountUserSerializer(user).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class CreateAccountView(APIView):
    serializer_class = AccountSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data["create_account"])

        if serializer.is_valid():
        
            public_key = serializer.data.get('public_key')
        
            account = Account(public_key=public_key)
            account.save()

            for username in request.data["usernames"]:
                user = AccountUser.objects.get(name = username)
                user.account.add(account)
        
            return Response(AccountSerializer(account).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)