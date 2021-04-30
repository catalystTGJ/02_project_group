// boolean to know when its safe to work with the DOM.
var html_ready = false;
// boolean to know when its time to launch the game.
var launch_ready = false;
// delay in milliseconds.
var msdelay = 25;
// initial value for how often to check for player changes
var gamesplayers_cycles = 10;
// counter to know how much time has gone by since execution.
var loop_cycles = 0;
// boolean to determine the state of the buttons.

var buttons_enabled = true;

var game_num = ""
var player_num = ""
var game_player = ""

function disableButtons() {
    if (html_ready && buttons_enabled){
        buttons_enabled = false;
        for (var game_index=1; game_index < 5; game_index++) {
            for (var player_index=1; player_index < 5; player_index++) {
                var result = document.getElementById("button-" + game_index + '-' + player_index).disabled = true;
                console.log(result)
            }
        }
    }
}

function gamesplayersCheck() {
    if (html_ready) {
        if (loopcycleCheck(gamesplayers_cycles)) {

            var url = 'http://' + window.location.host + '/games-players-request';
            const gamesplayersRequest = new XMLHttpRequest();
            gamesplayersRequest.open("GET", url, true);
            gamesplayersRequest.send();

            gamesplayersRequest.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const data_list = JSON.parse(this.responseText);
                    for (var i=0; i<4; i++) {
                        var selected_players = 0;
                        for (var player=1; player<5; player++) {
                            if (data_list[i][player] != "") {
                                document.getElementById("button-" + (i + 1) + '-' + player).innerHTML = data_list[i][player];
                                document.getElementById("button-" + (i + 1) + '-' + player).disabled = true;

                                selected_players++;
                                console.log((i+1) + " " + selected_players)
                                if (selected_players==4 && game_player.charAt(5)==(i+1)) {
                                    if (!launch_ready) {
                                        disableButtons();
                                        launch_ready = true;
                                        launch_countdown = 10;
                                        if (game_player.charAt(12)==1) {launch_countdown-=2;}
                                    }
                                }

                            } else {
                                document.getElementById("button-" + (i + 1) + '-' + player).innerHTML = 'Player ' + [player];
                                document.getElementById("button-" + (i + 1) + '-' + player).disabled = false;
                            }
                        }
                    }
                    gamesplayers_cycles = 120
                }
            }
        }
    }
}

function launchmessage() {
    if (launch_ready) {
        document.getElementById("launch-ready").innerHTML = "Game will launch in: " + launch_countdown + " Seconds"
    } else {
        document.getElementById("launch-ready").innerHTML = "Select a Game/Player button"
    }
}

function launchgame() {
    if (launch_ready) {
        if (loopcycleCheck(40)) {
            launchmessage()
            launch_countdown--;
            if (launch_countdown < 0) {
                if (game_player.charAt(12) == "1") {
                    window.location.pathname = '/game-field-generate/' + game_player.charAt(5);
                } else {
                    window.location.pathname = '/game-play';
                }
            }
        }
    }
}

function gameplayerselect() {
    if (html_ready) {
        var gamesplayerPost = new XMLHttpRequest();
        gamesplayerPost.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                game_player = this.responseText
                console.log(game_player)
            }
        };
        gamesplayerPost.open("POST", "/game-player-select", true);
        gamesplayerPost.setRequestHeader('X-CSRFToken', csrf_token);
        gamesplayerPost.send(JSON.stringify({game_number : game_num, player_number : player_num, user_id : current_user_id}));
    }
}

function loopcycleCheck(value) {
    return (Math.trunc(loop_cycles/value) == loop_cycles/value) ? true : false
}

// This is the main loop.
// When nothing else is happening.
// This is where to put things that should be updated on some frequency.
function mainLoop(){
    if (html_ready) {
        loop_cycles++;
        gamesplayersCheck();
        launchgame();
        // disableButtons();
    }
}

//triggered when keys are held down (pressed but not necessarily released).
document.onkeydown = function(e){
    if (html_ready) {


    }
}

//triggered when keys have been released.
document.onkeyup = function(e){
    if (html_ready) {

    }
}

// This block of code will execute when the HTML DOM has finished loading.
// These steps need to happen at a "global" level, so that the information
// is available throughout the code, including the various functions.
// the very last step in this section will set a boolean variable,
// that will allow all the asyncronous sections of the code to do work.
window.addEventListener("load", function() {

    csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value;
    current_user_id = document.getElementById("user-id").textContent
    screen_name = document.getElementById("user-screen-name").textContent;


    let btns = document.querySelectorAll('button');
    for (a_button of btns) {
        a_button.addEventListener('click', function() {
            if (this.id.startsWith("button")) {
                game_num = this.id.substring(7,8)
                player_num = this.id.substring(9,10)
                gameplayerselect();
            }
            if (this.id.startsWith("confirm")) {
                if (game_player != "") {
                    launchgame()
                }
            }
        });
    }

    html_ready = true;
});

// this last line sets up the main loop to be repeated based on the delay provided.
window.setInterval(mainLoop,msdelay);