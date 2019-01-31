const Promise = require('bluebird');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const rp = require('request-promise');
const sha256 = require('sha256');

const context = 'ship-it';
const uri = 'https://phaser.0ti.me/upload';

const constructRequestOptions = ({
  checksum,
  checksum_method,
  file,
  fileContents,
}) => ({
  formData: {
    checksum,
    checksum_method,
    context,
    file: {
      value: fs.createReadStream(file),
      options: {
        filename: path.basename(file),
      },
    },
    file_path: file,
  },
  json: true,
  method: 'POST',
  qs: {
    checksum,
    checksum_method,
    context,
    file,
  },
  resolveWithFullResponse: true,
  uri,
});

const httpUpload = file =>
  Promise.resolve(file)
    .then(file =>
      Promise.props({
        file,
        fileContents: fse.readFile(file),
      }),
    )
    .then(({file, fileContents}) => ({
      file,
      fileContents,
      checksum: sha256(fileContents),
      checksum_method: 'sha256',
    }))
    .then(constructRequestOptions)
    .then(rp);

module.exports = httpUpload;
