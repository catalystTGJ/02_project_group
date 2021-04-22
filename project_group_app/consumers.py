import json
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
        request = text_data_json['request']


        #this is the default dictionary
        #for sending back a message to the channel
        msgdict = {
                'type': 'message',
                'message': request
            }

        # this will be where we develop the required actions
        # based on what we receive in the request variable.
        # the text_data_json is a dictionary, and can have
        # many key/values in it, but when making requests for
        # info, there won't be much need for a lot of them.

        # example:
        # if request = 'game_player_assignment':
            # call a function to perform work
            # to look up which players are in
            # which game slots
            # set up msgdict with the results

        # do work to check the status
        await self.channel_layer.group_send(
            self.group_name, msgdict)

    # Receive message from room group
    async def message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

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
        request = text_data_json['request']


        #this is the default dictionary
        #for sending back a message to the channel
        msgdict = {
                'type': 'message',
                'message': request
            }

        # this will be where we develop the required actions
        # based on what we receive in the request variable.
        # the text_data_json is a dictionary, and can have
        # many key/values in it, but when making requests for
        # info, there won't be much need for a lot of them.

        # example:
        # if request = 'game_player_assignment':
            # call a function to perform work
            # to look up which players are in
            # which game slots
            # set up msgdict with the results

        # do work to check the status
        await self.channel_layer.group_send(
            self.group_name, msgdict)

    # Receive message from room group
    async def message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

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
        request = text_data_json['request']


        #this is the default dictionary
        #for sending back a message to the channel
        msgdict = {
                'type': 'message',
                'message': request
            }

        # this will be where we develop the required actions
        # based on what we receive in the request variable.
        # the text_data_json is a dictionary, and can have
        # many key/values in it, but when making requests for
        # info, there won't be much need for a lot of them.

        # example:
        # if request = 'game_player_assignment':
            # call a function to perform work
            # to look up which players are in
            # which game slots
            # set up msgdict with the results

        # do work to check the status
        await self.channel_layer.group_send(
            self.group_name, msgdict)

    # Receive message from room group
    async def message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))