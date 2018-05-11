#!/bin/sh

verify_environment() {
  if [[ $(node -v | grep -q "v9" ; echo $?) -gt 0 ]];
  then
    echo "not node 9"
    exit 0
  fi
}

run_cron() {
  for f in extensions/exchanges/*/update-products.sh;
  do
    echo "processing ${f}"
    ./${f}
  done
}

upload_files() {
  git add .
  git commit --message "Exchanges: update-products $TRAVIS_BUILD_NUMBER"
  git push upstream unstable
}

verify_environment
setup_git
run_cron
upload_files
