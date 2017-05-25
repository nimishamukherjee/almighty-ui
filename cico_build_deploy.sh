#!/bin/bash

# Show command before executing
set -x

# Exit on error
set -e

# Source environment variables of the jenkins slave
# that might interest this worker.
if [ -e "jenkins-env" ]; then
  cat jenkins-env \
    | grep -E "(JENKINS_URL|GIT_BRANCH|GIT_COMMIT|BUILD_NUMBER|ghprbSourceBranch|ghprbActualCommit|BUILD_URL|ghprbPullId)=" \
    | sed 's/^/export /g' \
    > /tmp/jenkins-env
  source /tmp/jenkins-env
fi

# We need to disable selinux for now, XXX
/usr/sbin/setenforce 0

# Get all the deps in
yum -y install docker make git
service docker start

# Build builder image
cp /tmp/jenkins-env .
docker build -t fabric8-planner-builder -f deploy/Dockerfile.builder .
# User root is required to run webdriver-manager update. This shouldn't be a problem for CI containers
mkdir -p dist && docker run --detach=true --name=fabric8-planner-builder --user=root --cap-add=SYS_ADMIN -t -v $(pwd)/dist:/dist:Z fabric8-planner-builder


# Build almigty-ui
docker exec fabric8-planner-builder npm install

docker exec fabric8-planner-builder npm run test:unit

## Exec functional tests
#docker exec fabric8-planner-builder ./run_functional_tests.sh


docker exec fabric8-planner-builder -c bash "npm run build"
docker exec fabric8-planner-builder -c bash "cd dist && npm link"

docker exec fabric8-planner-builder -c bash "cd runtime && npm install"
docker exec fabric8-planner-builder -c bash "cd runtime/node_modules/fabric8-planner && npm link dist"

docker exec fabric8-planner-builder -c bash  "cd runtime npm run build"
docker exec -u root fabric8-planner-builder cp -r /home/fabric8/fabric8-planner/dist /

## All ok, deploy
docker build -t almighty-ui-deploy -f deploy/Dockerfile.deploy .

TAG=$(echo $GIT_COMMIT | cut -c1-6)

docker tag almighty-ui-deploy registry.devshift.net/almighty/almighty-ui:$TAG
docker push registry.devshift.net/almighty/almighty-ui:$TAG

docker tag almighty-ui-deploy registry.devshift.net/almighty/almighty-ui:latest
docker push registry.devshift.net/almighty/almighty-ui:latest
