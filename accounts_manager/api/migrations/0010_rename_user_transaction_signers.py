# Generated by Django 3.2.5 on 2021-07-22 14:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_transaction_user'),
    ]

    operations = [
        migrations.RenameField(
            model_name='transaction',
            old_name='user',
            new_name='signers',
        ),
    ]
