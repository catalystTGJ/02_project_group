from django.shortcuts import HttpResponse, render, redirect
from django.contrib import messages

#needed for use of built-in django auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .models import GameUser, GameActive, GameAsset, GameField, populateAssets, populateGameActive, populateGameField, populateTestUsers
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
def game_play(request, player="game1player1"):
    context = {
        'live_player' : player,
        'game_common' : 'game1common',
        'game_metrics' : 'gamemetrics',
        'game_player1' : 'game1player1',
        'game_player2' : 'game1player2',
        'game_player3' : 'game1player3',
        'game_player4' : 'game1player4',
    }
    return render(request, "game_play.html", context)

# game selection will lead to game play
# notice there is a 'require login' decorator here to send back to sign-in registration.
@login_required(login_url='/signin')
def game_dash(request):
    return render(request, "game_dash.html")

# game rank will show the player metrics
# notice there is a 'require login' decorator here to send back to sign-in registration.
@login_required(login_url='/signin')
def game_rank(request):
    return render(request, "game_rank.html")

# chat/views.py

# def game_player_pick(request):
#     context = {'games' : ['game1player1','game1player2','game1player3','game1player4']}
#     return render(request, 'ZZ_games_player.html', context)

def game_chat(request):
    context = {
        'game_player1' : 'game1player1',
        'game_player2' : 'game1player2',
        'game_player3' : 'game1player3',
        'game_player4' : 'game1player4',
    }
    return render(request, 'ZZ_games_chat.html', context)

def utility(request):
    #populateAssets()
    #populateGameActive()
    populateTestUsers()
    return redirect ("/game-pick")

def game_field_generate(request, game_number):
    populateGameField(game_number)
    return redirect (f'/game-play/game1player2')
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