FROM nginx:latest

COPY Certificate/ /etc/nginx/ssl/

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 443

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]