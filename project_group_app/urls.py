from django.urls import include, path
from . import views

urlpatterns = [
    path('', views.index),
    path('signin', views.signin),
    path('signout', views.signout),
    path('game-pick', views.game_pick),
    path('game-dash', views.game_dash),
    path('game-play', views.game_play),
    path('game-play/<str:player>', views.game_play),
    path('game-rank', views.game_rank),
    path('games-players-clear', views.games_players_clear),
    path('game-player-select', views.game_player_select),
    path('game-player-update', views.game_player_update),
    path('games-players-request', views.games_players_request),
    path('games-players-stats', views.games_players_stats),
    path('utility', views.utility),
    path('game-field-generate/<int:game_number>', views.game_field_generate),
    path('game-field-request/<int:game_number>', views.game_field_request),
    path('testpost', views.testpost),
]
