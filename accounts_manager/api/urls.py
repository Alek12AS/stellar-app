from django.urls import path
from .views import *

urlpatterns = [
    path('create-user', CreateKeysView.as_view()),
    path('get-user', GetUser.as_view()),
]
