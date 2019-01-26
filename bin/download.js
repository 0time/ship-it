#!/usr/bin/env node

const fse = require('fs-extra');
const rp = require('request-promise');
const sha256 = require('sha256');
const tar = require('tar');
const Promise = require('bluebird');

const fname = 'assets.tar.gz';
const etagFile = `${fname}.etag`;
const uri = 'https://phaser.0ti.me/tgz';

const writeTarGz = response => {
  if (response.statusCode === 304) return fname;

  return fse.writeFile(fname, Buffer.from(response.body)).then(() => fname);
};
const saveEtag = response => {
  if (response.statusCode === 304) return response;

  const etag = response.headers.etag;

  return fse.writeFile(etagFile, etag).then(() => response);
};

const checkFileLength = response => {
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

const checkShaAgainstEtag = response => {
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

const main = () =>
  Promise.resolve(etagFile)
    .then(fse.readFile)
    .then(etagBuffer => etagBuffer.toString())
    .catch(() => undefined) // default to an etag of undefined
    .then(etag => ({
      encoding: null,
      headers: {
        'If-None-Match': etag,
      },
      qs: {
        paths: ['assets', 'test2'].join(','),
      },
      resolveWithFullResponse: true,
      uri,
    }))
    .then(rp)
    .catch(ensure304OrReject)
    .then(checkFileLength)
    .then(checkShaAgainstEtag)
    .catch(err => Promise.reject(err.body || err))
    .tap(saveEtag)
    .then(writeTarGz)
    .then(file =>
      tar.x({
        file,
      }),
    )
    .catch(err => {
      console.error(err);

      process.exit(-1);
    });

main();
