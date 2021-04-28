// boolean to know when its safe to work with the DOM.
var html_ready = false;
// delay in milliseconds.
var msdelay = 25;
// counter to know how much time has gone by since execution.
var main_loop_cycle = 0;
// boolean to determine the state of the buttons.
var buttons_enabled = true;

function disableButtons() {
    if (html_ready && buttons_enabled){
        buttons_enabled = false;
        for (var game_index=1; game_index < 5; game_index++) {
            for (var player_index=1; player_index < 5; player_index++) {
                var result = document.getElementById("button-" + game_index + '-' + player_index).disabled;
                console.log(result)
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
        disableButtons();
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
 


    html_ready = true;
});

// this last line sets up the main loop to be repeated based on the delay provided.
window.setInterval(mainLoop,msdelay);