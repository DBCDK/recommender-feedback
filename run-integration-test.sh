# Coloured output!
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Kill and remove any running containers.
cleanup () {
    docker-compose -p ci kill
    docker-compose -p ci rm -f --all
}

# Catch unexpected failures, do cleanup and output an error message.
trap 'cleanup ; printf "${RED}Tests Failed For Unexpected Reasons${NC}\n"'\
    HUP INT QUIT PIPE TERM

# Build and run the composed services.
docker-compose -p ci -f docker-compose.integration.yml build && \
	docker-compose -p ci -f docker-compose.integration.yml up -d
if [ $? -ne 0 ] ; then
    printf "${RED}Docker Compose Failed${NC}\n"
    exit -1
fi

# Wait for the test service to complete and grab the exit code.
TEST_EXIT_CODE=`docker wait ci_integration-tester_1`

# Output the logs for the test.
docker logs ci_integration-tester_1

# Inspect the output of the test and display respective message.
if [ -z ${TEST_EXIT_CODE+x} ] || [ "$TEST_EXIT_CODE" -ne 0 ] ; then
    printf "${RED}Tests Failed${NC} - Exit Code: $TEST_EXIT_CODE\n"
else
    printf "${GREEN}Tests Passed${NC}\n"
fi

cleanup

exit $TEST_EXIT_CODE
