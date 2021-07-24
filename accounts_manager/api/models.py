from django.db import models
import string, random

def generate_unique_code():
    length = 8
    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Transaction.objects.filter(code=code).count() == 0:
            break
    return code
            

# Create your models here.
class Account(models.Model):
    name = models.CharField(max_length=100, default="Default Name")
    public_key = models.CharField(max_length=56, default='', unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.public_key

class AccountUser(models.Model):
    name = models.CharField(max_length=1000)
    public_key = models.CharField(max_length=56, unique=True)

    account = models.ManyToManyField(Account)

    def __str__(self):
        return self.name

class Transaction(models.Model):
    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    XDR = models.CharField(max_length=1000)
    requestee_username = models.CharField(max_length=1000, default="")
    destination = models.CharField(max_length=56, default="")
    amount = models.DecimalField(max_digits=20, decimal_places=7, default=0)
    asset_type = models.CharField(max_length=8, default="")
    notes = models.CharField(max_length=1000, blank=True)
    available_to_sign = models.BooleanField(default=True)
    total_signature_weight = models.IntegerField()
    completed = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)

    account = models.ForeignKey(Account, on_delete=models.CASCADE)

    # To keep track of the users that signed it
    signers = models.ManyToManyField(AccountUser)
    # To keep track of the users that rejected the transaction
    rejecters = models.ManyToManyField(AccountUser, related_name='rejected_transactions')