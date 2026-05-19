const IMG_SZ = 32;
var sakuras = [];

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

function do_drawSakura(sakura) {
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

    var offset = 0;
    switch (prefix) {
        case "upright": 
            offset = 28 + 32;
            break;
        case "dwright": 
            offset = 7 + 32;
            break;
        case "dwleft": 
            offset = 5 + 32;
            break;
        case "upleft": 
            offset = 26 + 32;
            break;
        case "up": 
            offset = 24 + 32;
            break;
        case "right": 
            offset = 18 + 32;
            break;
        case "down": 
            offset = 1 + 32;
            break;
        case "left": 
            offset = 12 + 32;
            break;
        case "kaki": 
            offset = 10 + 32;
            break;
        default: 
            break;
    }

    const trans = 5 * sakura.id + 32;
    ctx.drawImage(imgs[offset + sakura.movement], 
                  sakura.x, sakura.y, trans, trans);
}

function drawSakuras() {
    ctx.globalAlpha = 0.3;
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

        do_drawSakura(sakura);
    }
    ctx.globalAlpha = 1.0;
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

function sakura_init() {
    for (var i = 0; i < 8; i++) {
        sakuras.push(randomSakura(i));
    }
}
