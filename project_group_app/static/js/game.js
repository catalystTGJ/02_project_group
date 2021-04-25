var html_ready = false;

var live_player = ""
var live_number = "0"
var ball_index = 0

var bullet_image = '/static/images/bullets/bullet_1.png'
var turret_image = '/static/images/tanks/tank_01_turret_1.png'
var chassis_image = '/static/images/tanks/tank_01_chassis_1.png'

var turret_image_prefix = '/static/images/tanks/tank_01_turret_'
var chassis_image_prefix = '/static/images/tanks/tank_01_chassis_'

//determine window size - this is not currently in use
var ww = window.innerWidth;
var wh = window.innerHeight;

//delay between updates
var msdelay = 25;
// scale of the tanks/objects
var scale = .2;
// maximum rotation amount for chassis and turret
var max_rot = 3;

// ballistic list
var ball_list = [];

var tank = {
    // 428 is the pixel length of the tank chassis image
    w_chassis : Math.round(428 * scale),
    // 280 is the pixel width of the tank chassis image
    h_chassis : Math.round(280 * scale),
    // 501 is the pixel length of the tank turret image
    w_turret : Math.round(501 * scale),
    // 153 is the pixel width of the tank turret image
    h_turret : Math.round(153 * scale),
    // 64 pixels is the offset of the tank turret from the tank chassis from top edge
    top_off : Math.round(64 * scale),
    // 172 pixels is the offset of the tank chassis from the tank turret from left edge
    left_off : Math.round(172 * scale),
    // tank's x center line
    x_center : Math.round(308 * scale),
    // tank's y center line
    y_center : Math.round(84 * scale),
    //approximate half across distance of a tank
    half : (180 * scale),
    // 47.5% is the appropriate axis for the tank chassis image
    to_chassis : 47.5,
    // 75% is the appropriate axis for the tank turret image
    to_turret : 75
}

//k is "kind"
//n is which tank 1 - 4
//c is not in use
//x and y are the cooridinate values of the tank on the field
//color is the hue degree for tank
//t_c is the transform degrees for chassis
//t_t is the transform degrees for turret
//r_c is the rotation amount for chassis
//r_t is the rotation amount for turret
//s is the speed for chassis
//runrise is a dictionary of x,y cooridinate values for run/rise

var tank1 = {
    k : 'tank',
    n : 'tank1',
    c : 0,
    x : 0,
    y : 0,
    color : 0,
    h : 0,
    d : 0,
    t_c : 225,
    t_t : 225,
    r_c : 0,
    r_t : 0,
    s : 0,
    runrise : {'x' : 0, 'y' : 0}
}

var tank2 = {
    k : 'tank',
    n : 'tank2',
    c: 0,
    x: 1800,
    y: 0,
    color: 90,
    h: 0,
    d: 0,
    t_c: 315,
    t_t: 315,
    r_c: 0,
    r_t: 0,
    s: 0,
    runrise: {'x' : 0, 'y' : 0}
}

var tank3 = {
    k : 'tank',
    n : 'tank3',
    c: 0,
    x: 0,
    y: 1800,
    color: 150,
    h: 0,
    d: 0,
    t_c: 135,
    t_t: 135,
    r_c: 0,
    r_t: 0,
    s: 0,
    runrise: {'x' : 0, 'y' : 0}
}

var tank4 = {
    k : 'tank',
    n : 'tank4',
    c: 0,
    x: 1800,
    y: 1800,
    color: 200,
    h: 0,
    d: 0,
    t_c: 45,
    t_t: 45,
    r_c: 0,
    r_t: 0,
    s: 0,
    runrise: {'x' : 0, 'y' : 0}
}

function existsElement(element_id) {
    //Attempt to get the element using document.getElementById
    var element = document.getElementById(element_id);
    return ((typeof(element) != 'undefined' && element != null) ? true : false);
}

function createElement(element_id, parent_id, tag) {
    var node = document.createElement(tag);
    node.id = element_id
    return document.getElementById(parent_id).appendChild(node);
}

