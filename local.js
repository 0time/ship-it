const Promise = require('bluebird');
const build = require('./bin/lib/build');
const express = require('express');
const fs = require('fs');
const fse = require('fs-extra');
const nodeWatch = require('node-watch');
const path = require('path');

const {
  build: {bundleFile, minifiedFile, inputFile},
  expressPort,
} = require('./config');

const app = express();

app.use(express.static('.'));

app.listen(expressPort, err => {
  if (err) console.error(err) || process.exit(-1);
  else
    console.error(`
Navigate to http://127.0.0.1:${expressPort} to play!

Your changes will automatically take effect after a short time to build them.
`);
});

let enableWatchEvents = true;
let timeout = null;

const tmpBundleFile = `tmp.${bundleFile}`;
const tmpMinifiedFile = `tmp.${minifiedFile}`;

const ignore = [
  tmpBundleFile,
  tmpMinifiedFile,
  bundleFile,
  minifiedFile,
  '.git',
  'test',
];

const watchEvents = [];

const check = () => {
  const localEvents = [];

  // drain the events
  while (watchEvents.length > 0) {
    localEvents.push(watchEvents.pop());
  }

  return rebuild(
    localEvents.find(({filename}) => {
      try {
        return fs.statSync(filename).isFile() && !ignore.includes(filename);
      } catch (ex) {
        return false;
      }
    }),
  );
};

const rebuild = e => {
  if (!e || !e.filename) return;

  process.stderr.write(`Detected changes to file ${e.filename}`);

  const start = Date.now();

  enableWatchEvents = false;

  return build(inputFile, tmpMinifiedFile, false)
    .then(({bundleJs, bundleMinJs}) => fse.rename(bundleJs, minifiedFile))
    .then(() => {
      enableWatchEvents = true;

      const end = Date.now();

      process.stderr.write(
        ` -- rebuilt in ${(end - start) / 1000.0} seconds\n`,
      );
    })
    .catch(err => {
      enableWatchEvents = true;

      const end = Date.now();

      process.stderr.write(` -- failed in ${(end - start) / 1000.0} seconds\n`);
    });
};

const oneIncludesTheOther = (a, b) => a.includes(b) || b.includes(a);

const isIgnored = filename =>
  ignore.find(each => oneIncludesTheOther(each, filename)) !== undefined;

nodeWatch('./', {recursive: true}, (eventType, filename) => {
  if (filename === 'local.js') {
    console.error('You must restart me!');

    process.exit(0);
  }

  if (enableWatchEvents && !isIgnored(filename)) {
    watchEvents.push({eventType, filename});

    setTimeout(check, 200);
  }
});
