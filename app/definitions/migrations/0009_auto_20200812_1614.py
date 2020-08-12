# Generated by Django 3.0.8 on 2020-08-12 16:14

from django.db import migrations, models
import utils.delete.managers
import utils.postgres.managers


class Migration(migrations.Migration):

    dependencies = [
        ('definitions', '0008_auto_20200810_0520'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='column',
            managers=[
                ('objects', utils.delete.managers.SoftDeletionManager()),
                ('all_objects', utils.delete.managers.SoftDeletionManager(alive_only=False)),
            ],
        ),
        migrations.AlterModelManagers(
            name='datastore',
            managers=[
                ('objects', utils.postgres.managers.PostgresManager()),
            ],
        ),
        migrations.AlterModelManagers(
            name='index',
            managers=[
                ('objects', utils.postgres.managers.PostgresManager()),
            ],
        ),
        migrations.AlterModelManagers(
            name='schema',
            managers=[
                ('objects', utils.delete.managers.SoftDeletionManager()),
                ('all_objects', utils.delete.managers.SoftDeletionManager(alive_only=False)),
            ],
        ),
        migrations.AlterModelManagers(
            name='table',
            managers=[
                ('objects', utils.delete.managers.SoftDeletionManager()),
                ('all_objects', utils.delete.managers.SoftDeletionManager(alive_only=False)),
            ],
        ),
        migrations.AlterField(
            model_name='column',
            name='comment',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='column',
            name='short_desc',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='datastore',
            name='short_desc',
            field=models.CharField(blank=True, max_length=140, null=True),
        ),
        migrations.AlterField(
            model_name='table',
            name='short_desc',
            field=models.CharField(blank=True, max_length=140, null=True),
        ),
    ]