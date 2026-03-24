#!/bin/sh

i=0

while true
do
    i=$(($i+1))
    echo $i
    filnm="t$(printf '%03d' $i).png"
    cp bot_temp.png $filnm
    ./drawdogs.py $filnm
    if [ $i = 100 ]; then
        exit
    fi
done
