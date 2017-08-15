
# Must match service name in docker-compose.integration.yml.
SERVICE_NAME=integration

# Keep the integration-test containers separate from eg. development containers.
PROJECT_NAME=ci

# Coloured output, yeah!
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Kill and remove any running containers.
cleanup () {
    docker-compose -p ${PROJECT_NAME} kill
    docker-compose -p ${PROJECT_NAME} rm -f
}

# Catch unexpected failures, do cleanup and output an error message.
trap 'cleanup ; printf "${RED}Tests Failed For Unexpected Reasons${NC}\n"'\
    HUP INT QUIT PIPE TERM

# Build and run the composed services.
docker-compose -p ${PROJECT_NAME} -f docker-compose.integration.yml build && \
	docker-compose -p ${PROJECT_NAME} -f docker-compose.integration.yml up -d
if [ $? -ne 0 ] ; then
    printf "${RED}Docker Compose Failed${NC}\n"
    exit -1
fi

# Wait for the test service to complete and grab the exit code.
TEST_EXIT_CODE=`docker wait ${PROJECT_NAME}_${SERVICE_NAME}_1`

# Output the logs for the test.
docker logs ${PROJECT_NAME}_${SERVICE_NAME}_1

# Inspect the output of the test and display respective message.
if [ -z ${TEST_EXIT_CODE+x} ] || [ "$TEST_EXIT_CODE" -ne 0 ] ; then
    printf "${RED}Tests Failed${NC} - Exit Code: $TEST_EXIT_CODE\n"
else
    printf "${GREEN}Tests Passed${NC}\n"
fi

cleanup

exit $TEST_EXIT_CODE
