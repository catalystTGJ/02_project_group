# Generated by Django 3.2 on 2021-04-23 19:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='GameAsset',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=50)),
                ('filename', models.CharField(max_length=50)),
                ('width', models.IntegerField()),
                ('height', models.IntegerField()),
                ('resistance', models.IntegerField()),
                ('max_damage', models.IntegerField()),
                ('damage_pot', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='GameHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('screenname1', models.CharField(max_length=255)),
                ('screenname2', models.CharField(max_length=255)),
                ('screenname3', models.CharField(max_length=255)),
                ('screenname4', models.CharField(max_length=255)),
                ('score1', models.IntegerField()),
                ('score2', models.IntegerField()),
                ('score3', models.IntegerField()),
                ('score4', models.IntegerField()),
                ('damage1', models.IntegerField()),
                ('damage2', models.IntegerField()),
                ('damage3', models.IntegerField()),
                ('damage4', models.IntegerField()),
                ('status1', models.IntegerField()),
                ('status2', models.IntegerField()),
                ('status3', models.IntegerField()),
                ('status4', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='GameUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('screen_name', models.CharField(max_length=15)),
                ('high_score', models.IntegerField()),
                ('games_won', models.IntegerField()),
                ('games_lost', models.IntegerField()),
                ('games_draw', models.IntegerField()),
                ('damage_high', models.IntegerField()),
                ('damage_low', models.IntegerField()),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='GameActive',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('game_Name', models.CharField(max_length=15)),
                ('game_status', models.IntegerField()),
                ('score1', models.IntegerField()),
                ('score2', models.IntegerField()),
                ('score3', models.IntegerField()),
                ('score4', models.IntegerField()),
                ('damage1', models.IntegerField()),
                ('damage2', models.IntegerField()),
                ('damage3', models.IntegerField()),
                ('damage4', models.IntegerField()),
                ('status1', models.IntegerField()),
                ('status2', models.IntegerField()),
                ('status3', models.IntegerField()),
                ('status4', models.IntegerField()),
                ('gameuser_id1', models.OneToOneField(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='Player1', to='project_group_app.gameuser')),
                ('gameuser_id2', models.OneToOneField(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='Player2', to='project_group_app.gameuser')),
                ('gameuser_id3', models.OneToOneField(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='Player3', to='project_group_app.gameuser')),
                ('gameuser_id4', models.OneToOneField(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='Player4', to='project_group_app.gameuser')),
            ],
        ),
    ]
