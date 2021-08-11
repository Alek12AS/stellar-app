from django.urls import path
from .views import *

urlpatterns = [
    path('create-user', CreateUserView.as_view()),
    path('get-user-details', GetUserDetails.as_view()),
    path('get-publicKey', getPublicKey.as_view()),
    path('get-transactions', getTransactions.as_view()),
    path('get-account', getAccountDetails.as_view()),
    path('check-username', getPublicKey.as_view()),
    path('create-account', CreateAccountView.as_view()),
    path('transaction-signed', TransactionSigned.as_view()),
    path('transaction-rejected', RejectTransaction.as_view()),
    path('request-to-sign', RequestToSign.as_view()),
    path('create-transaction', CreateTransaction.as_view()),
    path('make-available', MakeTransactionAvailableToSign.as_view())
]

