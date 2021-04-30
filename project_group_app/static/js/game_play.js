var html_ready = false;
var gamefield_ready = false;
var player_ready = false;
var tank_controls = true;
var chat_target = 5;

var live_player = "";
var live_player_number = "0";
var live_player_game = "0";
var gameuser_score = 0;
var gameuser_status = "1";
var gameuser_damage = 0;
var ball_index = 0;

var repair_image = 'static/images/reapir/repair_01.png';
var bullet_image = '/static/images/bullets/bullet_1.png';
var turret_image = '/static/images/tanks/tank_01_turret_1.png';
var chassis_image = '/static/images/tanks/tank_01_chassis_1.png';
var canon_mp3 = '/static/audio/canon.mp3';
var explosion_mp3 = '/static/audio/explosion.mp3';

var canon_sound;
var explosion_sound;

var turret_image_prefix = '/static/images/tanks/tank_01_turret_';
var chassis_image_prefix = '/static/images/tanks/tank_01_chassis_';

//determine window size - this is not currently in use
var ww = window.innerWidth;
var wh = window.innerHeight;

var tank_image_index = 1;

//delay between game loop cycles
var msdelay = 25;
// scale of the tanks/objects
var scale = .2;
// maximum rotation amount for chassis and turret
var max_rot = 3;

// ballistic list
var ball_list = [];
var obj_list = [];

//GameAsset model maps to: object
// k maps to type
// f maps to filename
// w maps to width
// h maps to height
// r maps to resistance
// m maps to max_damage
// p maps to damage_pot
// d is damage
// x maps to x_coord
// y maps to y_coord
// t maps to transform

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
//rr is a dictionary of x,y cooridinate values for run/rise

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
    rr : {'x' : 0, 'y' : 0}
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
    rr: {'x' : 0, 'y' : 0}
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
    rr: {'x' : 0, 'y' : 0}
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
    rr: {'x' : 0, 'y' : 0}
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
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

    for (var ti=1; ti<5;ti++) {
        if (!existsElement('tank' + ti + '-chassis-container')) {
            if (createElement('tank' + ti + '-chassis-container', 'tank-overlay', 'div')) {
                (createElement('tank' + ti + '-chassis', 'tank' + ti + '-chassis-container', 'img'))
            }
        }
        if (!existsElement('tank' + ti + '-turret-container')) {
            if (createElement('tank' + ti + '-turret-container', 'tank-overlay', 'div')) {
                (createElement('tank' + ti + '-turret', 'tank' + ti + '-turret-container', 'img'))
            }
        }
    }
}

