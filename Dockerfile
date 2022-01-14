FROM node:14.17.6
LABEL org.opencontainers.image.authors="fvdc@ya.ru"
ENV TZ Europe/Moscow
STOPSIGNAL SIGKILL
WORKDIR /app
EXPOSE 5000
CMD	\
	yarn config set strict-ssl false && \
	# export NODE_TLS_REJECT_UNAUTHORIZED='0' && \
	yarn install && \
	yarn build && \
	# yarn migration:up && \
	yarn start:dev && \
	echo