function destroyElement(element_id) {
    return document.getElementById(element_id).remove()
}

function checkCreateTanks() {

    if (!existsElement('tank1_chassis_container')) {
        if (createElement('tank1_chassis_container', 'tank_overlay', 'div')) {
            (createElement('tank1_chassis', 'tank1_chassis_container', 'img'))
        }
    }

    if (!existsElement('tank1_turret_container')) {
        if (createElement('tank1_turret_container', 'tank_overlay', 'div')) {
            (createElement('tank1_turret', 'tank1_turret_container', 'img'))
        }
    }

    if (!existsElement('tank2_chassis_container')) {
        if (createElement('tank2_chassis_container', 'tank_overlay', 'div')) {
            (createElement('tank2_chassis', 'tank2_chassis_container', 'img'))
        }
    }

    if (!existsElement('tank2_turret_container')) {
        if (createElement('tank2_turret_container', 'tank_overlay', 'div')) {
            (createElement('tank2_turret', 'tank2_turret_container', 'img'))
        }
    }

    if (!existsElement('tank3_chassis_container')) {
        if (createElement('tank3_chassis_container', 'tank_overlay', 'div')) {
            (createElement('tank3_chassis', 'tank3_chassis_container', 'img'))
        }
    }

    if (!existsElement('tank3_turret_container')) {
        if (createElement('tank3_turret_container', 'tank_overlay', 'div')) {
            (createElement('tank3_turret', 'tank3_turret_container', 'img'))
        }
    }

    if (!existsElement('tank4_chassis_container')) {
        if (createElement('tank4_chassis_container', 'tank_overlay', 'div')) {
            (createElement('tank4_chassis', 'tank4_chassis_container', 'img'))
        }
    }

    if (!existsElement('tank4_turret_container')) {
        if (createElement('tank4_turret_container', 'tank_overlay', 'div')) {
            (createElement('tank4_turret', 'tank4_turret_container', 'img'))
        }
    }

}

function degreestoRunRise(degrees) {

    if (degrees == 0) { //when 0 - pointing left, no rise
        x = -1;
        y = 0;
    } else if (degrees == 90) { //when 90, pointing up, no run
        x = 0;
        y = -1;
    } else if (degrees == 180) { //when 180, pointing right, no rise
        x = 1;
        y = 0;
    } else if (degrees == 270) { //when 270, poiting down, no run
        x = 0;
        y = 1;
    } else if (degrees < 90 || degrees > 270) { //when the two left quadrants
        x = -1;
        y = Math.tan(degrees/180*Math.PI) * -1;
    } else { //when the two right quadrants
        x = 1;
        y = Math.tan(degrees/180*Math.PI);
    }

    // if y is too large, it could exaggerate movement
    // normalizing y to be 1 or -1,
    // then porportionally down factoring X
    // a mathmatician would likely laugh at this!
    if (y > 1 || y < -1) {
        x = x / Math.abs(y);
        y = y / Math.abs(y);
    }
    return {'x' : x, 'y' : y}
}

function collisionCheck(x, y, xy_half, check, check_half, x_center, y_center) {
    // initialize a counter
    var collision = 0;
    var check_x_left = check.x + x_center - check_half;
    var check_x_right = check.x + x_center + check_half;
    var check_y_top = check.y + y_center - check_half;
    var check_y_bottom = check.y + y_center + check_half;
    // collision from left or right
    if (x + xy_half > check_x_left && x + xy_half < check_x_right) {
        collision+=.5;
    } else if (x - xy_half > check_x_left && x - xy_half < check_x_right) {
        collision+=.5;
    }
    // collision from above or beneath
    if (y + xy_half > check_y_top && y + xy_half < check_y_bottom) {
        collision+=.5;
    } else if (y - xy_half > check_y_top && y - xy_half < check_y_bottom) {
        collision+=.5;
    }
    //return 1 when enough collision conditions have been met.
    // if (collision == 1 && xy_half == 5) {console.log('happened: ' + collision)}
    return ((collision >= 1) ? 1 : 0);
}

