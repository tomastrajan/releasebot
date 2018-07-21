#!/usr/bin/env bash
now \
&& sleep 5 \
&& now alias \
&& now scale releasebutler.now.sh all 0 0 \
&& now scale releasebutler.now.sh sfo1 1 1 \
&& echo y | now rm $(now ls releasebot | egrep "releasebot-.*now\.sh" -o | tail -n1)