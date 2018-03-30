#!/usr/bin/env bash
for deployment in $(now ls | grep ERROR | egrep "releasebot.*now\.sh" -o);
do
    echo y | now rm $deployment
done