function updateTank(tank_dict, local) {

    if (local) {
        // when turret rotation occurs
        if (tank_dict.r_t != 0) {
            tank_dict.t_t = tank_dict.t_t + tank_dict.r_t;
            if (tank_dict.t_t >= 360) {tank_dict.t_t -= 360};
            if (tank_dict.t_t < 0) {tank_dict.t_t += 360};
            tank_dict.e = true;
        }

        // when chassis rotation occurs
        if (tank_dict.r_c != 0) {
            tank_dict.t_c = tank_dict.t_c + tank_dict.r_c;
            if (tank_dict.t_c >= 360) {tank_dict.t_c -= 360};
            if (tank_dict.t_c < 0) {tank_dict.t_c += 360};
            tank_dict.e = true;
        }

        //calculate run rise, as it must exist in order for initial motion
        tank_dict.runrise = degreestoRunRise(tank_dict.t_c);

        // when chassis drive occurs
        if (tank_dict.s != 0) {
            tank_dict.e = true;
            var new_x = tank_dict.x + tank_dict.s * tank_dict.runrise.x;
            var new_y = tank_dict.y + tank_dict.s * tank_dict.runrise.y;
            var adj_x = new_x + tank.x_center;
            var adj_y = new_y + tank.y_center;
            var collisions = 0;
            if (tank_dict.n != tank1.n) {collisions += collisionCheck(adj_x , adj_y, tank.half, tank1, tank.half, tank.x_center, tank.y_center)};
            if (tank_dict.n != tank2.n) {collisions += collisionCheck(adj_x , adj_y, tank.half, tank2, tank.half, tank.x_center, tank.y_center)};
            if (tank_dict.n != tank3.n) {collisions += collisionCheck(adj_x , adj_y, tank.half, tank3, tank.half, tank.x_center, tank.y_center)};
            if (tank_dict.n != tank4.n) {collisions += collisionCheck(adj_x , adj_y, tank.half, tank4, tank.half, tank.x_center, tank.y_center)};

            if (collisions == 0) {
                tank_dict.x = new_x;
                tank_dict.y = new_y;
            } else {
                tank_dict.d+=5;
            }
        }
    }

    // get battlefield size
    var bfw = document.getElementById('battlefield_container').getAttribute("width");
    var bfh = document.getElementById('battlefield_container').getAttribute("height");
    //ensure tank can't leave battlefield boundry
    if (tank_dict.x > bfw - 10) {tank_dict.x = bfw - 10};
    if (tank_dict.x < 10) {tank_dict.x = 10};
    if (tank_dict.y > bfh - 10) {tank_dict.y = bfh - 10};
    if (tank_dict.y < 60) {tank_dict.y = 60};

    tank_image_index = 1 + Math.trunc(tank_dict.d/100)
    //update chassis
    document.getElementById(tank_dict.n + '_chassis').width = tank.w_chassis; //remove tank_dict.t
    document.getElementById(tank_dict.n + '_chassis').height = tank.h_chassis; //remove tank_dict.t

    document.getElementById(tank_dict.n + '_chassis').src = chassis_image_prefix + tank_image_index + '.png';

    document.getElementById(tank_dict.n + '_chassis_container').style.position = "absolute";
    document.getElementById(tank_dict.n + '_chassis_container').style.top = tank_dict.y + 'px';
    document.getElementById(tank_dict.n + '_chassis_container').style.left = tank_dict.x + tank.left_off + 'px'; //removed tank_dict.t
    document.getElementById(tank_dict.n + '_chassis_container').style.transform = 'rotate(' + tank_dict.t_c + 'deg)';
    document.getElementById(tank_dict.n + '_chassis_container').style.transformOrigin = tank.to_chassis + "%"; //removed tank_dict.t
    document.getElementById(tank_dict.n + '_chassis_container').style.filter = 'hue-rotate(' + tank_dict.color + 'deg)';  // invert(' + tank_dict.d / 5000 + ')';

    //update turret
    document.getElementById(tank_dict.n + '_turret').width = tank.w_turret; //removed tank_dict.t
    document.getElementById(tank_dict.n + '_turret').height = tank.h_turret; //removed tank_dict.t

    document.getElementById(tank_dict.n + '_turret').src = turret_image_prefix + tank_image_index + '.png';

    document.getElementById(tank_dict.n + '_turret_container').style.position = "absolute";
    document.getElementById(tank_dict.n + '_turret_container').style.top = tank_dict.y + tank.top_off + 'px'; //removed tank_dict.t
    document.getElementById(tank_dict.n + '_turret_container').style.left = tank_dict.x + 'px';
    document.getElementById(tank_dict.n + '_turret_container').style.transform = 'rotate(' + tank_dict.t_t + 'deg)';
    document.getElementById(tank_dict.n + '_turret_container').style.transformOrigin = tank.to_turret + "%"; //removed tank_dict.t
    document.getElementById(tank_dict.n + '_turret_container').style.filter = 'hue-rotate(' + (tank_dict.color + tank_dict.h) + 'deg)';

    //update tank data overlay
    document.getElementById(tank_dict.n + '_data').style.position = "absolute";
    document.getElementById(tank_dict.n + '_data').width = 500;
    document.getElementById(tank_dict.n + '_data').height = 50;
    document.getElementById(tank_dict.n + '_data').style.top = Math.trunc(tank_dict.y + 60) + 'px';
    document.getElementById(tank_dict.n + '_data').style.left = Math.trunc(tank_dict.x - 10) + 'px';
    document.getElementById(tank_dict.n + '_data_1').innerHTML = "Tank X: " + Math.trunc(tank_dict.x * 100)/100 + " Y: " + Math.trunc(tank_dict.y * 100)/100;
    document.getElementById(tank_dict.n + '_data_2').innerHTML = "Damage: " + tank_dict.d;
    document.getElementById(tank_dict.n + '_data_3').innerHTML = "Heat: " + tank_dict.h;
    document.getElementById(tank_dict.n + '_data_4').innerHTML = "Speed: " + tank_dict.s + ' ball count: ' + ball_list.length;

    //tank cool down
    tank_dict.h = ((tank_dict.h > 0) ? tank_dict.h - 10 : 0);

}

