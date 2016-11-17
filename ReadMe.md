## Installation

1. Run `install.sh` on an Ubuntu server (16.04 last tested I believe).
2. Put this in your NGINX http block:
   ```
   server {
     listen 80;
     server_name DOMAIN;
     return 301 https://$host$request_uri;
   }
   server {
     listen 443 ssl;
     server_name DOMAIN;
     location / {
       proxy_pass https://DOMAIN:8078;
     }
   }
   ```
