FROM node:20-alpine

USER root

# Install Apache, Python, make, and g++
RUN apk add --no-cache apache2 apache2-utils python3 make g++

# Copy the virtual host configuration file
COPY ./v_host.conf /etc/apache2/conf.d/vhost.conf

WORKDIR /var/www/html

# Copy start scripts to the working directory
COPY start_prod.sh .
COPY start_dev.sh .

# Enable Apache modules by modifying the configuration
RUN sed -i '/#LoadModule rewrite_module/s/^#//g' /etc/apache2/httpd.conf \
    && sed -i '/#LoadModule headers_module/s/^#//g' /etc/apache2/httpd.conf

# Expose the default Apache port
EXPOSE 80

# Set the default command based on the STAG environment variable
ENTRYPOINT ["sh", "-c", "if [ \"$STAG\" = 'production' ]; then sh start_prod.sh; else sh start_dev.sh; fi"]
