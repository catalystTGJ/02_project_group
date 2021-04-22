# routing.py
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/gm/(?P<game_metrics>\w+)/$', consumers.GameMetricsConsumer.as_asgi()), # there will be only one of theis channel
    re_path(r'ws/gc/(?P<game_common>\w+)/$', consumers.GameCommonConsumer.as_asgi()), # there will be one of these per game (4 x game)
    re_path(r'ws/gp/(?P<game_player>\w+)/$', consumers.GamePlayerConsumer.as_asgi()), # there may be as many as four of these per game. (4 x game x players)
]