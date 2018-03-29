#!/usr/bin/env bash
for deployment in $(now ls | egrep "releasebot.*now\.sh" -o);
do
    echo y | now rm $deployment
done