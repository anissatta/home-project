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
    './img/utogi2.png'
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

    ctx.fillStyle = 'rgb(210, 210, 210)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    drawTime();
    ctx.drawImage(imgs[neko.imgid], neko.x, neko.y);
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

function init() {
    canvas = document.getElementById('canvas');
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(43, 168, 255)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    loadImages(function() {
        animate();
    });
}

