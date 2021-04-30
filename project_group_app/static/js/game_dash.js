// boolean to know when its safe to work with the DOM.
var html_ready = false;
// delay in milliseconds.
var msdelay = 250;
// counter to know how much time has gone by since execution.
var main_loop_cycle = 0;

function gamesplayersStats() {
    if (html_ready) {
        if (Math.trunc(main_loop_cycle/10) == main_loop_cycle/10) {

            var url = 'http://' + window.location.host + '/games-players-stats';
            const gamesplayersstatsRequest = new XMLHttpRequest();
            gamesplayersstatsRequest.open("GET", url, true);
            gamesplayersstatsRequest.send();

            gamesplayersstatsRequest.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const data_list = JSON.parse(this.responseText);
                    for (var game=0; game<4; game++) {
                        players_dict = data_list
                        for (var player=0; player<4; player++) {
                            player_dict = players_dict[game]['Game ' + (game+1)][player]
                            
                            if (player_dict.screen_name != "") {
                                data = player_dict.screen_name + ' : ' + player_dict.status + ' | ' + player_dict.score + ' | ' + player_dict.damage
                                document.getElementById("game-" + (game + 1) + "-player-" + (player + 1)).innerHTML = data;
                            } else {
                                document.getElementById("game-" + (game + 1) + "-player-" + (player + 1)).innerHTML = "";
                            }
                        }
                    }
                }
            }
        }
    }
}


// This is the main loop.
// When nothing else is happening.
// This is where to put things that should be updated on some frequency.
function mainLoop(){
    if (html_ready) {
        main_loop_cycle++;
        gamesplayersStats();
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
    current_user_id = document.getElementById("user-id").textContent
    screen_name = document.getElementById("user-screen-name").textContent;


    html_ready = true;
});

// this last line sets up the main loop to be repeated based on the delay provided.
window.setInterval(mainLoop,msdelay);