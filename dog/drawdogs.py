#!/usr/bin/python3

import sqlite3
import subprocess
import random
import math
import sys

CAGE_W = 740
CAGE_H = 420

def draw(x_next, y_next, x_now, y_now, movement): 
    # determine which bitmap to use. 
    significant = 8
    prefix = "kaki"
    west = False
    east = False
    north = False
    south = False

    if (x_now - x_next > significant): 
        west = True
    if (x_next - x_now > significant): 
        east = True
    if (y_now - y_next > significant): 
        north = True
    if (y_next - y_now > significant): 
        south = True

    if (north and east): 
        prefix = "upright"
    if (south and east): 
        prefix = "dwright"
    if (south and west): 
        prefix = "dwleft"
    if (north and west): 
        prefix = "upleft"

    if (north and not (west or east)): 
        prefix = "up"
    if (east and not (north or south)): 
        prefix = "right"
    if (south and not (west or east)): 
        prefix = "down"
    if (west and not (north or south)): 
        prefix = "left"
    if (not (north or east or south or west)): 
        prefix = "kaki"

    filename = prefix + str(movement + 1) + "_dog.png"
    path = "img/" + filename
    geom = "+" + str(x_now) + "+" + str(y_now)
    # test mode 
    #t = sys.argv[1]
    #subprocess.run(["composite", "-gravity", "NorthWest", "-geometry", geom, path, t, t])
    subprocess.run(["composite", "-gravity", "NorthWest", "-geometry", geom, path, "bot_temp.png", "bot_temp.png"])

def get_next_pos(sx, sy, dx, dy): 
    dist = 10
    x = 0
    y = 0

    if (abs(sx - dx) <= dist): 
        x = dx
    else: 
        if (sx < dx): 
            x = sx + dist
        else: 
            x = sx - dist

    if (abs(sy - dy) <= dist): 
        y = dy
    else: 
        if (sy < dy): 
            y = sy + dist
        else: 
            y = sy - dist

    return (x, y)

def get_next_dest(sx, sy): 
    dist = 50
    rad = math.radians(random.randint(0, 360))

    x = sx + math.cos(rad) * dist
    y = sy + math.sin(rad) * dist

    if (x < 0): 
        x = 0
    if (y < 0): 
        y = 0
    if (x > CAGE_W): 
        x = CAGE_W
    if (y > CAGE_H): 
        y = CAGE_H

    return (int(x), int(y))

try: 
    cn = sqlite3.connect("turk.db")
    cs = cn.cursor()

    cs.execute('''
        create table if not exists dogs (
            id integer primary key, 
            current_x integer not null, 
            current_y integer not null, 
            target_x integer not null, 
            target_y integer not null, 
            movement integer not null
        )
    ''')
    cs.execute('''
        select * from dogs 
    ''')
    dogs = cs.fetchall()

    if (len(dogs) == 0): 
        # it is the first time for this program to be executed. 
        for i in range(0, 10): 
            x1 = random.randint(0, CAGE_W)
            y1 = random.randint(0, CAGE_H)
            pos2 = get_next_dest(x1, y1)
            x2 = pos2[0]
            y2 = pos2[1]
            cs.execute('''
                insert into dogs 
                (id, current_x, current_y, target_x, target_y, movement) 
                values (?, ?, ?, ?, ?, ?)
            ''', 
            (i, x1, y1, x2, y2, random.randint(0, 1)))
        # now our dogs are up, so let's load 'em. 
        cs.execute('''
            select * from dogs 
        ''')
        dogs = cs.fetchall()

    for dog in dogs: 
        id = dog[0]
        sx = dog[1]
        sy = dog[2]
        dx = dog[3]
        dy = dog[4]
        mov = dog[5]
        next_pos = get_next_pos(sx, sy, dx, dy)
        next_x = next_pos[0]
        next_y = next_pos[1]
        if (next_x == dx and next_y == dy): 
            # this one is reaching its goal. 
            dpos = get_next_dest(next_x, next_y)
            dx = dpos[0]
            dy = dpos[1]
        mov = (mov + 1) % 2
        draw(next_x, next_y, sx, sy, mov)
        cs.execute('''
            update dogs set 
            current_x = ?, 
            current_y = ?, 
            target_x = ?, 
            target_y = ?, 
            movement = ? 
            where id = ?
        ''', 
        (next_x, next_y, dx, dy, mov, id))

    cn.commit();
except Exception as e: 
    print(e)
    cn.rollback();
finally: 
    cn.close();