function gameplayer1send(data) {
    gameplayer1Socket.send(JSON.stringify(data));
}

function gameplayer2send(data) {
    gameplayer2Socket.send(JSON.stringify(data));
}

function gameplayer3send(data) {
    gameplayer3Socket.send(JSON.stringify(data));
}

function gameplayer4send(data) {
    gameplayer4Socket.send(JSON.stringify(data));
}

function gamecommonsend(data) {
    gamecommonSocket.send(JSON.stringify(data));
}

function BallSender(ball) {
    gamecommonsend(ball);
}

// function BallSender(ball) {
//     if (live_number == "1") {
//         gameplayer1send(ball)
//     } else if (live_number == "2") {
//         gameplayer2send(ball)
//     } else if (live_number == "3") {
//         gameplayer3send(ball)
//     } else if (live_number == "4") {
//         gameplayer4send(ball)
//     }
// }

function tankRender() {
    
        var update_others = true;
        if (Math.trunc(game_cycle/10) == game_cycle/10) {
            var send = true;
        } else {
            var send = false;
        }
        if (live_number == "1") {
            live_tank.c++;
            updateTank(tank1, true);
            if (send) {gameplayer1send(live_tank)}
        } else {
            if (tank1.c < tank1a.c) {tank1 = Object.assign(tank1, tank1a)}
            updateTank(tank1, update_others)
        }
        
        if (live_number == "2") {
            live_tank.c++;
            updateTank(tank2, true);
            if (send) {gameplayer2send(live_tank)}
        } else {
            if (tank2.c < tank2a.c) {tank2 = Object.assign(tank2, tank2a)}
            updateTank(tank2, update_others)
        }
        
        if (live_number == "3") {
            live_tank.c++;
            updateTank(tank3, true);
            if (send) {gameplayer3send(live_tank)}
        } else {
            if (tank3.c < tank3a.c) {tank1 = Object.assign(tank3, tank3a)}
            updateTank(tank3, update_others)
        }
        
        if (live_number == "4") {
            live_tank.c++;
            updateTank(tank4, true);
            if (send) {gameplayer4send(live_tank)}
        } else {
            if (tank4.c < tank4a.c) {tank4 = Object.assign(tank4, tank4a)}
            updateTank(tank4, update_others)
        }
        live_tank.e = false;
}

