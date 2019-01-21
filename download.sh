#!/usr/bin/env bash

# Example: ./upload.sh assets/bla/controller.png

set -e

. lib.sh

EXPECTED_ARGS=0

if [ $# -ne ${EXPECTED_ARGS} ]; then
  echo "Unexpected number of args -- expected ${EXPECTED_ARGS} -- ($#) ($@)" >&2

  exit -1
fi

OUTPUT_TAR_GZ=assets.tar.gz

set -x

curl ${BASE_URI} \
  --output ${OUTPUT_TAR_GZ}

tar -xf ${OUTPUT_TAR_GZ} && rm ${OUTPUT_TAR_GZ}

set +x

echo
