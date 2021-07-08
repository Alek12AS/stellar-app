from django.db import models
import string, random

def generate_unique_code():
    length = 8
    while True:
        code = ''.join(random.choices(string.string.ascii_uppercase), k=length)
        if Account.objects.filter(code=code).count() == 0:
            break
    return code
            

# Create your models here.
class Account(models.Model):
    code = models.CharField(max_length=8,null=False , default=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    high_weight = models.IntegerField(null=False, default=False)
    medium_weight = models.IntegerField(null=False, default=False)
    low_weight = models.IntegerField(null=False, default=False)

class Token(models.Model):
    code = models.CharField(max_length=12, default='', unique=True)
    balance = models.DecimalField(max_digits=20, decimal_places=7)
    created_at = models.DateTimeField(auto_now_add=True)

    account = models.ForeignKey(Account, on_delete=models.CASCADE)

class AccountUser(models.Model):
    public_key = models.CharField(max_length=56,null=False, unique=True)
    name = models.CharField(max_length=1000, blank=True)
    email = models.EmailField(max_length=255, blank=True)
    weight = models.IntegerField(null=False, default=False)
    created_at = models.DateTimeField(auto_now_add=True)


    account = models.ManyToManyField(Account)
    