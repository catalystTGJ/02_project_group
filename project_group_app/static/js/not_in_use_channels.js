<script>

        const roomName = JSON.parse(document.getElementById('room-name').textContent);

        const chatSocket = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/chat/'
            + roomName
            + '/'
        );

        const randomStuff = "random_stuff";

        const RandomSocket = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/work/'
            + randomStuff
            + '/'
        );

        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            document.querySelector('#chat-log').value += (data.message + '\n');
        };

        RandomSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            document.querySelector('#random-log').value += (data.message + '\n');
        };

        chatSocket.onclose = function(e) {
            console.error('Chat socket closed unexpectedly');
        };

        RandomSocket.onclose = function(e) {
            console.error('Random socket closed unexpectedly');
        };

        document.querySelector('#chat-message-input').focus();
        document.querySelector('#chat-message-input').onkeyup = function(e) {
            if (e.keyCode === 13) {  // enter, return
                document.querySelector('#chat-message-submit').click();
            }
        };

        document.querySelector('#chat-message-submit').onclick = function(e) {
            const messageInputDom = document.querySelector('#chat-message-input');
            const message = messageInputDom.value;
            chatSocket.send(JSON.stringify({
                'message': message
            }));
            messageInputDom.value = '';
        };

        function RandomMessage () {
            RandomSocket.send(JSON.stringify({
                'location' : 'Some text'
            }));
        }

        window.setInterval(RandomMessage,10000);

    </script>