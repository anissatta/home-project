/* 
    main.js 
    (日本の方々へ) これは下記のPython版のJavaScript訳です。 
    https://github.com/anissatta/home-project/blob/main/dog/drawdogs.py
*/

const IMG_URLS = [
    './img/awake_sakura.png', 
    './img/down1_sakura.png', 
    './img/down2_sakura.png', 
    './img/dtogi1_sakura.png', 
    './img/dtogi2_sakura.png', 
    './img/dwleft1_sakura.png', 
    './img/dwleft2_sakura.png', 
    './img/dwright1_sakura.png', 
    './img/dwright2_sakura.png', 
    './img/jare2_sakura.png', 
    './img/kaki1_sakura.png', 
    './img/kaki2_sakura.png', 
    './img/left1_sakura.png', 
    './img/left2_sakura.png', 
    './img/ltogi1_sakura.png', 
    './img/ltogi2_sakura.png', 
    './img/mati2_sakura.png', 
    './img/mati3_sakura.png', 
    './img/right1_sakura.png', 
    './img/right2_sakura.png', 
    './img/rtogi1_sakura.png', 
    './img/rtogi2_sakura.png', 
    './img/sleep1_sakura.png', 
    './img/sleep2_sakura.png', 
    './img/up1_sakura.png', 
    './img/up2_sakura.png', 
    './img/upleft1_sakura.png', 
    './img/upleft2_sakura.png', 
    './img/upright1_sakura.png', 
    './img/upright2_sakura.png', 
    './img/utogi1_sakura.png', 
    './img/utogi2_sakura.png'
];
const NUM_IMGS = IMG_URLS.length;
const IMG_SZ = 32;
const CANVAS_W = 320;
const CANVAS_H = 480;

var canvas = null;
var ctx = null;
var last = null;
var imgs = [];
var sakuras = [];

function addImage(img, on_complete) {
    if (imgs.length == NUM_IMGS) {
        on_complete();
    }
}

function loadImages(on_complete) {
    for (var i = 0; i < IMG_URLS.length; i++) {
        const url = IMG_URLS[i];
        var img = new Image();

        img.src = url;
        img.onload = function() {
            addImage(this, on_complete);
        };
        imgs.push(img);
    }
}

function get_next_pos(sx, sy, dx, dy) {
    const dist = 10;
    var x = 0;
    var y = 0;

    if (Math.abs(sx - dx) <= dist) {
        x = dx;
    } else {
        if (sx < dx) {
            x = sx + dist;
        } else {
            x = sx - dist;
        }
    }

    if (Math.abs(sy - dy) <= dist) {
        y = dy;
    } else { 
        if (sy < dy) {
            y = sy + dist;
        } else {
            y = sy - dist;
        }
    }

    return ([x, y]);
}

function get_next_dest(sx, sy) {
    const dist = 50;
    const rad = 6.5 * Math.random();

    x = sx + Math.cos(rad) * dist;
    y = sy + Math.sin(rad) * dist;

    if (x < 0) { 
        x = 0;
    }
    if (y < 0) { 
        y = 0;
    }
    if (x > CANVAS_W - IMG_SZ) { 
        x = CANVAS_W - IMG_SZ;
    }
    if (y > CANVAS_H - IMG_SZ) { 
        y = CANVAS_H - IMG_SZ;
    }

    return ([Math.floor(x), Math.floor(y)]);
}

function drawSakura(sakura) {
    // determine which bitmap to use. 
    const significant = 8;
    const x_now = sakura.x;
    const y_now = sakura.y;
    const x_next = sakura.dx;
    const y_next = sakura.dy;
    var prefix = "kaki";
    var west = false;
    var east = false;
    var north = false;
    var south = false;

    if (x_now - x_next > significant) { 
        west = true;
    }
    if (x_next - x_now > significant) {
        east = true;
    }
    if (y_now - y_next > significant) {
        north = true;
    }
    if (y_next - y_now > significant) {
        south = true;
    }

    if (north && east) {
        prefix = "upright";
    }
    if (south && east) {
        prefix = "dwright";
    }
    if (south && west) {
        prefix = "dwleft";
    }
    if (north && west) {
        prefix = "upleft";
    }

    if (north && !(west || east)) {
        prefix = "up";
    }
    if (east && !(north || south)) {
        prefix = "right";
    }
    if (south && !(west || east)) {
        prefix = "down";
    }
    if (west && !(north || south)) {
        prefix = "left";
    }
    if (!(north || east || south || west)) {
        prefix = "kaki";
    }

    /*
        (日本の方々へ) 下記はPython版とのつなぎとなる変換を行うコードです。 
        https://github.com/anissatta/home-project/blob/main/dog/drawdogs.py
    */
    var offset = 0;
    switch (prefix) {
        case "upright": 
            offset = 28;
            break;
        case "dwright": 
            offset = 7;
            break;
        case "dwleft": 
            offset = 5;
            break;
        case "upleft": 
            offset = 26;
            break;
        case "up": 
            offset = 24;
            break;
        case "right": 
            offset = 18;
            break;
        case "down": 
            offset = 1;
            break;
        case "left": 
            offset = 12;
            break;
        case "kaki": 
            offset = 10;
            break;
        default: 
            break;
    }

    const trans = 5 * sakura.id + 32;
    ctx.drawImage(imgs[offset + sakura.movement], 
                  sakura.x, sakura.y, trans, trans);
}

function redraw() {
    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    /* draw sakuras. */
    ctx.globalAlpha = 0.5;
    for (var i = 0; i < sakuras.length; i++) {
        const sakura = sakuras[i];
        const next_pos = get_next_pos(sakura.x, sakura.y, 
                                      sakura.dx, sakura.dy);
        const next_x = next_pos[0];
        const next_y = next_pos[1];

        if (next_x == sakura.dx && next_y == sakura.dy) {
            // this one is reaching its goal. 
            const dpos = get_next_dest(next_x, next_y);
            sakuras[i].dx = dpos[0];
            sakuras[i].dy = dpos[1];
        }
        sakuras[i].x = next_x;
        sakuras[i].y = next_y;
        sakuras[i].movement = (sakuras[i].movement == 0)? 1 : 0;

        drawSakura(sakura);
    }
    ctx.globalAlpha = 1.0;
}

function animate() {
    const now = new Date();

    if (!last) {
        last = now;
        redraw();
    } else if (now - last > 320) {
        last = now;
        redraw();
    }

    requestAnimationFrame(animate);
}

function randomSakura(id) {
    var sakura = Object();

    sakura.id = id;
    sakura.x = Math.floor(Math.random() * CANVAS_W);
    sakura.y = Math.floor(Math.random() * CANVAS_H);
    sakura.dx = Math.floor(Math.random() * CANVAS_W);
    sakura.dy = Math.floor(Math.random() * CANVAS_H);
    sakura.movement = Math.round(Math.random());

    return sakura;
}

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
 
    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.font = '32px courier';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillText('loading...', CANVAS_W / 2, CANVAS_H / 2);

    /* generate sakuras. */
    for (var i = 0; i < 10; i++) {
        sakuras.push(randomSakura(i));
    }

    loadImages(function() {
        animate();
    });
}
