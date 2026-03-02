/* main.js */

var canvas = null;
var ctx = null;
var imgs = [];
var ready = false;

const IMG_W = 40;
const IMG_H = 40;
const IMG_URLS = [
    './img/dish.png',
    './img/tteok1.png',
    './img/tteok2.png',
    './img/tteok3.png',
    './img/topping1.png',
    './img/topping2.png',
    './img/topping3.png',
    './img/topping4.png',
    './img/topping5.png'
];
const NUM_IMGS = IMG_URLS.length;
const IMG_OFFSET_DISH = 0;
const IMG_OFFSET_TTEOK = 1;
const IMG_OFFSET_TOPPINGS = 4;

const SAUCES = [
    'rgb(211,  56,  28)',
    'rgb(226,   4,  28)',
    'rgb(243, 244, 127)',
    'rgb( 63,  49,  43)',
    'rgb(240, 144, 141)',
    'rgb(252, 200,   0)'	
];

const CANVAS_W = 320;
const CANVAS_H = 320;

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

function getSauce(img, sauce) {
    var pan = document.createElement('canvas');
    const pan_ctx = pan.getContext('2d');
    var img_data = null;

    pan.width = IMG_W;
    pan.height = IMG_H;
    pan_ctx.clearRect(0, 0, IMG_W, IMG_H);
    pan_ctx.drawImage(img, 0, 0);

    pan_ctx.globalCompositeOperation = 'source-in';
    pan_ctx.globalAlpha = 0.5;
    pan_ctx.fillStyle = SAUCES[sauce];
    pan_ctx.fillRect(0, 0, IMG_W, IMG_H);

    return pan;
}

function redraw(tteok, sauce, toppings) {
    var img_sauce = null;

    /* cls */
    ctx.fillStyle = 'rgb(239, 224, 232)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    /* draw the dish */
    ctx.drawImage(imgs[IMG_OFFSET_DISH], 0, 0, IMG_W, IMG_H,
                  0, 0, CANVAS_W, CANVAS_H);
    /* draw the tteok */
    ctx.drawImage(imgs[IMG_OFFSET_TTEOK + tteok], 0, 0, IMG_W, IMG_H,
                  0, 0, CANVAS_W, CANVAS_H);
    /* draw the sauce */
    img_sauce = getSauce(imgs[IMG_OFFSET_TTEOK + tteok], sauce);
    ctx.drawImage(img_sauce, 0, 0, IMG_W, IMG_H,
                  0, 0, CANVAS_W, CANVAS_H);
    /* draw the toppings */
    if (toppings != null) {
        for (var i = 0; i < toppings.length; i++) {
            const topping = toppings[i];

            if (topping) {
                ctx.drawImage(imgs[IMG_OFFSET_TOPPINGS + i], 0, 0, IMG_W, IMG_H,
                              0, 0, CANVAS_W, CANVAS_H);
            }
        }
    }
}

function applyParams(tteok, sauce, toppings) {
    if (ready) {
        redraw(tteok, sauce, toppings);
    }
}

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    ctx.imageSmoothingEnabled = false;
 
    ctx.fillStyle = 'rgb(157, 137, 108)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.font = '32px courier';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillText('loading...', CANVAS_W / 2, CANVAS_H / 2);

    loadImages(function() {
        ready = true;
        redraw(0, 0, null);
    });
}
