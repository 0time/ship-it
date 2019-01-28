const Promise = require('bluebird');
const browserify = require('browserify');
const fs = require('fs');
const fse = require('fs-extra');
const minify = require('minify');

const packageJson = require('../../package.json');

const {version} = packageJson;

const build = (inputFile, outputFile, outputMinifiedFile) =>
  Promise.resolve(browserify())
    .tap(b => b.add(inputFile))
    .then(b => ({
      b,
      bundleJs: outputFile,
      bundleMinJs: outputMinifiedFile,
      file: `deploy.${version}.tar.gz`,
      version,
      ws: fs.createWriteStream(outputFile),
    }))
    .tap(
      ({b, ws}) =>
        new Promise((resolve, reject) => {
          const pipe = b.bundle().pipe(ws);

          let errored = false;

          pipe.on('error', err => {
            errored = true;

            ws.destroy();

            reject(err);
          });

          pipe.on('finish', () => {
            if (!errored) {
              ws.destroy();

              resolve();
            }
          });
        }),
    )
    .tap(({bundleJs, bundleMinJs}) =>
      bundleMinJs
        ? minify(bundleJs).then(minified =>
            fse.writeFile(bundleMinJs, minified),
          )
        : null,
    );

module.exports = build;
