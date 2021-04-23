from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class GameUser(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.OneToOneField(User, on_delete=models.DO_NOTHING)
    high_score #integer
    games_won #integer
    games_lost #integer
    games_draw #integer
    damage_high #integer
    damage_low #integer

class GamesActive(models.Model):
    pass #only 4 rows of data
    Game #range from 1 to 4
    Player1 #(field must allow null)
    Player2 #(field must allow null)
    Player3 #(field must allow null)
    Player4 #(field must allow null)
    Score1 #integer
    Score2 #integer
    Score3 #integer
    Score4 #integer
    Damage1 #integer
    Damage2 #integer
    Damage3 #integer
    Damage4 #integer
    Status1 #0 = cleared, 1 = lost, 2 = draw, 3 win
    Status2 #0 = cleared, 1 = lost, 2 = draw, 3 win
    Status3 #0 = cleared, 1 = lost, 2 = draw, 3 win
    Status4 #0 = cleared, 1 = lost, 2 = draw, 3 win

class GamesHistory(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    Game date
    Player1 #first name from in-built user field
    Player2 #first name from in-built user field
    Player3 #first name from in-built user field
    Player4 #first name from in-built user field

    # games one to many
    # GameUser one to many