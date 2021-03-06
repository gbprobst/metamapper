# Generated by Django 3.0.7 on 2020-06-25 18:51

from django.db import migrations


create_datastore_properties_view = '''
CREATE OR REPLACE VIEW definitions_datastore_properties AS
SELECT
    row_number() OVER () AS id,
    id AS table_id,
    k AS property_id,
    v AS property_value
FROM definitions_datastore, jsonb_each_text(custom_properties) AS t(k,v)
'''

create_table_properties_view = '''
CREATE OR REPLACE VIEW definitions_table_properties AS
SELECT
    row_number() OVER () AS id,
    id AS table_id,
    k AS property_id,
    v AS property_value
FROM definitions_table, jsonb_each_text(custom_properties) AS t(k,v)
'''


class Migration(migrations.Migration):

    dependencies = [
        ('definitions', '0003_auto_20200617_1941'),
    ]

    operations = [
        migrations.RunSQL(create_datastore_properties_view),
        migrations.RunSQL(create_table_properties_view),
    ]
