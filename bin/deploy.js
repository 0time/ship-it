#!/usr/bin/env node

const Promise = require('bluebird');
const b = require('browserify')();
const fs = require('fs');
const fse = require('fs-extra');
const minify = require('minify');
const path = require('path');
const rp = require('request-promise');
const sha256 = require('sha256');
const tar = require('tar');

const build = require('./lib/build');
const {logResponse} = require('./lib/http');
const packageJson = require('../package.json');

const paths = ['assets/final', 'index.html', 'package.json'];

const {
  build: {inputFile, bundleFile, minifiedFile},
} = require('../config');

const {version} = packageJson;

const uri = 'https://phaser.0ti.me/deploy';

const constructRequestOptions = ({
  checksum,
  checksum_method,
  file,
  version,
}) => ({
  formData: {
    checksum,
    checksum_method,
    context: 'ship-it',
    file: {
      value: fs.createReadStream(file),
      options: {
        filename: path.basename(file),
      },
    },
    version,
  },
  json: true,
  method: 'POST',
  qs: {
    context: 'ship-it',
  },
  resolveWithFullResponse: true,
  uri,
});

build(inputFile, bundleFile, minifiedFile)
  .tap(({bundleMinJs, file}) =>
    tar.c(
      {
        file,
      },
      paths.concat([bundleMinJs]),
    ),
  )
  .then(result =>
    Promise.props(
      Object.assign(
        {
          fileContents: fse.readFile(result.bundleJs),
        },
        result,
      ),
    ),
  )
  .then(result =>
    Promise.props(
      Object.assign(
        {
          checksum: sha256(result.fileContents),
          checksum_method: 'sha256',
          file_size: result.fileContents.length,
        },
        result,
      ),
    ),
  )
  .then(constructRequestOptions)
  .then(rp)
  .then(logResponse)
  .then(() => 0)
  .catch(err => {
    console.error(err);

    return -1;
  })
  .then(process.exit);
