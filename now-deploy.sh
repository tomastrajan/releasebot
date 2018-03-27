#!/usr/bin/env bash
now
sleep 5
now alias
now scale $(now ls | egrep "releasebot.*now\.sh" -o | head -n1) 1
echo y | now rm $(now ls | egrep "releasebot.*now\.sh" -o | tail -n1)