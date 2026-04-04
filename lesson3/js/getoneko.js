/* 
    getoneko.js 
    (日本の方々へ) これは下記のPython版のJavaScript訳です。 
    https://github.com/anissatta/home-project/blob/main/neko/getoneko.py
*/

const R = 160;
const OX = 200;
const OY = 200;

function radians(deg) {
    return deg * Math.PI / 180;
}

function getpos(t) {
    const rad1 = radians((t % 90) * 4);
    const rad2 = radians((t % 10) * 36);
    const r = (Math.cos(rad2) * 20) + R;
    const x = Math.cos(rad1) * r;
    const y = Math.sin(rad1) * r;

    return [x, y];
}

function getoneko(now) {
    var ret = Object();
    const pos_now = getpos(now);
    const x_now = Math.floor(pos_now[0]);
    const y_now = Math.floor(pos_now[1]);
    const pos_next = getpos(now + 1);
    const x_next = Math.floor(pos_next[0]);
    const y_next = Math.floor(pos_next[1]);

    ret.x = OX + x_now;
    ret.y = OY + y_now;
    ret.filnm = "";

    /*
        determine which bitmap to use by comparing the 
        current position with the next one which comes 
        on the +1 generation. 
    */
    const significant = 8;
    var prefix = "kaki";
    var west = false;
    var east = false;
    var north = false;
    var south = false;
    var movement = 0;

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

    movement = Math.floor((now % 2) + 1);
    ret.filnm = prefix + movement + ".png";

    return ret;
}

