from django.urls import include, path
from . import views

urlpatterns = [
    path('', views.index),
    path('signin', views.signin),
    path('signoff', views.signoff),
    path('game-pick', views.game_pick),
    path('game-dash', views.game_dash),
    path('game-play', views.game_play),
    path('game-rank', views.game_rank),
    path('game-chat', views.game_chat)
    # path('game-player-pick', views.game_player_pick),
    # path('game-chat/<str:game_player>/', views.game_chat)
]
