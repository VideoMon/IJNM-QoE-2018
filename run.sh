#!/bin/bash

CONTAINER=yomo-astream
CONFIG="$(pwd)/videomon_config"
RESULT_DIR=$1
RESULT_DIR=${RESULT_DIR:=/tmp} 


if [[ $@ == **--bash** ]]; then
	# try to open exec inside running container
	ID=$(docker ps | grep $CONTAINER | head -n1 | awk '{ print $1}')
	if [[ -z "$ID" ]]; then 
		docker ps
		echo -e "\nNo running container $CONTAINER found!\n Exiting...\n\n"
		exit -1;
	else
		docker exec -i -t $ID /bin/bash
	fi
else 
	echo "Using config file: $CONFIG ..."
  # run the normal way
	docker run --shm-size=1g -v $RESULT_DIR:/monroe/results  -v $CONFIG:/monroe/config  -t $CONTAINER .
fi


