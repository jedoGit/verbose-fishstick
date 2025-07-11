FROM nginx:latest

COPY certificates/ /etc/nginx/ssl/

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 443

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]