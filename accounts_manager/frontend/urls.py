from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('create/', index),
    path('user/<str:public_key>', index)
]