var html_ready = false;

var bullet_image = 'static/images/bullets/bullet_1.png'
var turret_image = 'static/images/tanks/tank_01_turret_1.png'
var chassis_image = 'static/images/tanks/tank_01_chassis_1.png'

//determine window size - this is not currently in use
var ww = window.innerWidth;
var wh = window.innerHeight;

//delay between updates
var msdelay = 15;
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

//x and y are the cooridinate values of the tank on the field
//color is the hue degree for tank
//t_chassis is the transform degrees for chassis
//t_turret is the transform degrees for turret
//r_chassis is the rotation amount for chassis
//r_turret is the rotation amount for turret
//d_chassis is the drive amount for chassis
//runrise is a dictionary of x,y cooridinate values for run/rise

var tank1 = {
    t : tank,
    n : 'tank1',
    x: 0,
    y: 0,
    color: 0,
    h: 0,
    damage: 0,
    t_chassis: 225,
    t_turret: 225,
    r_chassis: 0,
    r_turret: 0,
    d_chassis: 0,
    runrise: {'x' : 0, 'y' : 0}
}

var tank2 = {
    t : tank,
    n : 'tank2',
    x: 1800,
    y: 0,
    color: 90,
    h: 0,
    damage: 0,
    t_chassis: 315,
    t_turret: 315,
    r_chassis: 0,
    r_turret: 0,
    d_chassis: 0,
    runrise: {'x' : 0, 'y' : 0}
}

var tank3 = {
    t : tank,
    n : 'tank3',
    x: 0,
    y: 1800,
    color: 150,
    h: 0,
    damage: 0,
    t_chassis: 135,
    t_turret: 135,
    r_chassis: 0,
    r_turret: 0,
    d_chassis: 0,
    runrise: {'x' : 0, 'y' : 0}
}

var tank4 = {
    t : tank,
    n : 'tank4',
    x: 1800,
    y: 1800,
    color: 200,
    h: 0,
    damage: 0,
    t_chassis: 45,
    t_turret: 45,
    r_chassis: 0,
    r_turret: 0,
    d_chassis: 0,
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
    if (collision == 1 && xy_half == 5) {console.log('happened: ' + collision)}
    return ((collision >= 1) ? 1 : 0);
}

