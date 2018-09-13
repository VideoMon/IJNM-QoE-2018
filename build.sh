#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#CONTAINER=${DIR##*/}
CONTAINER=yomo-astream
#DOCKERFILE=${CONTAINER}.docker
DOCKERFILE=Dockerfile

NO_CACHE=--no-cache
RM="--rm=true"

[[ $@ == **local** ]] && RM="" && NO_CACHE=""

[[ $@ == **local** ]] || docker pull monroe/base:web
docker build $NO_CACHE $RM -f ${DOCKERFILE} -t ${CONTAINER} . && echo "Finished building ${CONTAINER}"
