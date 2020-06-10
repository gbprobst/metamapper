# Generated by Django 2.2.6 on 2020-05-26 16:38

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion
import utils.mixins.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('authentication', '0003_workspace_active_sso'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomField',
            fields=[
                ('id', models.CharField(db_index=True, editable=False, max_length=30, primary_key=True, serialize=False, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('field_name', models.CharField(max_length=30)),
                ('field_type', models.CharField(choices=[('USER', 'User'), ('TEXT', 'Text'), ('ENUM', 'Enum')], max_length=30)),
                ('validators', django.contrib.postgres.fields.jsonb.JSONField(default=dict)),
                ('short_desc', models.CharField(blank=True, max_length=50, null=True)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='custom_fields', to='contenttypes.ContentType')),
                ('workspace', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='custom_fields', to='authentication.Workspace')),
            ],
            options={
                'db_table': 'customfields',
                'unique_together': {('workspace', 'content_type', 'field_name')},
            },
            bases=(utils.mixins.models.AuditableModel, models.Model),
        ),
    ]
