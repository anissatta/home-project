const IMG_URLS = [
    './img/awake.png', 
    './img/down1.png', 
    './img/down2.png', 
    './img/dtogi1.png', 
    './img/dtogi2.png', 
    './img/dwleft1.png', 
    './img/dwleft2.png', 
    './img/dwright1.png', 
    './img/dwright2.png', 
    './img/jare2.png', 
    './img/kaki1.png', 
    './img/kaki2.png', 
    './img/left1.png', 
    './img/left2.png', 
    './img/ltogi1.png', 
    './img/ltogi2.png', 
    './img/mati2.png', 
    './img/mati3.png', 
    './img/right1.png', 
    './img/right2.png', 
    './img/rtogi1.png', 
    './img/rtogi2.png', 
    './img/sleep1.png', 
    './img/sleep2.png', 
    './img/up1.png', 
    './img/up2.png', 
    './img/upleft1.png', 
    './img/upleft2.png', 
    './img/upright1.png', 
    './img/upright2.png', 
    './img/utogi1.png', 
    './img/utogi2.png',
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
    './img/utogi2_sakura.png',
    './img/pointer.png',
    './img/icons.png',
    './img/titlebar.png'
];
const NUM_IMGS = IMG_URLS.length;
const CANVAS_W = 1920;
const CANVAS_H = 1080;
var canvas = null;
var ctx = null;
var imgs = [];
var loaded = 0;
var last = null;
var generation = 0;
var show_pointer = false;
var show_icons = false;
var bg = new Object();
bg.r = 210;
bg.g = 210;
bg.b = 210;

function addImage(on_complete) {
    loaded++;
    if (loaded == NUM_IMGS) {
        on_complete();
    }
}

function loadImages(on_complete) {
    for (var i = 0; i < IMG_URLS.length; i++) {
        const url = IMG_URLS[i];
        var img = new Image();

        img.src = url;
        img.onload = function() {
            addImage(on_complete);
        };
        imgs.push(img);
    }
}

function drawWinContent(x, y) {
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(x, y, 480, 300);
    ctx.globalAlpha = 1.0;

    ctx.font = '23px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';   
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillText('Welcome to our telnet service!', x, y);
    ctx.fillText('Please enter a command.', x, y + 30);
    const command = document.getElementById('txt_command').value;
    ctx.fillStyle = 'rgb(0, 255, 0)';
    ctx.fillText('> ' + command, x, y + 60);
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillText('Sorry "' + command + '"', x, y + 90);
    ctx.fillText('is not recognized by our system.', x, y + 120);
    ctx.fillText('Maybe it will be upgraded soon', x, y + 150);
    ctx.fillText('and you may be able to use this.', x, y + 180);
}

function drawTime() {
    const now = new Date();
    var datestr = '';

    datestr += now.getFullYear() + '. ';
    datestr += (now.getMonth() + 1).toString() + '. ';
    datestr += now.getDate() + ' ';
    datestr += now.getHours().toString().padStart(2, '0') + ':';
    datestr += now.getMinutes().toString().padStart(2, '0') + ':';
    datestr += now.getSeconds().toString().padStart(2, '0') + ' ';
    datestr += 'https://anissatta.github.io/k2/';

    ctx.font = '65px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.strokeText(datestr, CANVAS_W / 2, CANVAS_H);
    ctx.fillStyle = 'rgb(238, 100, 0)';
    ctx.fillText(datestr, CANVAS_W / 2, CANVAS_H);
}

function redraw() {
    const neko = getoneko(generation);
    const win_x = 320;
    const win_y = 480;

    ctx.fillStyle = 'rgb(' + bg.r + ',' + bg.g + ',' + bg.b + ')';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    if (show_icons) {
        ctx.drawImage(imgs[65], CANVAS_W - 86, 24);
    }
    ctx.drawImage(imgs[66], win_x, win_y);
    drawWinContent(win_x, win_y + 21);
    drawSakuras();
    drawTime();
    ctx.drawImage(imgs[neko.imgid], neko.x, neko.y);
    if (show_pointer) {
        const pointer = getoneko(generation + 3);

        ctx.drawImage(imgs[64], pointer.x, pointer.y);
    }
    generation++;
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

function togglePointer() {
    show_pointer = !show_pointer;
}

function toggleIcons() {
    show_icons = !show_icons;
}

function applyNewColor() {
    bg.r = Math.floor(Math.random() * 255);
    bg.g = Math.floor(Math.random() * 255);
    bg.b = Math.floor(Math.random() * 255);
}

function init() {
    canvas = document.getElementById('canvas');
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(43, 168, 255)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    sakura_init();
    loadImages(function() {
        animate();
    });
}

