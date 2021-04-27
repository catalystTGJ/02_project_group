from .models import GameAsset
import json
import random

#from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer

#   from the routing.py (inside the project_group_app)

#   GameMetricsConsumer
#   GameCommonConsumer
#   GamePlayerConsumer

class GameMetricsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.name = self.scope['url_route']['kwargs']['game_metrics']
        self.group_name = 'group_%s' % self.name

        # Join room group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        n = text_data_json['n']
        if n.startswith('chat') or n.startswith('metrics') or n.startswith('status'):
            await self.channel_layer.group_send(
                self.group_name, {'type': 'message', 'message': text_data})

    # Receive message from room group
    async def message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps(message))


class GameCommonConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.name = self.scope['url_route']['kwargs']['game_common']
        self.group_name = 'group_%s' % self.name

        # Join room group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        n = text_data_json['n']
            
        if n.startswith('chat') or n.startswith('ball') or n.startswith('tank'):
            await self.channel_layer.group_send(
                self.group_name, {'type': 'message', 'message': text_data})

    # Receive message from room group
    async def message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps(message))


class GamePlayerConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.name = self.scope['url_route']['kwargs']['game_player']
        self.group_name = 'group_%s' % self.name

        # Join room group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        n = text_data_json['n']
        if n.startswith('chat') or n.startswith('ball') or n.startswith('tank'):
            await self.channel_layer.group_send(
                self.group_name, {'type': 'message', 'message': text_data})

    # Receive message from room group
    async def message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps(message))