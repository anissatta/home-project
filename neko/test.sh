#!/bin/sh

gen=$1
dest="$(printf "t%03d" $gen).jpg"

res=$(./getoneko.py $gen)
d1=$(echo $res | awk -F ',' '{print $1}' -)
d2=$(echo $res | awk -F ',' '{print $2}' -)
d3=$(echo $res | awk -F ',' '{print $3}' -)

composite -gravity NorthWest -geometry "+${d1}+${d2}" "img/${d3}" snap-xl.jpg $dest

