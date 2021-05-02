// boolean to know when its safe to work with the DOM.
var html_ready = false;
// delay in milliseconds.
var msdelay = 25;
// counter to know how much time has gone by since execution.
var main_loop_cycle = 0;

var canvas = document.querySelector('battlefield-container');
var c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function Particle(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = -dy;
    this.radius = 5;
    this.color = color;
    this.timeToLive = 1;
    // this.mass = 0.2;

    this.update = function() {
    if (this.y + this.radius + this.dy > canvas.height) {
    this.dy = -this.dy;
    }

    if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius + this.dx < 0) {
    this.dx = -this.dx;
    }
    // this.dy += gravity * this.mass;
    this.x += this.dx;
    this.y += this.dy;
    this.draw();

    this.timeToLive -= 0.01;
    };

    this.draw = function() {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
        c.shadowColor = this.color;
        c.shadowBlur = 10;
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
        c.fillStyle = this.color;
        c.fill();

        c.closePath();

        c.restore();
    };
}

function Explosion(x, y, ) {
    this.particles = [];  
    this.rings = [];
    this.source = cannonball;

    this.init = function() {
    for (var i = 0; i < 10; i++) {

        var dx = (Math.random() * 6) - 3;
        var dy = (Math.random() * 6) - 3;

        // var hue = (255 / 5) * i;
        // var color = "hsl(" + hue + ", 100%, 50%)";
        var randomColorIndex = Math.floor(Math.random() * colors.length);
        var randomParticleColor = colors[randomColorIndex];


        this.particles.push(new Particle(x, y, dx, dy, 1, randomParticleColor));
    }

    // Create ring once explosion is instantiated
      // this.rings.push(new Ring(this.source, "blue"));
};

    this.init();

    this.update = function() {
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].update();

            // Remove particles from scene one time to live is up
            if (this.particles[i].timeToLive < 0) {
                this.particles.splice(i, 1);
            }
    }

    // Render rings
    for (var j = 0; j < this.rings.length; j++) {
        this.rings[j].update();

            // Remove rings from scene one time to live is up
            if (this.rings[j].timeToLive < 0) {
                this.rings.splice(i, 1);
            }
        }
    };
}

var gravity = 0.08;
var desiredAngle = 0;
var explosions, colors;

function initializeVariables() {
    explosions = [];
    colors = [
        // Red / Orange / White
        {
            particleColors: [
            "#bf0404",
            "#eba800",
            "#fff",
            ]
        }
    ];
}

initializeVariables();

var timer = 0;
var isIntroComplete = false;
var introTimer = 0;

function animate() {
    window.requestAnimationFrame(animate);

    c.fillStyle = "rgba(18, 18, 18, 0.2)";
    c.fillRect(0, 0, canvas.width, canvas.height);

    // Render explosions
    for (var j = 0; j < explosions.length; j++) {
        //Do something
        explosions[j].update();

        // Remove explosions from scene once all associated particles are removed
        if (explosions[j].particles.length <= 0) {
            explosions.splice(j, 1);
        }
    } 
}


explosions.push(new Explosion(500, 500)

// animate();






































// This is the main loop.
// When nothing else is happening.
// This is where to put things that should be updated on some frequency.
function mainLoop(){
    if (html_ready) {
        main_loop_cycle++;



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