function gameLoop(){
    if (html_ready) {
        game_cycle++;
        document.querySelector('#game-metrics-log').value = (game_cycle);
        checkCreateTanks();
        tankRender();

        //work the ballistic list
        old_list = ball_list;
        ball_list = [];
        for (i=0; i<old_list.length; i++) {
            if (old_list[i].c > 0) {
                old_list[i].c-=2;
                old_list[i].runrise = degreestoRunRise(old_list[i].t);
                old_list[i].x = old_list[i].x + old_list[i].s * old_list[i].runrise.x;
                old_list[i].y = old_list[i].y + old_list[i].s * old_list[i].runrise.y;
                if (!existsElement(old_list[i].n)) {
                    if (createElement(old_list[i].n + '_container', 'ballistic_overlay', 'div')) {
                        (createElement(old_list[i].n, old_list[i].n + '_container', 'img'))
                    }
                }

                if (collisionCheck(old_list[i].x, old_list[i].y, 5, tank1, tank.half - 10, tank.x_center, tank.y_center) == 1) {
                    // console.log('tank 1 here: ' + old_list[i].c)
                    tank1.d+=50;
                    old_list[i].c = 0;
                }

                if (collisionCheck(old_list[i].x, old_list[i].y, 5, tank2, tank.half - 10, tank.x_center, tank.y_center) == 1) {
                    // console.log('tank 2 here: ' + old_list[i].c)
                    tank2.d+=50;
                    old_list[i].c = 0;
                }

                if (collisionCheck(old_list[i].x, old_list[i].y, 5, tank3, tank.half - 10, tank.x_center, tank.y_center) == 1) {
                    // console.log('tank 3 here: ' + old_list[i].c)
                    tank3.d+=50;
                    old_list[i].c = 0;
                }

                if (collisionCheck(old_list[i].x, old_list[i].y, 5, tank4, tank.half - 10, tank.x_center, tank.y_center) == 1) {
                    // console.log('tank 4 here: ' + old_list[i].c)
                    tank4.d+=50;
                    old_list[i].c = 0;
                }

                document.getElementById(old_list[i].n ).width = 30;
                document.getElementById(old_list[i].n ).height = 10;
                document.getElementById(old_list[i].n ).src = bullet_image;
                document.getElementById(old_list[i].n + '_container').style.position = "absolute";
                document.getElementById(old_list[i].n + '_container').style.top = (old_list[i].y) + 'px';
                document.getElementById(old_list[i].n + '_container').style.left = (old_list[i].x) + 'px';
                document.getElementById(old_list[i].n + '_container').style.transform = 'rotate(' + old_list[i].t + 'deg)';
                document.getElementById(old_list[i].n + '_container').style.filter = 'hue-rotate(' + old_list[i].c + 'deg)';

                ball_list.push(old_list[i]);

            } else {
                destroyElement(old_list[i].n + '_container')
            }
        }
    }
}

