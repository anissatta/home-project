#!/bin/sh

digi_time () {
    figlet $(date "+%H : %M ${1}") | sed s/\\\\/\\\\\\\\/g | tr " " "\ "
}

chrs=$(echo "$1" | tr -cd '[:alnum:]' | cut -c1-3)

#/home/user/kamsys/yoripan/yoripan.py > /home/user/kamsys/yoripan/core
# execute yoripan-createpan.sh with no arguments so that the news instead will be printed. 
/home/user/kamsys/yoripan/yoripan-createpan.sh > /home/user/kamsys/yoripan/core
cat /home/user/kamsys/yoripan/heada.html /home/user/kamsys/yoripan/bg.uri /home/user/kamsys/yoripan/headb.html /home/user/kamsys/yoripan/core /home/user/kamsys/yoripan/tail.html > /home/user/kamsys/yoripan/index.html
wkhtmltoimage --width 800 --crop-h 320 /home/user/kamsys/yoripan/index.html /home/user/kamsys/yoripan/yori.png
convert /home/user/kamsys/yoripan/yori.png -font ./DungGeunMo.ttf -gravity SouthWest +antialias -pointsize 24 -stroke green -fill white -annotate +0+0 "$(digi_time ${chrs})" /home/user/kamsys/yoripan/yori.png

