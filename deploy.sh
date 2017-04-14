#!/bin/sh
set -x
tmpdir=/tmp/amuse
curdir=`pwd`
mkdir $tmpdir
rm -rf amuse.zip amuse
cp -R ../amuse/* $tmpdir/.
rm -rf $tmpdir/.git $tmpdir/node_modules $tmpdir/src .$tmpdir/.gitignore .$tmpdir/webpack.config.js $tmpdir/package.json $tmpdir/deploy.sh
cd $tmpdir/
zip -r $curdir/amuse.zip *
rm -rf $tmpdir
