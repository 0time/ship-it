#!/usr/bin/env node

const fse = require('fs-extra');
const rp = require('request-promise');
const sha256 = require('sha256');
const tar = require('tar');
const Promise = require('bluebird');

const fname = 'assets.tar.gz';
const etagFile = `${fname}.etag`;
const uri = 'https://phaser.0ti.me/tgz';

const {
  logBodyLength,
  logStatusCode,
  saveEtag,
  verifyEtag,
  verifyXFileLengthHeader,
} = require('./lib/http');

const status200Handler = response =>
  Promise.resolve(response)
    .tap(verifyXFileLengthHeader)
    .tap(verifyEtag)
    .tap(saveEtag(etagFile))
    .then(writeTarGz)
    .tap(file =>
      tar.x({
        file,
      }),
    )
    .then(file => ({
      file,
      response,
    }));

const status304Handler = response => Promise.resolve(response);

const otherStatusHandler = response => Promise.reject(response);

const responseHandlerMap = {
  200: status200Handler,
  304: status304Handler,
  default: otherStatusHandler,
};

const responseHandler = response =>
  (responseHandlerMap[response.statusCode] || responseHandler.default)(
    response,
  );

const writeTarGz = response => {
  if (response.statusCode === 304) return fname;

  return fse.writeFile(fname, Buffer.from(response.body)).then(() => fname);
};

const ensureShaMatchesEtag = response => {
  if (response.statusCode === 304) return response;

  const {body, headers} = response;

  const sha = sha256(body);

  console.error(`sha ? etag | ${sha} ? ${headers.etag}`);

  if (sha !== headers.etag) {
    const err = new Error(`sha !== etag | ${sha} !== ${headers.etag}`);

    throw err;
  }

  return response;
};

const constructRequestOptions = etag => ({
  encoding: null,
  headers: {
    'If-None-Match': etag,
  },
  qs: {
    paths: ['assets'].join(','),
  },
  resolveWithFullResponse: true,
  uri,
});

const loadSavedEtag = etagFilename =>
  Promise.resolve(etagFilename)
    .then(fse.readFile)
    .then(etagBuffer => etagBuffer.toString())
    .catch(() => undefined); // default to an etag of undefined

const main = () =>
  loadSavedEtag(etagFile)
    // Build the request options
    .then(constructRequestOptions)
    // Make the request
    .then(rp)
    // Always resolve, let responseHandler decide next
    .catch(response => response)
    // Print some useful information
    .tap(logStatusCode)
    .tap(logBodyLength)
    .then(responseHandler)
    // If rejection has a body, reject with body, otherwise reject with rejection
    .catch(rejection => Promise.reject(rejection.body || rejection))
    // If no error, return a zero error code
    .then(() => 0)
    // Log and return a non-zero error code
    .catch(err => {
      console.error(err);

      return -1;
    })
    // exit with the error code
    .then(code => process.exit(code));

main();
