#!/bin/sh

ONEKO_SRC_DIR=/home/user/oneko-master

# get the mask files inverted. 
for i in ${ONEKO_SRC_DIR}/bitmasks/dog/*; do
    filnm=$(basename $i)
    magick $i -channel RGB -negate $filnm
done

# apply the inverted masks to the bitmaps. 
for i in ${ONEKO_SRC_DIR}/bitmaps/dog/*; do
    filnm=$(basename $i)
    pfix=${filnm%%.*}
    magick $i -alpha off "${pfix}_mask.xbm" -compose CopyOpacity -composite "${pfix}.png"
done

