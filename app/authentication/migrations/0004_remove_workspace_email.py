# Generated by Django 2.2.6 on 2020-05-30 23:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0003_workspace_active_sso'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='workspace',
            name='email',
        ),
    ]
