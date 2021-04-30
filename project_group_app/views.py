from django.shortcuts import HttpResponse, render, redirect
from django.contrib import messages
from django.db.models import Q

#needed for use of built-in django auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .models import GameUser, GameActive, GameAsset, GameField, populateAssets, populateGameActive, populateGameField, populateTestUsers, gamesplayers, gamesplayersData
import random
import json

# index will send to sign-in registration
def index(request):
    return redirect('/signin')

# sign-in registration will send to game selection
def signin(request):
    context = {}
    if request.method == 'POST':
        user = authenticate(username=request.POST['username'], password=request.POST['password'])
        if user is not None:
            login(request, user)
            return redirect('/game-pick')
    return render(request, 'signin.html', context)

# sign-off buttion will flush session
# it might be desirable to write some stuff for the user into the db, but i'm not sure we need this.
def signout(request):
    request.session.flush()
    return redirect('/')

# game selection will lead to game play
# notice there is a 'require login' decorator here to send back to sign-in registration.
@login_required(login_url='/signin')
def game_pick(request):
    user_id = request.session['_auth_user_id']
    context = {
        'user' : User.objects.get(id=user_id)
    }
    return render(request, "game_pick.html", context)

    # return HttpResponse(request.session.items())

# game_play will be where the game actually happens.
# notice there is a 'require login' decorator here to send back to sign-in registration.
@login_required(login_url='/signin')
def game_play(request):

    user_id = request.session['_auth_user_id']
    user = User.objects.get(id=user_id)
    gameuser = GameUser.objects.get(user=user)
    player = game_player_path(gameuser, action="path")
    game_num = player[4:5]
    print(f'test: {player}')

    context = {
        'game_user' : gameuser,
        'live_player' : player,
        'game_player1' : f'game{game_num}player1',
        'game_player2' : f'game{game_num}player2',
        'game_player3' : f'game{game_num}player3',
        'game_player4' : f'game{game_num}player4',
        'game_common' : f'game{game_num}common',
        'game_metrics' : 'gamemetrics'
    }
    return render(request, "game_play.html", context)

# game selection will lead to game play
# notice there is a 'require login' decorator here to send back to sign-in registration.
@login_required(login_url='/signin')
def game_dash(request):
    user_id = request.session['_auth_user_id']
    context = {
        'user' : User.objects.get(id=user_id)
    }
    return render(request, "game_dash.html", context)

# game rank will show the player metrics
# notice there is a 'require login' decorator here to send back to sign-in registration.
@login_required(login_url='/signin')
def game_rank(request):
    return render(request, "game_rank.html")

def games_players_request(request):
    print('games_players_request')
    list = gamesplayers()
    return HttpResponse(json.dumps(list))

def games_players_stats(request):
    list = gamesplayersData()
    return HttpResponse(json.dumps(list))

def game_player_update(request):
    result = "nope!"
    if request.method == "POST":
        json_items = json.load(request)
        game_number = json_items['g']
        player_number = int(json_items['p'])
        player_score = int(json_items['s'])
        player_damage = int(json_items['d'])
        player_status = int(json_items['z'])

        game = GameActive.objects.filter(game_name=f'Game {game_number}')
        if len(game) == 1:
            if player_number == 1:
                game[0].score1 = player_score,
                game[0].damage1 = player_damage,
                game[0].status1 = player_status
            if player_number == 2:
                game[0].score2 = player_score,
                game[0].damage2 = player_damage,
                game[0].status2 = player_status
            if player_number == 3:
                game[0].score3 = player_score,
                game[0].damage3 = player_damage,
                game[0].status3 = player_status
            if player_number == 4:
                game[0].score4 = player_score,
                game[0].damage4 = player_damage,
                game[0].status4 = player_status
            game[0].save()
        result= "done"

    return HttpResponse(json.dumps(result))

