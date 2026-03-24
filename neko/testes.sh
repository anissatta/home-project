#!/bin/sh 

i=0

while true
do
    i=$(($i+1))
    ./test.sh $i
    if [ $i = 300 ]; then
        exit
    fi
done

