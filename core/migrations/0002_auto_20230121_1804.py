# Generated by Django 3.2.8 on 2023-01-21 12:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='questionoptions',
            old_name='attachment_url',
            new_name='attachment',
        ),
        migrations.RenameField(
            model_name='questions',
            old_name='attachment_url',
            new_name='attachment',
        ),
    ]