function checkObjectsHTML() {
    if (gamefield_ready) {
        old_obj_list = obj_list
        obj_list = []
        for (var oi=0; oi<old_obj_list.length;oi++) {
            if (old_obj_list[oi].k == 'trees') {
                var layer='tree';
            } else {
                var layer='object';
            }

            if (old_obj_list[oi].d < old_obj_list[oi].m) {
                if (!existsElement(old_obj_list[oi].n + '-container')) {
                    createElement(old_obj_list[oi].n + '-container', layer + '-overlay', 'div');
                }
                if (!existsElement(old_obj_list[oi].n )) {
                    createElement(old_obj_list[oi].n, old_obj_list[oi].n + '-container', 'img');
                }
                obj_list.push(old_obj_list[oi])
            } else {
                if (existsElement(old_obj_list[oi].n + '-container')) {
                    destroyElement(old_obj_list[oi].n + '-container')
                }
            }

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
    // console.log(x + ' : ' + y + ' : ' + xy_half + ' : ' + check_half + ' : ' + x_center + ' : ' + y_center)
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
        tank_dict.rr = degreestoRunRise(tank_dict.t_c);

        // when chassis drive occurs
        if (tank_dict.s != 0) {
            tank_dict.e = true;
            var new_x = tank_dict.x + tank_dict.s * tank_dict.rr.x;
            var new_y = tank_dict.y + tank_dict.s * tank_dict.rr.y;
            var adj_x = new_x + tank.x_center;
            var adj_y = new_y + tank.y_center;

            var tot_r = 0
            for (oi=0; oi<obj_list.length; oi++) {
                if (obj_list[oi].k == 'trees') {
                    if (collisionCheck(adj_x, adj_y, tank.half, obj_list[oi], Math.round((obj_list[oi].w + obj_list[oi].h) / 4)-35, Math.round((obj_list[oi].w)/2), Math.round((obj_list[oi].h)/2)) == 1) {
                        obj_list[oi].d+=5;
                        tank_dict.d+=obj_list[oi].p;
                        if (tot_r < obj_list[oi].r) {tot_r = obj_list[oi].r}
                    }
                } else {
                    if (collisionCheck(adj_x, adj_y, tank.half, obj_list[oi], Math.round((obj_list[oi].w + obj_list[oi].h) / 4)-35, Math.round(obj_list[oi].w/2), Math.round(obj_list[oi].h/2)) == 1) {
                        obj_list[oi].d+=5;
                        tank_dict.d+=obj_list[oi].p;
                        if (tot_r < obj_list[oi].r) {tot_r = obj_list[oi].r}
                    }
                }
            }

            var collisions = 0;
            if (tank_dict.n != tank1.n) {collisions += collisionCheck(adj_x , adj_y, tank.half, tank1, tank.half, tank.x_center, tank.y_center)};
            if (tank_dict.n != tank2.n) {collisions += collisionCheck(adj_x , adj_y, tank.half, tank2, tank.half, tank.x_center, tank.y_center)};
            if (tank_dict.n != tank3.n) {collisions += collisionCheck(adj_x , adj_y, tank.half, tank3, tank.half, tank.x_center, tank.y_center)};
            if (tank_dict.n != tank4.n) {collisions += collisionCheck(adj_x , adj_y, tank.half, tank4, tank.half, tank.x_center, tank.y_center)};

            if (collisions == 0) {
                if (tot_r > 100) {tot_r=100}
                if (tot_r > 0) {
                    var new_x = tank_dict.x + ((tank_dict.s - (tank_dict.s/100)*tot_r) * tank_dict.rr.x);    
                    var new_y = tank_dict.y + ((tank_dict.s - (tank_dict.s/100)*tot_r) * tank_dict.rr.y);
                    var adj_x = new_x + tank.x_center;
                    var adj_y = new_y + tank.y_center;
                } else {
                tank_dict.x = new_x;
                tank_dict.y = new_y;
                }
            } else {
                tank_dict.d+=5/(1000/msdelay);
            }

        }
    }

    // get battlefield size
    var bfw = document.getElementById('battlefield-container').getAttribute("width");
    var bfh = document.getElementById('battlefield-container').getAttribute("height");
    //ensure tank can't leave battlefield boundry
    if (tank_dict.x > bfw - 10) {tank_dict.x = bfw - 10};
    if (tank_dict.x < 10) {tank_dict.x = 10};
    if (tank_dict.y > bfh - 10) {tank_dict.y = bfh - 10};
    if (tank_dict.y < 60) {tank_dict.y = 60};

    damage_adjust = 1 + Math.trunc(tank_dict.d/1000)
    tank_image_index = damage_adjust < 11 ? damage_adjust : 11;

    //update chassis
    document.getElementById(tank_dict.n + '-chassis').width = tank.w_chassis;
    document.getElementById(tank_dict.n + '-chassis').height = tank.h_chassis;

    document.getElementById(tank_dict.n + '-chassis').src = chassis_image_prefix + tank_image_index + '.png';

    document.getElementById(tank_dict.n + '-chassis-container').style.position = "absolute";
    document.getElementById(tank_dict.n + '-chassis-container').style.top = tank_dict.y + 'px';
    document.getElementById(tank_dict.n + '-chassis-container').style.left = tank_dict.x + tank.left_off + 'px';
    document.getElementById(tank_dict.n + '-chassis-container').style.transform = 'rotate(' + tank_dict.t_c + 'deg)';
    document.getElementById(tank_dict.n + '-chassis-container').style.transformOrigin = tank.to_chassis + "%";
    document.getElementById(tank_dict.n + '-chassis-container').style.filter = 'hue-rotate(' + tank_dict.color + 'deg)';  // invert(' + tank_dict.d / 5000 + ')';

    //update turret
    document.getElementById(tank_dict.n + '-turret').width = tank.w_turret;
    document.getElementById(tank_dict.n + '-turret').height = tank.h_turret;

    document.getElementById(tank_dict.n + '-turret').src = turret_image_prefix + tank_image_index + '.png';

    document.getElementById(tank_dict.n + '-turret-container').style.position = "absolute";
    document.getElementById(tank_dict.n + '-turret-container').style.top = tank_dict.y + tank.top_off + 'px';
    document.getElementById(tank_dict.n + '-turret-container').style.left = tank_dict.x + 'px';
    document.getElementById(tank_dict.n + '-turret-container').style.transform = 'rotate(' + tank_dict.t_t + 'deg)';
    document.getElementById(tank_dict.n + '-turret-container').style.transformOrigin = tank.to_turret + "%";
    document.getElementById(tank_dict.n + '-turret-container').style.filter = 'hue-rotate(' + (tank_dict.color + tank_dict.h) + 'deg)';

    //update tank data overlay
    document.getElementById(tank_dict.n + '-data').style.position = "absolute";
    document.getElementById(tank_dict.n + '-data').width = 500;
    document.getElementById(tank_dict.n + '-data').height = 50;
    document.getElementById(tank_dict.n + '-data').style.top = Math.trunc(tank_dict.y + 60) + 'px';
    document.getElementById(tank_dict.n + '-data').style.left = Math.trunc(tank_dict.x) + 'px';
    document.getElementById(tank_dict.n + '-heat-bar').value = tank_dict.h;
    document.getElementById(tank_dict.n + '-damage-bar').value = tank_dict.d;

    //tank cool down
    tank_dict.h = ((tank_dict.h > 0) ? tank_dict.h - 5 : 0);
}

function ballisticsRender() {
    //work the ballistic list
    old_list = ball_list;
    ball_list = [];
    for (i=0; i<old_list.length; i++) {
        if (old_list[i].c > 0) {
            old_list[i].c-=2;
            old_list[i].rr = degreestoRunRise(old_list[i].t);
            old_list[i].x = old_list[i].x + old_list[i].s * old_list[i].rr.x;
            old_list[i].y = old_list[i].y + old_list[i].s * old_list[i].rr.y;
            if (!existsElement(old_list[i].n)) {
                if (createElement(old_list[i].n + '-container', 'ballistic-overlay', 'div')) {
                    (createElement(old_list[i].n, old_list[i].n + '-container', 'img'))
                }
            }

            if (collisionCheck(old_list[i].x, old_list[i].y, 5, tank1, tank.half - 10, tank.x_center, tank.y_center) == 1) {
                tank1.d+=500;
                old_list[i].c = 0;
            }

            if (collisionCheck(old_list[i].x, old_list[i].y, 5, tank2, tank.half - 10, tank.x_center, tank.y_center) == 1) {
                tank2.d+=500;
                old_list[i].c = 0;
            }

            if (collisionCheck(old_list[i].x, old_list[i].y, 5, tank3, tank.half - 10, tank.x_center, tank.y_center) == 1) {
                tank3.d+=500;
                old_list[i].c = 0;
            }

            if (collisionCheck(old_list[i].x, old_list[i].y, 5, tank4, tank.half - 10, tank.x_center, tank.y_center) == 1) {
                tank4.d+=500;
                old_list[i].c = 0;
            }

            if (old_list[i].c == 0) {
                explosion_sound.play()
                if (old_list[i].o == gameuser_id) {gameuser_score++}
            }

            for (oi=0; oi<obj_list.length; oi++) {
                if (obj_list[oi].k == 'trees') {
                    if (collisionCheck(old_list[i].x, old_list[i].y, 5, obj_list[oi], Math.round((obj_list[oi].w + obj_list[oi].h) / 4) - 22, Math.round(obj_list[oi].w/2), Math.round(obj_list[oi].h/2)) == 1) {
                        obj_list[oi].d+=500;
                        old_list[i].c = 0;
                    }
                } else {
                    if (collisionCheck(old_list[i].x, old_list[i].y, 5, obj_list[oi], Math.round((obj_list[oi].w + obj_list[oi].h) / 4) - 22, Math.round(obj_list[oi].w/2), Math.round(obj_list[oi].h/2)) == 1) {
                        obj_list[oi].d+=500;
                        old_list[i].c = 0;
                    }
                }
            }

            document.getElementById(old_list[i].n ).width = 30;
            document.getElementById(old_list[i].n ).height = 10;
            document.getElementById(old_list[i].n ).src = bullet_image;
            document.getElementById(old_list[i].n + '-container').style.position = "absolute";
            document.getElementById(old_list[i].n + '-container').style.top = (old_list[i].y) + 'px';
            document.getElementById(old_list[i].n + '-container').style.left = (old_list[i].x) + 'px';
            document.getElementById(old_list[i].n + '-container').style.transform = 'rotate(' + old_list[i].t + 'deg)';
            document.getElementById(old_list[i].n + '-container').style.filter = 'hue-rotate(' + old_list[i].c + 'deg)';

            ball_list.push(old_list[i]);

        } else {
            destroyElement(old_list[i].n + '-container')
        }
    }
}

function objectsRender() {
    if (gamefield_ready) {
        for (var oi=0; oi < obj_list.length; oi++) {

            if (obj_list[oi].k == 'trees') {
                file_path = '/static/images/trees/'
            } else {
                file_path = '/static/images/objects/'
            }

            document.getElementById(obj_list[oi].n).width = obj_list[oi].w;
            document.getElementById(obj_list[oi].n).height = obj_list[oi].h;
            document.getElementById(obj_list[oi].n + '-container').style.position = "absolute";
            document.getElementById(obj_list[oi].n + '-container').style.top = obj_list[oi].y + 'px';
            document.getElementById(obj_list[oi].n + '-container').style.left = obj_list[oi].x + 'px';
            // document.getElementById(obj_list[oi].n + '-container').style.transform = 'rotate(' + obj_list[oi].t + 'deg)';
            document.getElementById(obj_list[oi].n + '-container').style.transformOrigin = obj_list[oi].w/2 + "%";
            document.getElementById(obj_list[oi].n).src = file_path + obj_list[oi].f + '.png';
        }
    }
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

function gamemetricssend(data) {
    gamemetricsSocket.send(JSON.stringify(data));
}

function BallSender(ball) {
    gamecommonsend(ball);
}

function gamefieldRequest() {
    if (!gamefield_ready) {
        if (loopcycleCheck(100)) {
            var url = 'http://' + window.location.host + '/game-field-request/' + live_player_game;
            const xmltreesRequest = new XMLHttpRequest();
            xmltreesRequest.open("GET", url, true);
            xmltreesRequest.send();

            xmltreesRequest.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    const data_list = JSON.parse(this.responseText);
                    for (var oi=0; oi < data_list.length; oi++) {
                        obj_list.push(data_list[oi]);
                    }
                    gamefield_ready = true;
                }
            };
        }
    }
}

