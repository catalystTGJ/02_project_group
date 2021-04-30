from django.db import models
from django.contrib.auth.models import User
from django.db.models.fields.related import ForeignKey
import random

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
    game_name = models.CharField(max_length=15) # we may elect to create a name for a game, or not.
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

class GameField(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    gameactive = models.ForeignKey(GameActive, related_name='gamefield', on_delete=models.DO_NOTHING) #(field must allow null)
    gameasset = models.ForeignKey(GameAsset, related_name="gamefield", on_delete = models.CASCADE)
    html_name = models.CharField(max_length=50)
    damage = models.IntegerField()
    x_coord = models.IntegerField()
    y_coord = models.IntegerField()
    transform = models.IntegerField()

def gameplayerPath(game_user, action=''):
    result = ""

    game = GameActive.objects.filter(gameuser_id1=game_user)
    if len(game) == 1:
        result = f'game{game[0].game_name[-1]}player1'
        if action == "dict":
            result = {
                'path' : result,
                'name' : game[0].gameuser_id1.screen_name,
                'score' : game[0].score1,
                'damage' : game[0].damage1
            }
        elif action == "clear":
            game[0].gameuser_id1 = None
            game[0].status1 = 0
            game[0].score1 = 0
            game[0].damage1 = 0
            game[0].save()

    game = GameActive.objects.filter(gameuser_id2=game_user)
    if len(game) == 1:
        result = f'game{game[0].game_name[-1]}player2'
        if action == "dict":
            result = {
                'path' : result,
                'name' : game[0].gameuser_id2.screen_name,
                'score' : game[0].score2,
                'damage' : game[0].damage2
            }
        elif action == "clear":
            game[0].gameuser_id2 = None
            game[0].status2 = 0
            game[0].score2 = 0
            game[0].damage2 = 0
            game[0].save()

    game = GameActive.objects.filter(gameuser_id3=game_user)
    if len(game) == 1:
        result = f'game{game[0].game_name[-1]}player3'
        if action == "dict":
            result = {
                'path' : result,
                'name' : game[0].gameuser_id2.screen_name,
                'score' : game[0].score3,
                'damage' : game[0].damage3
            }
        elif action == "clear":
            game[0].gameuser_id3 = None
            game[0].status3 = 0
            game[0].score3 = 0
            game[0].damage3 = 0
            game[0].save()

    game = GameActive.objects.filter(gameuser_id4=game_user)
    if len(game) == 1:
        result = f'game{game[0].game_name[-1]}player4'
        if action == "dict":
            result = {
                'path' : result,
                'name' : game[0].gameuser_id4.screen_name,
                'score' : game[0].score4,
                'damage' : game[0].damage4
            }
        elif action == "clear":
            game[0].gameuser_id4 = None
            game[0].status4 = 0
            game[0].score4 = 0
            game[0].damage4 = 0
            game[0].save()

    return result


def gamesplayers(game="all"):
    if game == "all":
        games = GameActive.objects.all()
    else:
        games = GameActive.objects.filter(game_name=f'Game {game}')
    list = []
    for game in games:
        if game.gameuser_id1 is None:
            screen_name1 = ""
        else:
            screen_name1 = game.gameuser_id1.screen_name

        if game.gameuser_id2 is None:
            screen_name2 = ""
        else:
            screen_name2 = game.gameuser_id2.screen_name

        if game.gameuser_id3 is None:
            screen_name3 = ""
        else:
            screen_name3 = game.gameuser_id3.screen_name

        if game.gameuser_id4 is None:
            screen_name4 = ""
        else:
            screen_name4 = game.gameuser_id4.screen_name
        list.append(
            {
                '1' : screen_name1,
                '2' : screen_name2,
                '3' : screen_name3,
                '4' : screen_name4
            }
        )

    return list

def gamesplayersData():
    games_list = []
    games = GameActive.objects.all()
    for game in games:

        if game.gameuser_id1 is None:
            gameuser_id1 = ""
            screen_name1 = ""
        else:
            gameuser_id1 = game.gameuser_id1.id
            screen_name1 = game.gameuser_id1.screen_name

        if game.gameuser_id2 is None:
            gameuser_id2 = ""
            screen_name2 = ""
        else:
            gameuser_id2 = game.gameuser_id2.id
            screen_name2 = game.gameuser_id2.screen_name

        if game.gameuser_id3 is None:
            gameuser_id3 = ""
            screen_name3 = ""
        else:
            gameuser_id3 = game.gameuser_id3.id
            screen_name3 = game.gameuser_id3.screen_name

        if game.gameuser_id4 is None:
            gameuser_id4 = ""
            screen_name4 = ""
        else:
            gameuser_id4 = game.gameuser_id4.id
            screen_name4 = game.gameuser_id4.screen_name

        games_list.append({game.game_name : [{
            'gameuser_id' : gameuser_id1,
            'screen_name' : screen_name1,
            'score' : game.score1,
            'damage' : game.damage1,
            'status' : game.status1
            },{
            'gameuser_id' : gameuser_id2,
            'screen_name' : screen_name2,
            'score' : game.score2,
            'damage' : game.damage2,
            'status' : game.status2
            },{
            'gameuser_id' : gameuser_id3,
            'screen_name' : screen_name3,
            'score' : game.score3,
            'damage' : game.damage3,
            'status' : game.status3
            },{
            'gameuser_id' : gameuser_id4,
            'screen_name' : screen_name4,
            'score' : game.score4,
            'damage' : game.damage4,
            'status' : game.status4
            }]})

    return games_list


def populateTestUsers():
    # create test user accounts if they are needed
    user_list = ['testplayer1','testplayer2','testplayer3','testplayer4','testplayer5','testplayer6','testplayer7','testplayer8']
    user_pass = 'djangoFun'
    user_email = 'real@nope.not'
    for user_item in user_list:
        users = User.objects.filter(username=user_item)
        if len(users) == 0:
            user = User.objects.create_user(user_item, user_email, user_pass)
        else:
            user = users[0]
        game_users  = GameUser.objects.filter(user=user)
        if len(game_users) == 0:
            game_user = GameUser.objects.create(
                user=user,
                screen_name = user_item,
                high_score = 0,
                games_won = 0,
                games_lost = 0,
                games_draw = 0,
                damage_high = 0,
                damage_low = 0
                )
        else:
            game_user = game_users[0]

def populateAssets():
    # clear GameAsset table first, so that we can easily repopulate the table whenever we tweak anything.
    objects = GameAsset.objects.all()
    objects.delete()

    trees = []
    trees.append(['tree_01', 68, 68, 65, 3500, 4])
    trees.append(['tree_02', 44, 42, 40, 2000, 2])
    trees.append(['tree_03', 68, 68, 65, 3500, 4])
    trees.append(['tree_04', 68, 68, 65, 3500, 4])
    trees.append(['tree_05', 54, 54, 55, 2600, 3])
    trees.append(['tree_06', 46, 48, 40, 2200, 2])
    trees.append(['tree_07', 56, 58, 55, 2800, 3])
    trees.append(['tree_08', 50, 52, 50, 2500, 3])
    trees.append(['tree_09', 40, 40, 40, 1800, 2])
    trees.append(['tree_10', 66, 66, 65, 3400, 4])
    trees.append(['tree_11', 47, 52, 50, 2400, 2])
    trees.append(['tree_12', 46, 48, 50, 2400, 3])
    trees.append(['tree_13', 32, 32, 30, 1600, 1])
    trees.append(['tree_14', 46, 44, 40, 2200, 2])
    trees.append(['tree_15', 66, 66, 65, 3400, 4])
    trees.append(['tree_16', 48, 46, 50, 2400, 2])
    trees.append(['tree_17', 54, 58, 55, 2500, 3])
    trees.append(['tree_18', 70, 64, 70, 3800, 5])
    trees.append(['tree_19', 56, 60, 55, 2700, 3])
    trees.append(['tree_20', 52, 54, 50, 2500, 3])
    trees.append(['tree_38', 110, 120, 90, 5500, 5])
    trees.append(['tree_39', 106, 120, 90, 5500, 5])
    trees.append(['tree_40', 67, 65, 65, 3200, 4])
    trees.append(['tree_41', 82, 76, 80, 4400, 5])
    trees.append(['tree_42', 78, 76, 75, 3800, 4])
    trees.append(['tree_43', 84, 82, 80, 4400, 5])
    trees.append(['tree_44', 110, 112, 90, 5500, 5])
    trees.append(['tree_46', 76, 90, 75, 3800, 4])
    trees.append(['tree_47', 60, 56, 60, 3000, 3])
    trees.append(['tree_48', 60, 56, 60, 3000, 3])
    trees.append(['tree_49', 60, 56, 60, 3000, 3])
    trees.append(['tree_50', 70, 76, 70, 3400, 4])
    trees.append(['tree_51', 86, 78, 80, 4200, 4])
    trees.append(['tree_52', 68, 68, 65, 3400, 3])
    trees.append(['tree_53', 94, 98, 85, 4600, 5])
    trees.append(['tree_54', 94, 90, 85, 4600, 5])
    trees.append(['tree_55', 76, 82, 75, 3800, 4])

    for i in range(len(trees)):
        obj = GameAsset.objects.create(
            type = 'trees',
            filename = trees[i][0],
            width = trees[i][1],
            height = trees[i][2],
            resistance = trees[i][3],
            max_damage = trees[i][4],
            damage_pot = trees[i][5]
        )

    objects = []
    objects.append(['object_01', 66, 31, 15, 1000, 1]) # sand bags
    objects.append(['object_02', 150, 71, 20, 1500, 2]) # sand bags (arch)
    objects.append(['object_03', 27, 27, 15, 500, 10]) # barrel (top)
    objects.append(['object_04', 35, 26, 20, 500, 10]) # barrel (side)
    objects.append(['object_05', 60, 48, 20, 500, 10]) # barrels
    objects.append(['object_06', 77, 38, 40, 2500, 50]) # jeep
    objects.append(['object_07', 70, 85, 30, 1500, 38]) # lookout tower
    objects.append(['object_08', 43, 41, 90, 50000, 60]) # rock
    objects.append(['object_09', 144, 124, 95, 100000, 75]) # big rock
    objects.append(['object_10', 95, 69, 95, 75000, 75]) # rocks
    objects.append(['object_11', 144, 119, 95, 150000, 75]) # big rocks
    objects.append(['object_12', 193, 46, 75, 1000, 5]) # bricks
    objects.append(['object_13', 192, 188, 100, 250000, 85]) # large rock with trees
    objects.append(['object_14', 240, 149, 100, 250000, 85]) # large rocks with trees
    objects.append(['object_15', 317, 265, 70, 500000, 3]) # swamp hole
    objects.append(['object_16', 144, 78, 65, 500000, 2]) # swamp gator

    for i in range(len(objects)):
        obj = GameAsset.objects.create(
            type = 'objects',
            filename = objects[i][0],
            width = objects[i][1],
            height = objects[i][2],
            resistance = objects[i][3],
            max_damage = objects[i][4],
            damage_pot = objects[i][5]
        )

def populateGameActive():

    # delete existing gameactive slots
    games = GameActive.objects.all()
    games.delete()

    # create the 4 gameactive slots based on names: 'Game 1' - 'Game 4'
    for i in range(1,5):
        Game = GameActive.objects.create(
            game_name = f'Game {i}',
            game_status = 0,
            score1 = 0,
            score2 = 0,
            score3 = 0,
            score4 = 0,
            damage1 = 0,
            damage2 = 0,
            damage3 = 0,
            damage4 = 0,
            status1 = 0,
            status2 = 0,
            status3 = 0,
            status4 = 0
        )

def populateGameField(game_number):
    
    # clear existing field objects for a the specific game
    game = GameActive.objects.filter(game_name=f'Game {game_number}')
    field_objects = GameField.objects.filter(gameactive=game[0])
    field_objects.delete()

    # preloaded with the corners to reserve for the tanks
    used_space = [
        {'xl' : 0, 'xr' : 160, 'yt' : 0, 'yb' : 160},
        {'xl' : 0, 'xr' : 160, 'yt' : 540, 'yb' : 700},
        {'xl' : 1240, 'xr' : 1400, 'yt' : 0, 'yb' : 160},
        {'xl' : 1240, 'xr' : 1400, 'yt' : 540, 'yb' : 700},
    ]

    # populates other items
    objects = GameAsset.objects.filter(type='objects')
    for t in range(random.randint(7, 15)):
            
        objects_index = random.randint(0, len(objects)-1)
        w = objects[objects_index].width
        h = objects[objects_index].height
        while True:
            rx = random.randint(1, 1400 - objects[objects_index].width)
            ry = random.randint(1, 700 - objects[objects_index].height)
            rt = random.randint(0, 359)

            free_space = True
            for u in used_space:
                inside = 0
                if rx > u['xl'] and rx < u['xr']:
                    inside+=.5
                elif (rx + w) > u['xl'] and (rx + w) < u['xr']:
                    inside+=.5

                if ry > u['yt'] and ry < u['yb']:
                    inside+=.5
                elif (ry + h) > u['yt'] and (ry + h) < u['yb']:
                    inside+=.5

                if inside > .5:
                    free_space = False
                    break
            if free_space:
                used_space.append({'xl' : rx, 'xr' : rx+w, 'yt' : ry, 'yb' : ry+h})
                break

        new_item = GameField.objects.create(
            gameactive = game[0],
            gameasset = objects[objects_index],
            html_name = f'object{t}',
            damage = 0,
            x_coord = rx,
            y_coord = ry,
            transform = rt
        )

    # populates the trees
    objects = GameAsset.objects.filter(type='trees')
    for t in range(random.randint(20, 70)):
        
        objects_index = random.randint(0, len(objects)-1)
        w = objects[objects_index].width
        h = objects[objects_index].height
        while True:
            rx = random.randint(1, 1400 - objects[objects_index].width)
            ry = random.randint(1, 700 - objects[objects_index].height)
            rt = random.randint(0, 359)

            free_space = True
            for u in used_space:
                inside = 0
                if rx > u['xl'] and rx < u['xr']:
                    inside+=.5
                elif (rx + w) > u['xl'] and (rx + w) < u['xr']:
                    inside+=.5

                if ry > u['yt'] and ry < u['yb']:
                    inside+=.5
                elif (ry + h) > u['yt'] and (ry + h) < u['yb']:
                    inside+=.5

                if inside > .5:
                    free_space = False
                    break
            if free_space:
                used_space.append({'xl' : rx, 'xr' : rx+w, 'yt' : ry, 'yb' : ry+h})
                break

        new_item = GameField.objects.create(
            gameactive = game[0],
            gameasset = objects[objects_index],
            html_name = f'tree{t}',
            damage = 0,
            x_coord = rx,
            y_coord = ry,
            transform = rt
        )
