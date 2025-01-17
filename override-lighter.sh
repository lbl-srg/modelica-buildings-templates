#!/bin/sh
TARGET_DIR="./static/code-hike-lighter"
rm -rf $TARGET_DIR && git clone $URL $TARGET_DIR
cd $TARGET_DIR/lib && npm link
cd ../../../node_modules && npm link @code-hike/lighter
# The previous `npm link` command creates a hard copy of node_modules in codehike.
# We need to override @code-hike/lighter here as well.
cd codehike/node_modules && npm link @code-hike/lighter
