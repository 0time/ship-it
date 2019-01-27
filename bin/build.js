#!/usr/bin/env node

const build = require('./lib/build');

const {
  build: {inputFile, bundleFile, minifiedFile},
} = require('../config');

build(inputFile, bundleFile, minifiedFile)
  .then(({bundleJs, bundleMinJs, file, version}) => {
    console.error(`
Your version ${version} tar.gz package can be found at ${process.cwd()}/${file}

Your minified bundle file can be found at ${process.cwd()}/${bundleMinJs}.
Your bundle file can be found at ${process.cwd()}/${bundleJs}.

To deploy and see instructions for playing the deployed instance, run:
  yarn deploy

To start, run:
  yarn start
`);
  })
  .then(() => 0)
  .catch(err => {
    console.error(err);

    return -1;
  })
  .then(process.exit);
