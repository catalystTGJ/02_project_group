from django.db import models
from django.contrib.auth.models import User

class  GameUserManager():
    def GameUserManager():
        # we'll want to validate the screen name to allow only a certain length, and perhaps only alphanumeric characters
        pass

#This is the expansion of the in-built auth user table.
#We will use this to hold relevant stats for the player
class GameUser(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    screen_name = models.CharField(max_length=15)
    high_score = models.IntegerField()
    games_won = models.IntegerField()
    games_lost = models.IntegerField()
    games_draw = models.IntegerField()
    damage_high = models.IntegerField()
    damage_low = models.IntegerField()
    object = GameUserManager()

# This will be the "4" games that are actively playing. There will never be more or less, and the rows of data,
# will be used over and over again. This is not a storage of a bunch of game history. It is only for the active game metrics.
class GameActive(models.Model):
    game_Name = models.CharField(max_length=15) # we may elect to create a name for a game, or not.
    game_status = models.IntegerField()
    gameuser_id1 = models.OneToOneField(GameUser, related_name='Player1', on_delete=models.DO_NOTHING, null=True) #(field must allow null)
    gameuser_id2 = models.OneToOneField(GameUser, related_name='Player2', on_delete=models.DO_NOTHING, null=True) #(field must allow null)
    gameuser_id3 = models.OneToOneField(GameUser, related_name='Player3', on_delete=models.DO_NOTHING, null=True) #(field must allow null)
    gameuser_id4 = models.OneToOneField(GameUser, related_name='Player4', on_delete=models.DO_NOTHING, null=True) #(field must allow null)
    score1 = models.IntegerField()
    score2 = models.IntegerField()
    score3 = models.IntegerField()
    score4 = models.IntegerField()
    damage1 = models.IntegerField()
    damage2 = models.IntegerField()
    damage3 = models.IntegerField()
    damage4 = models.IntegerField()
    status1 = models.IntegerField() #0 = cleared, 1 = lost, 2 = draw, 3 win
    status2 = models.IntegerField() #0 = cleared, 1 = lost, 2 = draw, 3 win
    status3 = models.IntegerField() #0 = cleared, 1 = lost, 2 = draw, 3 win
    status4 = models.IntegerField() #0 = cleared, 1 = lost, 2 = draw, 3 win

# We will avoid "relating" the GameHistory to the GameActive table, because the GameActive entries will be used
# over and over again for different games. They will not be destroyed/replaced.
class GameHistory(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    screenname1 = models.CharField(max_length=255) # a "screen name" field from GameUser (This way we don't have to fool with in-built)
    screenname2 = models.CharField(max_length=255) # a "screen name" field from GameUser
    screenname3 = models.CharField(max_length=255) # a "screen name" field from GameUser
    screenname4 = models.CharField(max_length=255) # a "screen name" field from GameUser
    score1 = models.IntegerField()
    score2 = models.IntegerField()
    score3 = models.IntegerField()
    score4 = models.IntegerField()
    damage1 = models.IntegerField()
    damage2 = models.IntegerField()
    damage3 = models.IntegerField()
    damage4 = models.IntegerField()
    status1 = models.IntegerField() #0 = cleared, 1 = lost, 2 = draw, 3 win
    status2 = models.IntegerField() #0 = cleared, 1 = lost, 2 = draw, 3 win
    status3 = models.IntegerField() #0 = cleared, 1 = lost, 2 = draw, 3 win
    status4 = models.IntegerField() #0 = cleared, 1 = lost, 2 = draw, 3 win

# Game assets will include, tanks, bullets, trees, other objects
class GameAsset(models.Model):
    type = models.CharField(max_length=50)
    filename = models.CharField(max_length=50) #file name may be a partial name, as we will have multiple filenames, serialized.
    width = models.IntegerField() # pixel width
    height = models.IntegerField() # pixel width
    resistance = models.IntegerField() # reisistance level of impact/treversal on another object. 100 may be the maximum.
    max_damage = models.IntegerField() # the max damage this object can endure.
    damage_pot = models.IntegerField() # the amount of damage that this object can inflict. this can be a negative value!

    # for any related tables where we might not care if the main info is deleted,
    # the following can be used to leave the data in the related class.
    # on_delete=models.DO_NOTHING)