function tankRender() {
    var update_others = true;
    document.getElementById(tank1.n + '-player-name').innerHTML = player1_name;
    document.getElementById(tank2.n + '-player-name').innerHTML = player2_name;
    document.getElementById(tank3.n + '-player-name').innerHTML = player3_name;
    document.getElementById(tank4.n + '-player-name').innerHTML = player4_name;
    if (loopcycleCheck(10)) {
        var send = true;
    } else {
        var send = false;
    }
    if (live_player_number == "1") {
        live_tank.c++;
        updateTank(tank1, true);
        
        if (send) {gameplayer1send(live_tank)}
    } else {
        if (tank1.c < tank1a.c) {tank1 = Object.assign(tank1, tank1a)}
        updateTank(tank1, update_others)
    }
    
    if (live_player_number == "2") {
        live_tank.c++;
        updateTank(tank2, true);
        
        if (send) {gameplayer2send(live_tank)}
    } else {
        if (tank2.c < tank2a.c) {tank2 = Object.assign(tank2, tank2a)}
        updateTank(tank2, update_others)
    }
    
    if (live_player_number == "3") {
        live_tank.c++;
        updateTank(tank3, true);
        
        if (send) {gameplayer3send(live_tank)}
    } else {
        if (tank3.c < tank3a.c) {tank3 = Object.assign(tank3, tank3a)}
        updateTank(tank3, update_others)
    }
    
    if (live_player_number == "4") {
        live_tank.c++;
        updateTank(tank4, true);
        
        if (send) {gameplayer4send(live_tank)}
    } else {
        if (tank4.c < tank4a.c) {tank4 = Object.assign(tank4, tank4a)}
        updateTank(tank4, update_others)
    }
    live_tank.e = false;
}