def game_player_path(game_user, action=''):
    path = ""

    game = GameActive.objects.filter(gameuser_id1=game_user)
    if len(game) == 1:
        if action == "path":
            path = f'game{game[0].game_name[-1]}player1'
        elif action == "clear":
            game[0].gameuser_id1 = None
            game[0].save()

    game = GameActive.objects.filter(gameuser_id2=game_user)
    if len(game) == 1:
        if action == "path":
            path = f'game{game[0].game_name[-1]}player2'
        elif action == "clear":
            game[0].gameuser_id2 = None
            game[0].save()

    game = GameActive.objects.filter(gameuser_id3=game_user)
    if len(game) == 1:
        if action == "path":
            path = f'game{game[0].game_name[-1]}player3'
        elif action == "clear":
            game[0].gameuser_id3 = None
            game[0].save()

    game = GameActive.objects.filter(gameuser_id4=game_user)
    if len(game) == 1:
        if action == "path":
            path = f'game{game[0].game_name[-1]}player4'
        elif action == "clear":
            game[0].gameuser_id4 = None
            game[0].save()

    return path

def game_player_select(request):
    result = "nope!"
    if request.method == "POST":
        json_items = json.load(request)
        game_number = json_items['game_number']
        game_name = f'Game {game_number}'
        player_number = int(json_items['player_number'])
        user_id = json_items['user_id']
        user = User.objects.get(id=user_id)
        game_user = GameUser.objects.get(user=user)

        game_player_path(game_user, action="clear")

        game = GameActive.objects.filter(game_name=game_name)
        if len(game) == 1:

            if player_number == 1 and game[0].gameuser_id1 is None:
                game[0].gameuser_id1 = game_user
                result = game[0].save()
            elif player_number == 2 and game[0].gameuser_id2 is None:
                game[0].gameuser_id2 = game_user
                result = game[0].save()
            elif player_number == 3 and game[0].gameuser_id3 is None:
                game[0].gameuser_id3 = game_user
                result = game[0].save()
            elif player_number == 4 and game[0].gameuser_id4 is None:
                game[0].gameuser_id4 = game_user
                result = game[0].save()

        result = game_player_path(game_user, action="path")

    return HttpResponse(json.dumps(result))

def games_players_clear(request):
    games = GameActive.objects.all()
    for game in games:
        game.gameuser_id1 = None
        game.gameuser_id2 = None
        game.gameuser_id3 = None
        game.gameuser_id4 = None
        game.save()
    return redirect (f'/games-players-request')

def game_field_generate(request, game_number):
    populateGameField(game_number)
    return redirect (f'/game-play')
    # return redirect (f'/game-field-request/{game_number}')

def game_field_request(request, game_number):

    game = GameActive.objects.filter(game_name=f'Game {game_number}')
    field_objects = GameField.objects.filter(gameactive=game[0])
    list = []
    for o in range(len(field_objects)):
        object_dict = {
            'k' : field_objects[o].gameasset.type,
            'f' : field_objects[o].gameasset.filename,
            'w' : field_objects[o].gameasset.width,
            'h' : field_objects[o].gameasset.height,
            'r' : field_objects[o].gameasset.resistance,
            'm' : field_objects[o].gameasset.max_damage,
            'p' : field_objects[o].gameasset.damage_pot,
            'n' : field_objects[o].html_name,
            'd' : 0,
            'x' : field_objects[o].x_coord,
            'y' : field_objects[o].y_coord,
            't' : field_objects[o].transform
        }
        list.append(object_dict)

    return HttpResponse(json.dumps(list))

def utility(request):
    #populateAssets()
    #populateGameActive()
    populateTestUsers()
    return redirect ("/game-pick")

def testpost(request):
    if request.method == "GET":
        return render(request, "utility.html")

    if request.method == "POST":
        stuff = json.load(request)
        print(stuff['game_number'])
        return HttpResponse("done")




# def game_chat(request):
#     context = {
#         'game_player1' : 'game1player1',
#         'game_player2' : 'game1player2',
#         'game_player3' : 'game1player3',
#         'game_player4' : 'game1player4',
#     }
#     return render(request, 'ZZ_games_chat.html', context)
