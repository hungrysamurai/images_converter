ssl_certificate /etc/ssl/convert-it.ru/fullchain.pem;
ssl_certificate_key /etc/ssl/convert-it.ru/privkey.pem;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_session_cache shared:ConvertItTLS:1m;
ssl_session_timeout 1d;
ssl_session_tickets off;
