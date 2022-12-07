#!/bin/sh

set -e;

ROOT_PATH=$(dirname "$0")/..
SOURCE_FOLDER=$ROOT_PATH/web/build
BACKEND_FOLDER="${BUILD_TARGET_FOLDER:-$ROOT_PATH/api}"
STATIC_DESTINATION=$BACKEND_FOLDER/static_web
TEMPLATE_DESTINATION=$BACKEND_FOLDER/templates_web

echo "Will move statics from ${SOURCE_FOLDER} to ${STATIC_DESTINATION} and ${TEMPLATE_DESTINATION}"

# moves react production built files into django tree

rm -rf $STATIC_DESTINATION
rm -rf $TEMPLATE_DESTINATION

mkdir -p $TEMPLATE_DESTINATION
mv $SOURCE_FOLDER/index.html $TEMPLATE_DESTINATION/
mv $SOURCE_FOLDER/static/ $STATIC_DESTINATION/
mv $SOURCE_FOLDER/* $STATIC_DESTINATION/
