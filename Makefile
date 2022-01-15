COMPOSE_OPTS	=

run:
		docker-compose ${COMPOSE_OPTS} up

detach:
		docker-compose ${COMPOSE_OPTS} up -d

stop:
		docker-compose ${COMPOSE_OPTS} down

build:
		docker-compose ${COMPOSE_OPTS} build

ps:
		docker-compose ${COMPOSE_OPTS} ps
			
migration:
		docker-compose ${COMPOSE_OPTS} exec node yarn migration:up

migration-down:
		docker-compose ${COMPOSE_OPTS} exec node yarn migration:down

db-drop:
		docker-compose ${COMPOSE_OPTS} exec node yarn db:drop

# use: make migration-new NAME=NameOfMigration
migration-new:
		docker-compose ${COMPOSE_OPTS} exec node yarn migration:new ${NAME}

# use: make migration-gen NAME=NameOfMigration
migration-gen:
		docker-compose ${COMPOSE_OPTS} exec node yarn migration:gen ${NAME}

clean:
		docker-compose ${COMPOSE_OPTS} down --rmi local -v

fclean:		clean

re:			clean run

.PHONY:		all run detach stop build ps migration migration-down db-drop clean fclean re