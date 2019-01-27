const Promise = require('bluebird');
const fse = require('fs-extra');
const rp = require('request-promise');
const sha256 = require('sha256');

const uri = 'https://phaser.0ti.me/check';

const constructRequestOptions = (checksum_method, file) => checksum => ({
  json: true,
  qs: {
    checksum,
    checksum_method,
    file,
  },
  resolveWithFullResponse: true,
  uri,
});

// resolves true if the checksums match or false if they do not match
const checkHttpUpload = file =>
  Promise.resolve(file)
    .then(fse.readFile)
    .then(sha256)
    .then(constructRequestOptions('sha256', file))
    .tap(console.error)
    .then(rp)
    .then(({body: {match}}) => match);

module.exports = checkHttpUpload;
