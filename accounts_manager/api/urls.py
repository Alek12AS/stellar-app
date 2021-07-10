from django.urls import path
from .views import *

urlpatterns = [
    path('create-user', CreateKeysView.as_view())
]
