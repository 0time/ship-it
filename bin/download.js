#!/usr/bin/env node

const fse = require('fs-extra');
const rp = require('request-promise');
const tar = require('tar');
const Promise = require('bluebird');

const fname = 'assets.tar.gz';
const etagFile = `${fname}.etag`;
const uri = 'https://phaser.0ti.me';

const saveEtag = ({headers: {etag}}) => fse.writeFile(etagFile, etag);

const check304 = response => {
  console.error(response.statusCode);
  console.error(response.headers);

  if (response.statusCode === 304) {
    console.error('304 not modified');

    process.exit(0);
  }

  return Promise.reject(response);
};

const main = () =>
  Promise.resolve(etagFile)
    .then(fse.readFile)
    .then(etagBuffer => etagBuffer.toString())
    .catch(() => undefined) // default to an etag of undefined
    .then(etag => ({
      headers: {
        'If-None-Match': etag,
      },
      resolveWithFullResponse: true,
      uri,
    }))
    .tap(console.error)
    .then(rp)
    .catch(err => Promise.reject(err.body || err))
    .catch(check304)
    .tap(saveEtag)
    .then(({body}) => fse.writeFile(fname, body))
    .then(() => tar.x(fname))
    .catch(err => {
      console.error(err);

      process.exit(-1);
    });

main();
