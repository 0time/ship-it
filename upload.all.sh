#!/usr/bin/env bash

set -e

find assets -type f | while read line; do
  bash ./upload.sh "$line"
done
