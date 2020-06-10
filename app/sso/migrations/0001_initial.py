# Generated by Django 2.2.6 on 2020-05-26 16:36

from django.conf import settings
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion
import utils.encrypt.fields
import utils.mixins.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('authentication', '0002_workspace_team_members'),
    ]

    operations = [
        migrations.CreateModel(
            name='SSOConnection',
            fields=[
                ('id', models.CharField(db_index=True, editable=False, max_length=30, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_enabled', models.BooleanField(default=False)),
                ('entity_id', models.CharField(max_length=128)),
                ('sso_url', models.CharField(max_length=512, null=True)),
                ('x509cert', utils.encrypt.fields.EncryptedTextField(null=True)),
                ('extras', django.contrib.postgres.fields.jsonb.JSONField(default=dict)),
                ('provider', models.CharField(choices=[('GITHUB', 'Github'), ('GOOGLE', 'Google for Work'), ('GENERIC', 'SAML2')], default='GENERIC', max_length=30)),
                ('default_permissions', models.CharField(choices=[('OWNER', 'Administrator (Owner)'), ('MEMBER', 'Member'), ('READONLY', 'Readonly')], default='READONLY', max_length=10)),
                ('workspace', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sso_connections', to='authentication.Workspace')),
            ],
            options={
                'db_table': 'sso_connections',
            },
            bases=(utils.mixins.models.DirtyModel, models.Model),
        ),
        migrations.CreateModel(
            name='SSODomain',
            fields=[
                ('id', models.CharField(db_index=True, editable=False, max_length=30, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('domain', models.CharField(db_index=True, max_length=255, unique=True)),
                ('attempts', models.PositiveIntegerField(default=0)),
                ('last_attempted_at', models.DateTimeField(default=None, null=True)),
                ('verified_at', models.DateTimeField(default=None, null=True)),
                ('verification_token', models.CharField(max_length=100)),
                ('workspace', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sso_domains', to='authentication.Workspace')),
            ],
            options={
                'db_table': 'sso_domains',
            },
        ),
        migrations.CreateModel(
            name='SSOIdentity',
            fields=[
                ('id', models.CharField(db_index=True, editable=False, max_length=30, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('ident', models.CharField(max_length=128)),
                ('metadata', django.contrib.postgres.fields.jsonb.JSONField(default=dict)),
                ('last_verified_at', models.DateTimeField(auto_now_add=True)),
                ('last_synced_at', models.DateTimeField(auto_now_add=True)),
                ('provider', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sso_identities', to='sso.SSOConnection')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sso_identities', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'sso_identities',
                'unique_together': {('provider', 'ident')},
            },
        ),
    ]
