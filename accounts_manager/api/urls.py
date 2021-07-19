from django.urls import path
from .views import *

urlpatterns = [
    path('create-user', CreateKeysView.as_view()),
    path('get-user', GetUser.as_view()),
    path('get-publicKey', getPublicKey.as_view()),
    path('check-username', getPublicKey.as_view()),
    path('create-account', CreateAccountView.as_view())
]