function updateTank(tank_dict) {

    // when turret rotation occurs
    if (tank_dict.r_turret != 0) {
        tank_dict.t_turret = tank_dict.t_turret + tank_dict.r_turret;
        if (tank_dict.t_turret >= 360) {tank_dict.t_turret -= 360};
        if (tank_dict.t_turret < 0) {tank_dict.t_turret += 360};
    }

    // when chassis rotation occurs
    if (tank_dict.r_chassis != 0) {
        tank_dict.t_chassis = tank_dict.t_chassis + tank_dict.r_chassis;
        if (tank_dict.t_chassis >= 360) {tank_dict.t_chassis -= 360};
        if (tank_dict.t_chassis < 0) {tank_dict.t_chassis += 360};
    }

    //calculate run rise, as it must exist in order for initial motion
    tank_dict.runrise = degreestoRunRise(tank_dict.t_chassis);

    // when chassis drive occurs
    if (tank_dict.d_chassis != 0) {
        var new_x = tank_dict.x + tank_dict.d_chassis * tank_dict.runrise.x;
        var new_y = tank_dict.y + tank_dict.d_chassis * tank_dict.runrise.y;
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
            tank_dict.damage+=5;
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

    //update chassis
    document.getElementById(tank_dict.n + '_chassis').width = tank_dict.t.w_chassis;
    document.getElementById(tank_dict.n + '_chassis').height = tank_dict.t.h_chassis;
    document.getElementById(tank_dict.n + '_chassis').src = chassis_image;
    document.getElementById(tank_dict.n + '_chassis_container').style.position = "absolute";
    document.getElementById(tank_dict.n + '_chassis_container').style.top = tank_dict.y + 'px';
    document.getElementById(tank_dict.n + '_chassis_container').style.left = tank_dict.x + tank_dict.t.left_off + 'px';
    document.getElementById(tank_dict.n + '_chassis_container').style.transform = 'rotate(' + tank_dict.t_chassis + 'deg)';
    document.getElementById(tank_dict.n + '_chassis_container').style.transformOrigin = tank_dict.t.to_chassis + "%";
    document.getElementById(tank_dict.n + '_chassis_container').style.filter = 'hue-rotate(' + tank_dict.color + 'deg) invert(' + tank_dict.damage / 5000 + ')';

    //update turret
    document.getElementById(tank_dict.n + '_turret').width = tank_dict.t.w_turret;
    document.getElementById(tank_dict.n + '_turret').height = tank_dict.t.h_turret;
    document.getElementById(tank_dict.n + '_turret').src = turret_image;
    document.getElementById(tank_dict.n + '_turret_container').style.position = "absolute";
    document.getElementById(tank_dict.n + '_turret_container').style.top = tank_dict.y + tank_dict.t.top_off + 'px';
    document.getElementById(tank_dict.n + '_turret_container').style.left = tank_dict.x + 'px';
    document.getElementById(tank_dict.n + '_turret_container').style.transform = 'rotate(' + tank_dict.t_turret + 'deg)';
    document.getElementById(tank_dict.n + '_turret_container').style.transformOrigin = tank_dict.t.to_turret + "%";
    document.getElementById(tank_dict.n + '_turret_container').style.filter = 'hue-rotate(' + (tank_dict.color + tank_dict.h) + 'deg)';

    //update tank data overlay
    document.getElementById(tank_dict.n + '_data').style.position = "absolute";
    document.getElementById(tank_dict.n + '_data').width = 500;
    document.getElementById(tank_dict.n + '_data').height = 50;
    document.getElementById(tank_dict.n + '_data').style.top = Math.trunc(tank_dict.y + 60) + 'px';
    document.getElementById(tank_dict.n + '_data').style.left = Math.trunc(tank_dict.x - 10) + 'px';
    document.getElementById(tank_dict.n + '_data_1').innerHTML = "Tank X: " + Math.trunc(tank_dict.x * 100)/100 + " Y: " + Math.trunc(tank_dict.y * 100)/100;
    document.getElementById(tank_dict.n + '_data_2').innerHTML = "Damage: " + tank_dict.damage;
    document.getElementById(tank_dict.n + '_data_3').innerHTML = "Heat: " + tank_dict.h;
    document.getElementById(tank_dict.n + '_data_4').innerHTML = "Speed: " + tank_dict.d_chassis + ' ball count: ' + ball_list.length;

    //tank cool down
    tank_dict.h = ((tank_dict.h > 0) ? tank_dict.h - 10 : 0);

}

function gameLoop(){
    if (html_ready) {
        checkCreateTanks();
        updateTank(tank1);
        updateTank(tank2);
        updateTank(tank3);
        updateTank(tank4);

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
                    console.log('tank 1 here: ' + old_list[i].c)
                    tank1.damage+=50;
                    old_list[i].c = 0;
                }

                if (collisionCheck(old_list[i].x, old_list[i].y, 5, tank2, tank.half - 10, tank.x_center, tank.y_center) == 1) {
                    console.log('tank 2 here: ' + old_list[i].c)
                    tank2.damage+=50;
                    old_list[i].c = 0;
                }

                if (collisionCheck(old_list[i].x, old_list[i].y, 5, tank3, tank.half - 10, tank.x_center, tank.y_center) == 1) {
                    console.log('tank 3 here: ' + old_list[i].c)
                    tank3.damage+=50;
                    old_list[i].c = 0;
                }

                if (collisionCheck(old_list[i].x, old_list[i].y, 5, tank4, tank.half - 10, tank.x_center, tank.y_center) == 1) {
                    console.log('tank 4 here: ' + old_list[i].c)
                    tank4.damage+=50;
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
        //z key
        if(e.keyCode == 90){
            if (tank1.h < 500) {

                var new_ball = {
                    n : 'ball_' + (ball_list.length),
                    c : 180,
                    s : 20,
                    t : tank1.t_turret,
                    to : tank1.t.to_chassis,
                }

                new_ball.runrise = degreestoRunRise(new_ball.t)
                adjust = ((Math.abs(new_ball.runrise.x) + Math.abs(new_ball.runrise.y) > 1.7) ? .72 : 1);
                console.log(new_ball.runrise.x + ' : ' + new_ball.runrise.y);
                new_ball.x = (tank1.x + tank.x_center) + (new_ball.runrise.x * adjust * ((tank.w_turret * tank.to_turret / 100)))
                new_ball.y = (tank1.y + tank.y_center) + (new_ball.runrise.y * adjust * ((tank.w_turret * tank.to_turret / 100)))

                ball_list.push(new_ball);
                tank1.h+=750;

            }

        }

        //option key on Mac (might need to change this for windows users)
        if(e.keyCode == 18){
            if (!event.getModifierState("Shift")) {
                tank1.d_chassis = 0;
                tank1.r_chassis = 0;
            } else {
                tank1.r_turret = 0;
            }
        }

        //left key
        if(e.keyCode == 37){
            if (!event.getModifierState("Shift")) {
                if (tank1.r_chassis > -max_rot) {
                    tank1.r_chassis-=.25;
                    //tank1.d_chassis = 0;
                };
            } else {
                if (tank1.r_turret > -max_rot) {
                    tank1.r_turret-=.25;
                };
            };
        }
        //right key
        if(e.keyCode == 39){
            if (!event.getModifierState("Shift")) {
                if (tank1.r_chassis < max_rot) {
                    tank1.r_chassis+=.25;
                    //tank1.d_chassis = 0;
                }
            } else {
                if (tank1.r_turret < max_rot) {
                    tank1.r_turret+=.25;
                };
            };    
        }
        //down key
        if(e.keyCode == 40){
            if (tank1.d_chassis > -max_rot) {
                tank1.d_chassis-=.25;
                //tank1.r_chassis = 0;
            };
        }
        // up key
        if(e.keyCode == 38){
            if (tank1.d_chassis < max_rot) {
                tank1.d_chassis+=.25;
                //tank1.r_chassis = 0;
            };
        }
    }
}

window.addEventListener("load", function() {
    html_ready = true;
});

window.setInterval(gameLoop,msdelay);