function changeConsole() {
    if (tank_controls) {
        console_class = "container-fluid metrics bg-gray";
        document.getElementById("chat-input").blur();
    } else {
        console_class = "container-fluid metrics bg-dark";
        document.getElementById("chat-input").focus();
    }
    document.getElementById("console").className = console_class;
}

function uploadgameuserStats() {
    if (loopcycleCheck(600)) {
        if (html_ready) {
            if (live_tank != {}) {
                if (live_tank.d >= 10000) {
                    gameuser_status = "0";
                    player_ready = false;
                }
                player_stats = {
                    z : gameuser_status,
                    g : live_player_game,
                    p : live_player_number,
                    n : live_player_name,
                    s : gameuser_score,
                    d : live_tank.d,
                }
                var gameuserstatsPost = new XMLHttpRequest();
                gameuserstatsPost.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log(this.responseText)
                    }
                }
                gameuserstatsPost.open("POST", "/game-player-update", true);
                gameuserstatsPost.setRequestHeader('X-CSRFToken', csrf_token);
                // console.log(JSON.stringify(player_stats))
                gameuserstatsPost.send(JSON.stringify(player_stats));
            }
        }
    }
}

function loopcycleCheck(value) {
    return (Math.trunc(loop_cycles/value) == loop_cycles/value) ? true : false
}

