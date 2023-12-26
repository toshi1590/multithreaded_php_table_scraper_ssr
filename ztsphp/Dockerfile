FROM mohsenmottaghi/php-fpm-zts:7.4

RUN apt-get update && \
    apt-get install -y gnupg && \
    pecl install parallel-1.1.4 && \
    docker-php-ext-enable parallel
