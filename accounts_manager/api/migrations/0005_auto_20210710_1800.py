# Generated by Django 3.2.5 on 2021-07-10 17:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20210708_2228'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='account',
            name='high_weight',
        ),
        migrations.RemoveField(
            model_name='account',
            name='low_weight',
        ),
        migrations.RemoveField(
            model_name='account',
            name='medium_weight',
        ),
        migrations.RemoveField(
            model_name='accountuser',
            name='created_at',
        ),
        migrations.RemoveField(
            model_name='accountuser',
            name='email',
        ),
        migrations.RemoveField(
            model_name='accountuser',
            name='weight',
        ),
    ]