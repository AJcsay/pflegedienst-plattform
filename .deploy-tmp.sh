#!/bin/bash
set -e
export PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin
cd ~/Documents/Claude/Projects/CuraMain/07_Webseite/pflegedienst-plattform/dist/public/

lftp -e "
set ftp:ssl-force true
set ftp:ssl-protect-data true
set ssl:verify-certificate no
set net:max-retries 2
set net:timeout 30
open -u 'w01e2ff7,1SqS79D6xeft-Wu-R@:a' ftps://w01e2ff7.kasserver.com
mirror --reverse --delete --verbose --exclude-glob '.git*' --exclude-glob 'node_modules/' ./ /curamain.de/
bye
" > /tmp/curamain-deploy.log 2>&1
echo "DONE-$?" >> /tmp/curamain-deploy.log
