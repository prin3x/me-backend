#!/bin/bash
echo ">>>>>>>>>>>>>>>>> Git pull code <<<<<<<<<<<<<<<<<<<<"
git pull origin main

echo ">>>>>>>>>>>>>>>>> Install or Update package <<<<<<<<<<<<<<<<<<<<"
yarn

echo ">>>>>>>>>>>>>>>>> Build project <<<<<<<<<<<<<<<<<<<<"
yarn build || exit $?

echo ">>>>>>>>>>>>>>>>> Restart app <<<<<<<<<<<<<<<<<<<<"
pm2 restart me-backend && pm2 logs --lines 2
