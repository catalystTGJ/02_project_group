# Generated by Django 3.2 on 2021-04-27 05:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('project_group_app', '0002_gamefield'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gamefield',
            name='gameactive',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='gamefield', to='project_group_app.gameactive'),
        ),
        migrations.AlterField(
            model_name='gamefield',
            name='gameasset',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='gamefield', to='project_group_app.gameasset'),
        ),
    ]
