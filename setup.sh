#!/bin/bash

cp secret.moon.example secret.moon
nano secret.moon   # Put the info needed in there!
git submodule init
git submodule update
moonc .
lapis migrate production
# ClickMine as a service
echo "[Unit]
Description=ClickMine server

[Service]
Type=forking
WorkingDirectory=$(pwd)
ExecStart=$(which lapis) server production
ExecReload=$(which lapis) build production
ExecStop=$(which lapis) term

[Install]
WantedBy=multi-user.target" > ClickMine.service
sudo cp ./ClickMine.service /etc/systemd/system/ClickMine.service
sudo systemctl daemon-reload
sudo systemctl enable ClickMine.service
service ClickMine start
echo "(Don't forget to proxy or pass to port 8078!)"
