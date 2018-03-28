#!/usr/bin/env bash
now
sleep 5
now alias
now scale releasebot.now.sh 1
echo y | now rm $(now ls | egrep "releasebot.*now\.sh" -o | tail -n1)