function gameLoop(){
    if (html_ready) {
        loop_cycles++;
        document.querySelector('#cycles').value = (loop_cycles);

        changeConsole();
        gamefieldRequest();
        if (loopcycleCheck(50)) {
            checkObjectsHTML();
            objectsRender();
        }
        checkCreateTanks();
        tankRender();
        ballisticsRender();
        uploadgameuserStats();
    }
}

document.onkeydown = function(e){
    if (html_ready) {
        if (live_tank != {} && player_ready && tank_controls) {

            // turret fire
            if(e.key == 'g' || e.key == 'G'){
                if (live_tank.h < 681) {
                    ball_index++;
                    var new_ball = {
                        k : 'ball',
                        n : 'ball_' + live_tank.n + (ball_index),
                        c : 180,
                        s : 20,
                        t : live_tank.t_t,
                        to : tank.to_chassis,
                        o : gameuser_id
                    }

                    new_ball.rr = degreestoRunRise(new_ball.t)
                    adjust = ((Math.abs(new_ball.rr.x) + Math.abs(new_ball.rr.y) > 1.7) ? .72 : 1);
                    new_ball.x = (live_tank.x + tank.x_center) + (new_ball.rr.x * adjust * ((tank.w_turret * tank.to_turret / 100)))
                    new_ball.y = (live_tank.y + tank.y_center) + (new_ball.rr.y * adjust * ((tank.w_turret * tank.to_turret / 100)))

                    BallSender(new_ball);
                    live_tank.h+=330;
                    live_tank.e = true;
                }
            }

            // drive/chassis rotation stop
            if(e.key == 'a' || e.key == 'A'){
                live_tank.s = 0;
                live_tank.r_c = 0;
                live_tank.e = true;
            }

            //turret rotation stop
            if(e.key == 'h' || e.key == 'H'){
                live_tank.r_t = 0;
                live_tank.e = true;
            }

            //rotate chassis left
            if(e.key == 'd' || e.key == 'D'){
                if (live_tank.r_c > -max_rot){
                    live_tank.r_c-=.25;
                    //tank1.s = 0;
                live_tank.e = true;
                }
            }

            //rotate turret left
            if(e.key == 'f' || e.key == 'F'){
                if (live_tank.r_t > -max_rot){
                    live_tank.r_t-=.25;
                }
                live_tank.e = true;
            }

            //rotate chassis right
            if(e.key == 'k' || e.key == 'K'){
                if (live_tank.r_c < max_rot){
                    live_tank.r_c+=.25;
                    //tank1.s = 0;
                }
                live_tank.e = true;
            }

            //rotate turret right
            if(e.key == 'j' || e.key == 'J'){
                if (live_tank.r_t < max_rot){
                    live_tank.r_t+=.25;
                }
                live_tank.e = true;
            }

            //drive reverse
            if(e.key == 'l' || e.key == 'L'){
                if (live_tank.s > -max_rot){
                    live_tank.s-=.25;
                    //tank1.r_c = 0;
                }
                live_tank.e = true;
            }

            // drive forward
            if(e.key == 's' || e.key == 'S'){
                if (live_tank.s < max_rot){
                    live_tank.s+=.25;
                    //tank1.r_c = 0;
                }
                live_tank.e = true;
            }
        }
    }
}

