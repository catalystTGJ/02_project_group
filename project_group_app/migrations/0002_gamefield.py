# Generated by Django 3.2 on 2021-04-27 05:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('project_group_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='GameField',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('html_name', models.CharField(max_length=50)),
                ('damage', models.IntegerField()),
                ('x_coord', models.IntegerField()),
                ('y_coord', models.IntegerField()),
                ('transform', models.IntegerField()),
                ('gameactive', models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, related_name='gamefield', to='project_group_app.gameactive')),
                ('gameasset', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='gamefield', to='project_group_app.gameasset')),
            ],
        ),
    ]
