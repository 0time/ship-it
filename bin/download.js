#!/usr/bin/env node

const fse = require('fs-extra');
const rp = require('request-promise');
const sha256 = require('sha256');
const tar = require('tar');
const Promise = require('bluebird');

const fname = 'assets.tar.gz';
const etagFile = `${fname}.etag`;
const uri = 'https://phaser.0ti.me/tgz';

const status200Handler = response =>
  Promise.resolve(response)
    .tap(saveEtag)
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

const status304Handler = response =>
  Promise.resolve(response)
    .tap(ensure304OrReject)
    .then(ensureFileLengthMatches)
    .then(ensureShaMatchesEtag)
    .then(() => ({response}));

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
const saveEtag = response => {
  if (response.statusCode === 304) return response;

  const etag = response.headers.etag;

  return fse.writeFile(etagFile, etag).then(() => response);
};

const ensureFileLengthMatches = response => {
  if (response.statusCode === 304) return response;

  const {body, headers} = response;
  const fileLength = headers['x-file-length'];

  if (`${body.length}` !== fileLength) {
    throw new Error(
      `body length (${body.length}) did not match file length (${fileLength})`,
    );
  }

  return response;
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

const ensure304OrReject = response =>
  response.statusCode === 304
    ? Promise.resolve(response)
    : Promise.reject(response);

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
  fse
    .readFile(etagFilename)
    .then(etagBuffer => etagBuffer.toString())
    .catch(() => undefined); // default to an etag of undefined

const main = () =>
  loadSavedEtag()
    // Build the request options
    .then(constructRequestOptions)
    // Make the request
    .then(rp)
    // Always resolve, let responseHandler decide next
    .catch(response => response)
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
