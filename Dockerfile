FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
#COPY api-gateway.conf /etc/nginx/api-gateway.conf
COPY .htpasswd /etc/nginx/.htpasswd
COPY index.html /usr/share/nginx/html/index.html

