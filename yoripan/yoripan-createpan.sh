#!/bin/bash

dow=""
case $(date "+%u") in
1)
    dow="월"
    ;;
2)
    dow="화"
    ;;
3)
    dow="수"
    ;;
4)
    dow="목"
    ;;
5)
    dow="금"
    ;;
6)
    dow="토"
    ;;
7)
    dow="일"
    ;;
*)
    dow="?"
    ;;
esac

printop() {
    # print the headline of Newsis realtime news. 
    TOPIN=0
    while read -r line; do
        if [[ $TOPIN == 1 && $line != "" && $line != *"[NISI"* ]]; then
            echo $line | tr -d "\n"
        fi

        if [[ $line == *"[NISI"* ]]; then
            if [[ $TOPIN == 1 ]]; then
                break
            else
                TOPIN=1
            fi
        fi
    done < <(w3m -dump https://www.newsis.com/realnews/)
}

url=$1
#wti=$(w3m -dump https://oilprice.com/ | grep "WTI Crude" | head -n 1)
kdate=$(echo " $(date "+%y. %m. %d") ${dow}요일 ")

if [ -z $url ]; then
    echo '<p lang="ko">'
    echo "<strong> ${kdate} </strong>"
    echo '</p>'
    echo '<p lang="ko">'
    echo $(printop)
    echo '</p>'
else
    echo '<p><em>'
    echo "${wti} </em><strong> ${kdate} </strong>"
    echo '</p>'
    echo '<p lang="ko">'
    echo '나에겐 화석 기름보다 참기름이 중요한다. 자, 오늘도 요리를 하자!'
    echo '</p>'
    echo '<div class="row">'
    echo '<div class="col-sm-2">'
    echo '<div id="qrcode"></div>'
    echo '</div>'
    # get thumbnail of this. 
    iurl=$(curl -s "${url}" | pup "meta[property=og:image] attr{content}")
    wget "${iurl}" -O yoripan-temp.jpg
    convert -strip yoripan-temp.jpg yoripan-temp.png
    imgdata=$(echo "data:image/png;base64,$(base64 -w 0 yoripan-temp.png)")
    # get the title. 
    ktit=$(curl -s "${url}" | pup "meta[property=og:title] attr{content}")
    etit=$(trans -b ko:en "${ktit}")
    echo '<div class="col-sm-7">'
    echo "<p lang=\"ko\">${ktit}</p>"
    echo "<p lang=\"en\">${etit}</p>"
    echo "<p id=\"url\">${url}</p>"
    echo '</div>'
    echo '<div class="col-sm-3">'
    echo "<img src=\"${imgdata}\">"
    echo '</div>'
fi

