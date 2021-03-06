#!/bin/bash

set -o errexit   # exit on error

# Prerequisites
echo "Please set up certificates before continuing."
read -p " Press [Enter] to continue, or Ctrl+C to cancel."
sudo apt-get update
sudo apt-get install wget curl lua5.1 liblua5.1-0-dev zip unzip libreadline-dev libncurses5-dev libpcre3-dev openssl libssl-dev perl make build-essential postgresql -y   # Make sure you note your PostgreSQL password!
# OpenResty
cd ..
wget https://openresty.org/download/openresty-1.9.7.5.tar.gz
tar xvf openresty-1.9.7.5.tar.gz
cd openresty-1.9.7.5
./configure
make
sudo make install
cd ..
# LuaRocks
wget https://keplerproject.github.io/luarocks/releases/luarocks-2.3.0.tar.gz
tar xvf luarocks-2.3.0.tar.gz
cd luarocks-2.3.0
./configure
make build
sudo make install
# some rocks
sudo luarocks install lapis
sudo luarocks install moonscript
sudo luarocks install bcrypt
# cleanup
cd ..
rm -rf openresty*
rm -rf luarocks*
# okay now let's set it up
cd ClickMine
openssl dhparam -out dhparams.pem 2048
echo "Changing user to postgres..."
echo "Run 'psql', enter the following (using a real password of course):"
echo "ALTER USER postgres WITH PASSWORD 'password';"
echo "\q"
echo "Then run 'createdb clickmine' and then 'exit' !"
sudo -i -u postgres
cp secret.moon.example secret.moon
nano secret.moon   # Put the info needed in there!
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
