const R = 480;
const OX = 960;
const OY = 540;

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
    var prefix = 10;
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
        prefix = 28;
    }
    if (south && east) {
        prefix = 7;
    }
    if (south && west) {
        prefix = 5;
    }
    if (north && west) {
        prefix = 26;
    }

    if (north && !(west || east)) {
        prefix = 24;
    }
    if (east && !(north || south)) {
        prefix = 18;
    }
    if (south && !(west || east)) {
        prefix = 1;
    }
    if (west && !(north || south)) {
        prefix = 12;
    }
    if (!(north || east || south || west)) {
        prefix = 10;
    }

    movement = Math.floor(now % 2);
    ret.imgid = prefix + movement;

    return ret;
}

