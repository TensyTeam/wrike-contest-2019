##############
# Tensy Team #
##############

server {
        listen 443 ssl;
        server_name tensyteam.ru www.tensyteam.ru;

        ssl_certificate /etc/letsencrypt/live/tensy.org/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/tensy.org/privkey.pem;
        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

        location /api/ {
            rewrite ^/api/?(.*)$ /$1 break;
            proxy_pass http://127.0.0.1:5555;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location /socket.io/ {
            proxy_pass http://127.0.0.1:5555/socket.io/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location / {
            proxy_pass http://127.0.0.1:3333;
            proxy_redirect off;
            proxy_buffering off;

            proxy_set_header HOST $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_pass_request_headers on;
            proxy_http_version 1.0;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
        }
}

server {
        if ($host = tensyteam.ru) {
            return 301 https://$host$request_uri;
        }

        listen 80;
        server_name tensyteam.ru;
        return 404;
}
