
# Author: A.Apetrei

# Summary: 
# Contains all the api views to handle api related tasks for the app.

from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from .serializers import *
from .models import Account, AccountUser, Transaction



# class GetUserDetails(APIView)

# Description: Returns information about the user including the username and associated accounts.

  
class GetUserDetails(APIView):
    serializer_class = AccountUserSerializer
    lookup_url_kwarg = 'public_key'

    def get(self, request, format=None):
        public_key = request.GET.get(self.lookup_url_kwarg)
        if public_key != None:
            user = AccountUser.objects.filter(public_key=public_key)
            if len(user) > 0:
                user_data = AccountUserSerializer(user[0]).data
                accounts = []

                for a in user[0].account.all():
                    account_data = AccountSerializer(a).data
                    accounts.append(account_data)
                
                data = {"user_details": user_data, "accounts": accounts}

                return Response(data, status=status.HTTP_200_OK)
        
            return Response({ 'User Not Found': 'Invalid Public Key. '}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

# class getPublicKey(APIView)

# Description: Returns the public key of a user in return for the username provided

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

# class getTransactions(APIView)

# Description: Obtains all the transactions associated with a particular account.

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
                    dataSet = TransactionSerializer(t).data

                    # Add a list of the signers and rejecters of the transaction as well as signed
                    # and rejected fields to update in the browser
                    dataSet["signers"] = []
                    dataSet["rejecters"] = []
                    dataSet["signed"] = False
                    dataSet["rejected"] = False

                    for s in t.signers.all():
                        dataSet["signers"].append(s.public_key)

                    for r in t.rejecters.all():
                        dataSet["rejecters"].append(r.public_key)

                    data.append(dataSet)
                
                return Response(data, status=status.HTTP_200_OK)
            
            return Response({ 'Account Not Found': 'Invalid Public Key. '}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

# class getAccountDetails(APIView)

# Description: Returns the details of a particular account including the name and creation time

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


# class CreateUserView(APIView)

# Description: Created a user in the database.

class CreateUserView(APIView):
    
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

# class CreateAccountView(APIView)

# Description: Created an account in the database.

class CreateAccountView(APIView):
    serializer_class = AccountSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data["create_account"])
        
        if serializer.is_valid():
        
            public_key = serializer.data.get('public_key')
            name = serializer.data.get('name')
        
            account = Account(name=name, public_key=public_key)
            account.save()

            for username in request.data["usernames"]:
                user = AccountUser.objects.get(name = username)
                user.account.add(account)
        
            return Response(AccountSerializer(account).data, status=status.HTTP_201_CREATED)
        print(serializer.data)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

# class RequestToSign(APIView)

# Description: Handles a sign request. If available the transaction is returned in XDR format.

class RequestToSign(APIView):

    def post(self, request, format=None):
        
        t1 = Transaction.objects.filter(code=request.data["code"])

        if len(t1) > 0: 
            weight = request.data["weight"]
            medium_threshold = request.data["medium_threshold"]

            if t1[0].completed:
                return Response(status=status.HTTP_208_ALREADY_REPORTED)
            
            elif weight + t1[0].total_signature_weight <= medium_threshold:
                if t1[0].available_to_sign:
                    t1[0].available_to_sign = False
                    t1[0].save()

                    data = {"XDR":t1[0].XDR,
                    "total_signature_weight":t1[0].total_signature_weight}

                    return Response(data,status=status.HTTP_200_OK)

                return Response(status=status.HTTP_226_IM_USED)
        
            else:
                return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

        return Response(status=status.HTTP_404_NOT_FOUND)

# class TransactionSigned(APIView)

# Description: Receives a signed transaction and updates the database.

class TransactionSigned(APIView):

    def post(self, request, format=None):
        
        t1 = Transaction.objects.filter(code=request.data["code"])
        
        if len(t1) > 0:
            weight = request.data["weight"]
            medium_threshold = request.data["medium_threshold"]
            print(request.data["XDR"])
            t1[0].XDR = request.data["XDR"]
            t1[0].available_to_sign = True
            t1[0].total_signature_weight = t1[0].total_signature_weight + weight

            if t1[0].total_signature_weight == medium_threshold:
                t1[0].completed = True
            
            # add the user as a signer
            user = AccountUser.objects.get(public_key = request.data["public_key"])
            t1[0].signers.add(user)
            
            t1[0].save()
        
            return Response(status=status.HTTP_202_ACCEPTED)

        return Response(status=status.HTTP_404_NOT_FOUND)

# class MakeTransactionAvailableToSign(APIView)

# Description: Makes transaction available to sign by setting the variable available_to_sign to true.

class MakeTransactionAvailableToSign(APIView):

    def post(self, request, format=None):
        t = Transaction.objects.filter(code=request.data["code"])
        if len(t) > 0:
            t.available_to_sign = True
            t.save()

            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)

# class RejectTransaction(APIView)

# Description: Adds a user to the list of users who rejected the corresponding transaction.

class RejectTransaction(APIView):

    def post(self, request, format=None):
        
        t1 = Transaction.objects.filter(code=request.data["code"])

        if len(t1) != 0:
            print(request.data)
            user = AccountUser.objects.get(public_key = request.data["public_key"])
            t1[0].rejecters.add(user)
            
            t1[0].save()

            return Response(status=status.HTTP_202_ACCEPTED)

        return Response(status=status.HTTP_404_NOT_FOUND)

# class CreateTransaction(APIView)

# Description: Creates a transaction in the database.

class CreateTransaction(APIView):

    serializer_class = CreateTransactionSerializer

    def post(self, request, format=None):
         
        serializer = self.serializer_class(data=request.data["transaction"])
        print(request.data['transaction'])

        if serializer.is_valid():
        
            user_publicKey = request.data['user_publicKey']
            account_id = request.data['account_id']
            account = Account.objects.get(public_key=account_id)
            user = AccountUser.objects.get(public_key=user_publicKey)
            
            requestee_username = user.name
            XDR = serializer.data.get("XDR")
            destination = serializer.data.get("destination")
            amount = serializer.data.get("amount")
            asset_type = serializer.data.get('asset_type')
            notes = serializer.data.get("notes")
            total_signature_weight = serializer.data.get("total_signature_weight")
            completed = serializer.data.get("completed")
            available_to_sign = serializer.data.get("available_to_sign")
             

            new_trans = Transaction(XDR = XDR, requestee_username=requestee_username, destination= destination, amount=amount, asset_type=asset_type,
            notes=notes, total_signature_weight=total_signature_weight, completed=completed, available_to_sign=available_to_sign,
            account=account)
            
            new_trans.save()

            new_trans.signers.add(user)
        
            
            return Response(status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_400_BAD_REQUEST)

