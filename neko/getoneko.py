#!/usr/bin/python3

import sys
import math

R = 480
OX = 960
OY = 540

def getpos(generation): 
    rad1 = math.radians((generation % 90) * 4)
    rad2 = math.radians((generation % 10) * 36)
    r = (math.cos(rad2) * 20) + R
    x = math.cos(rad1) * r
    y = math.sin(rad1) * r
    return (x, y)

if len(sys.argv) > 1: 
    now = int(sys.argv[1])
    pos_now = getpos(now)
    x_now = int(pos_now[0])
    y_now = int(pos_now[1])

    # determine which bitmap to use by comparing the 
    # current position with the next one which comes 
    # on the +1 generation. 
    pos_next = getpos(now + 1)
    x_next = int(pos_next[0])
    y_next = int(pos_next[1])
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

    movement = int((now % 2) + 1)
    filename = prefix + str(movement) + ".png"

    # print the result in CSV format. 
    print(str(x_now + OX) + "," + str(y_now + OY) + "," + filename)
else: 
    print("FATAL: no arguments specified.")

