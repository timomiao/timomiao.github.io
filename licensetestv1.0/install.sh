#!/bin/sh
APPDIR=$(pwd)
WWWDIR="/var/www"
LINK="$WWWDIR/$(basename $APPDIR)"
LINKCOMMAND1="ln -s $APPDIR $LINK"
echo "Setting link $LINK"

echo $LINKCOMMAND1
$($LINKCOMMAND1)

