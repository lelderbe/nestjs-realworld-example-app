COMPOSE_OPTS	=

run:
			docker-compose ${COMPOSE_OPTS} up

bg:
			docker-compose ${COMPOSE_OPTS} up -d

stop:
			docker-compose ${COMPOSE_OPTS} down

build:
			docker-compose ${COMPOSE_OPTS} build

ps:
			docker-compose ${COMPOSE_OPTS} ps
			
clean:
			docker-compose ${COMPOSE_OPTS} down --rmi local -v

fclean:			clean

re:			clean run

.PHONY:		all run bg stop build ps clean fclean re