document.onkeydown = function(e){
    if (html_ready) {
        if (live_tank != {}) {
            //z key
            if(e.keyCode == 90){
                if (live_tank.h < 1000) {
                    ball_index++;
                    var new_ball = {
                        k : 'ball',
                        n : 'ball_' + live_tank.n + (ball_index),
                        c : 180,
                        s : 20,
                        t : live_tank.t_t,
                        to : tank.to_chassis, ///removed live_tank.t
                    }

                    new_ball.runrise = degreestoRunRise(new_ball.t)
                    adjust = ((Math.abs(new_ball.runrise.x) + Math.abs(new_ball.runrise.y) > 1.7) ? .72 : 1);
                    // console.log(new_ball.runrise.x + ' : ' + new_ball.runrise.y);
                    new_ball.x = (live_tank.x + tank.x_center) + (new_ball.runrise.x * adjust * ((tank.w_turret * tank.to_turret / 100)))
                    new_ball.y = (live_tank.y + tank.y_center) + (new_ball.runrise.y * adjust * ((tank.w_turret * tank.to_turret / 100)))

                    BallSender(new_ball);
                    // ball_list.push(new_ball);
                    live_tank.h+=750;
                    live_tank.e = true;
                }
            }

            //option key on Mac (might need to change this for windows users)
            if(e.keyCode == 18){
                if (!event.getModifierState("Shift")) {
                    live_tank.s = 0;
                    live_tank.r_c = 0;
                } else {
                    live_tank.r_t = 0;
                }
                live_tank.e = true;
            }

            //left key
            if(e.keyCode == 37){
                if (!event.getModifierState("Shift")) {
                    if (live_tank.r_c > -max_rot) {
                        live_tank.r_c-=.25;
                        //tank1.s = 0;
                    };
                } else {
                    if (live_tank.r_t > -max_rot) {
                        live_tank.r_t-=.25;
                    };
                };
                live_tank.e = true;
            }
            //right key
            if(e.keyCode == 39){
                if (!event.getModifierState("Shift")) {
                    if (live_tank.r_c < max_rot) {
                        live_tank.r_c+=.25;
                        //tank1.s = 0;
                    }
                } else {
                    if (live_tank.r_t < max_rot) {
                        live_tank.r_t+=.25;
                    };
                };
                live_tank.e = true;
            }
            //down key
            if(e.keyCode == 40){
                if (live_tank.s > -max_rot) {
                    live_tank.s-=.25;
                    //tank1.r_c = 0;
                };
            }
            // up key
            if(e.keyCode == 38){
                if (live_tank.s < max_rot) {
                    live_tank.s+=.25;
                    //tank1.r_c = 0;
                };
                live_tank.e = true;
            }
        }
    }
}

