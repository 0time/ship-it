#!/usr/bin/env node

const Promise = require('bluebird');
const fse = require('fs-extra');
const path = require('path');
const rp = require('request-promise');

const check = require('./lib/check.http.upload');
const paths = ['assets'];
const upload = require('./lib/upload.http.upload');
const uri = 'https://phaser.0ti.me/';

const flatteningReducer = (acc, itm) =>
  Array.isArray(itm) ? acc.concat(itm) : acc.concat([itm]);

const find = fileOrFolder =>
  fse.stat(fileOrFolder).then(stats => {
    if (stats.isDirectory()) {
      // Return the set of files
      return fse
        .readdir(fileOrFolder)
        .then(files => files.map(basepath => path.join(fileOrFolder, basepath)))
        .then(filesOrFolders => Promise.all(filesOrFolders.map(find)))
        .then(filesOrFolders => filesOrFolders.reduce(flatteningReducer, []));
    } else if (stats.isFile()) {
      // Just return the file
      return fileOrFolder;
    } else {
      // Ignore
    }
  });

Promise.resolve()
  .then(() => Promise.all(paths.map(find)))
  .tap(console.error)
  .then(fileArrays => fileArrays.reduce(flatteningReducer, []))
  .then(files =>
    Promise.all(
      files.map(file =>
        check(file).then(match => {
          const message = `${match ? 'not' : ''} uploading file ${file}`;

          console.error(message);

          if (!match) {
            return upload(file);
          }

          return null;
        }),
      ),
    ),
  )
  .then(results =>
    console.error(
      results.reduce(
        (acc, itm) => ({
          uploads: acc.uploads + (itm !== null ? 1 : 0),
          skips: acc.skips + (itm === null ? 1 : 0),
        }),
        {uploads: 0, skips: 0},
      ),
    ),
  )
  .then(() => 0)
  .catch(err => {
    console.error(err);

    return -1;
  })
  .then(process.exit);

/*
Promise.resolve(minimist(process.argv.slice(2)))
  .then(args =>
    Object.assign({}, args, {
      files: args.files.split(','),
    }),
  )
  .tap(console.error)
  .tap(({files}) =>
    files.map(file => rp({
      method: 'POST',
      uri,
    })))
  .then(() => 0)
  .catch(err => {
    console.error(err);

    return -5;
  })
  .then(process.exit);
  */
