#!/usr/bin/env bash

# Example: ./upload.sh assets/bla/controller.png

set -e

. lib.sh

EXPECTED_ARGS=1

if [ $# -ne ${EXPECTED_ARGS} ]; then
  echo "Unexpected number of args -- expected ${EXPECTED_ARGS} -- ($#) ($@)" >&2
  exit -1
fi

FILE_PATH=$1

set -x

curl --fail \
  -X POST \
  ${BASE_URI} \
  -F "file_path=${FILE_PATH}" \
  -F "file=@${FILE_PATH}"

set +x

echo