// This block of code will execute when the HTML DOM has finished loading.
// These steps need to happen at a "global" level, so that the information
// is available throughout the code, including the various functions.
// the very last step in this section will set a boolean variable,
// that will allow all the asyncronous sections of the code to do work.
window.addEventListener("load", function() {

    live_player = document.getElementById('live-player').textContent;
    live_number = live_player.charAt(live_player.length - 1);
    if (live_number == "1") {
        live_tank = tank1
    } else if (live_number == "2") {
        live_tank = tank2
    } else if (live_number == "3") {
        live_tank = tank3
    } else if (live_number == "4") {
        live_tank = tank4
    } else {
        live_tank = {}
    }

    tank1a = Object.assign(tank1, tank1);
    tank2a = Object.assign(tank2, tank2);
    tank3a = Object.assign(tank3, tank3);
    tank4a = Object.assign(tank4, tank4);

    gameplayer1 = document.getElementById('game-player1').textContent;
    gameplayer1Socket = new WebSocket('ws://' + window.location.host + '/ws/gp/' + gameplayer1 + '/');

    gameplayer1Socket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const dict = JSON.parse(data);
        if (live_tank.n != 'tank1') {
            if (dict.k == 'chat') {
                document.querySelector('#game-player1-chat-log').value = (dict.s + ' says, ' + dict.m);
            } else if (dict.k == 'tank') {
                tank1a = Object.assign(tank1a, dict);
                tank1_recv++;
                document.querySelector('#game-player1-chat-log').value = (tank1_recv);
            }
        }
        if (dict.k == 'ball') {
            ball_list.push(dict);
        }
    }
    
    gameplayer1Socket.onclose = function(e) {
        console.error('game player 1 chat socket closed unexpectedly');
    }
    
    gameplayer2 = document.getElementById('game-player2').textContent;
    gameplayer2Socket = new WebSocket('ws://' + window.location.host + '/ws/gp/' + gameplayer2 + '/');

    gameplayer2Socket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const dict = JSON.parse(data);
        if (live_tank.n != 'tank2') {
            if (dict.k == 'chat') {
                document.querySelector('#game-player2-chat-log').value = (dict.s + ' says, ' + dict.m);
            } else if (dict.k == 'tank') {
                tank2a = Object.assign(tank2a, dict);
                tank2_recv++;
                document.querySelector('#game-player2-chat-log').value = (tank2_recv);
            }
        }
        if (dict.k == 'ball') {
            ball_list.push(dict);
        }
    }

    gameplayer2Socket.onclose = function(e) {
        console.error('game player 2 chat socket closed unexpectedly');
    };

    gameplayer3 = document.getElementById('game-player3').textContent;
    gameplayer3Socket = new WebSocket('ws://' + window.location.host + '/ws/gp/' + gameplayer3 + '/');

    gameplayer3Socket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const dict = JSON.parse(data);
        if (live_tank.n != 'tank3') {
            if (dict.k == 'chat') {
                document.querySelector('#game-player3-chat-log').value = (dict.s + ' says, ' + dict.m);
            } else if (dict.k == 'tank') {
                tank3 = Object.assign(tank3, dict);
                tank3_recv++;
                document.querySelector('#game-player3-chat-log').value = (tank3_recv);
            }
        }
        if (dict.k == 'ball') {
            ball_list.push(dict);
        }
    }

    gameplayer3Socket.onclose = function(e) {
        console.error('game player 3 chat socket closed unexpectedly');
    };

    gameplayer4 = document.getElementById('game-player4').textContent;
    gameplayer4Socket = new WebSocket('ws://' + window.location.host + '/ws/gp/' + gameplayer4 + '/');

    gameplayer4Socket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const dict = JSON.parse(data);
        if (live_tank.n != 'tank4') {
            if (dict.k == 'chat') {
                document.querySelector('#game-player4-chat-log').value = (dict.s + ' says, ' + dict.m);
            } else if (dict.k == 'tank') {
                tank4 = Object.assign(tank4, dict);
                tank4_recv++;
                document.querySelector('#game-player4-chat-log').value = (tank4_recv);
            }
        }
        if (dict.k == 'ball') {
            ball_list.push(dict);
        }
    }

    gameplayer4Socket.onclose = function(e) {
        console.error('game player 4 chat socket closed unexpectedly');
    };

    gamecommon = document.getElementById('game-common').textContent;
    gamecommonSocket = new WebSocket('ws://' + window.location.host + '/ws/gc/' + gamecommon + '/');

    gamecommonSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const dict = JSON.parse(data);
        if (dict.k == 'ball') {
            ball_list.push(dict);
        }
        if (dict.k == 'chat') {
            document.querySelector('#game-common-log').value = (dict.m);
        }
    };

    gamecommonSocket.onclose = function(e) {
        console.error('game common socket closed unexpectedly');
    };

    gamemetrics = document.getElementById('game-metrics').textContent;
    gamemetricsSocket = new WebSocket('ws://' + window.location.host + '/ws/gm/' + gamemetrics + '/');

    gamemetricsSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        document.querySelector('#game-metrics-log').value = (data);
    };

    gamemetricsSocket.onclose = function(e) {
        console.error('game metrics socket closed unexpectedly');
    };

    game_cycle = 0;
    tank1_recv = 0;
    tank2_recv = 0;
    tank3_recv = 0;
    tank4_recv = 0;
    html_ready = true;
});

window.setInterval(gameLoop,msdelay);