from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('sign-up/', index),
    path('sign-in/', index),
    path('account/<str:public_key>', index),
    path('user/', index),
    path('create-account/', index)
]