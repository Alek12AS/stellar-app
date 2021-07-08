from django.urls import path
from .views import *

urlpatterns = [
    path('api/accounts', AccountView.as_view()),
    path('api/users', AccountUserView.as_view()),
    path('api/tokens', TokenView.as_view())
]