document.onkeyup = function(e){
    if (html_ready) {
        if (e.key == ';') {
            tank_controls = tank_controls ? false : true;
        } else if (!tank_controls) {
            all_text = document.querySelector('#chat-input').value
            all_text = all_text.replace(/(\r\n|\n|\r)/gm,"");
            document.querySelector('#chat-input').value = all_text.substring(0,30)
            if (e.key == 'F1') {chat_target='1'}
            if (e.key == 'F2') {chat_target='2'}
            if (e.key == 'F3') {chat_target='3'}
            if (e.key == 'F4') {chat_target='4'}
            if (e.key == 'F5') {chat_target='5'}
            if (e.key == 'F6') {chat_target='6'}
            if (e.key == 'Enter') {
                if (chat_target < 6) {
                    gamecommonsend({'k':'chat','n':'chat'+ chat_target ,'m': all_text })
                } else {
                    gamemetricssend({'k':'chat','n':'chat'+ chat_target ,'m': all_text })
                }
                document.querySelector('#chat-input').value = "";
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
    csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value;
    gameuser_id = Number(document.getElementById("user-id").innerHTML);
    gameuser_score = Number(document.getElementById("live-score").innerHTML);
    gameuser_damage = Number(document.getElementById("live-damage").innerHTML);
    live_player = document.getElementById('live-player').innerHTML;
    live_player_name = document.getElementById("live-name").innerHTML;
    live_player_number = live_player.charAt(live_player.length - 1);
    live_player_game = live_player.charAt(4);
    player1_name = document.getElementById("game-player1-name").innerHTML;
    player2_name = document.getElementById("game-player2-name").innerHTML;
    player3_name = document.getElementById("game-player3-name").innerHTML;
    player4_name = document.getElementById("game-player4-name").innerHTML;

    if (live_player_number == "1") {
        live_tank = tank1
    } else if (live_player_number == "2") {
        live_tank = tank2
    } else if (live_player_number == "3") {
        live_tank = tank3
    } else if (live_player_number == "4") {
        live_tank = tank4
    } else {
        live_tank = {}
    }

    live_tank.d = gameuser_damage;

    canon_sound = new sound (canon_mp3);
    explosion_sound = new sound (explosion_mp3);

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
            
            canon_sound.play();
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
                tank2 = Object.assign(tank2, dict);
                tank2_recv++;
                document.querySelector('#game-player2-chat-log').value = (tank2_recv);
            }
        }
        if (dict.k == 'ball') {
            
            canon_sound.play();
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
            
            canon_sound.play();
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
            
            canon_sound.play();
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
            
            canon_sound.play();
            ball_list.push(dict);
        }
        if (dict.k == 'chat') {
            chat_number = dict.n.charAt(dict.n.length - 1);
            if (live_player_number == chat_number || chat_number == 5) {
                curr_text = document.querySelector('#game-common-log').value
                document.querySelector('#game-common-log').value = (dict.m) + '\n' + curr_text
            } 
        }
    };

    gamecommonSocket.onclose = function(e) {
        console.error('game common socket closed unexpectedly');
    };

    gamemetrics = document.getElementById('game-metrics').textContent;
    gamemetricsSocket = new WebSocket('ws://' + window.location.host + '/ws/gm/' + gamemetrics + '/');

    gamemetricsSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const dict = JSON.parse(data);
        if (dict.k == 'chat') {
            curr_text = document.querySelector('#game-common-log').value
            document.querySelector('#game-common-log').value = (dict.m) + '\n' + curr_text
        }
        // document.querySelector('#game-metrics-log').value = (data);
    };

    gamemetricsSocket.onclose = function(e) {
        console.error('game metrics socket closed unexpectedly');
    };

    loop_cycles = 0;
    tank1_recv = 0;
    tank2_recv = 0;
    tank3_recv = 0;
    tank4_recv = 0;
    player_ready = true;
    html_ready = true;
});

window.setInterval(gameLoop,msdelay);