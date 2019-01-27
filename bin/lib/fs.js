const fse = require('fs-extra');
const path = require('path');

const copyRecursive = destination => fileOrFolder =>
  Promise.resolve(fileOrFolder)
    .then(fse.stat)
    .tap(stats => {
      if (stats.isDirectory()) {
        return Promise.resolve(fileOrFolder)
          .tap(folder => console.error(path.resolve(destination, folder)))
          .tap(folder => mkdir_p(path.resolve(destination, folder)))
          .then(fse.readdir)
          .then(list => list.map(listItem => path.join(fileOrFolder, listItem)))
          .then(list => Promise.all(list.map(copyRecursive(destination))));
      } else if (stats.isFile()) {
        return Promise.resolve(fileOrFolder).then(
          fse.copyFile(
            path.resolve(fileOrFolder),
            path.resolve(destination, fileOrFolder),
          ),
        );
      }

      return null;
    });

const mkdir_p = dir =>
  fse
    .stat(dir)
    .catch(() => mkdir_p(path.dirname(dir)))
    .then(stats => (stats && stats.isDirectory ? null : fse.mkdir(dir)));

module.exports = {
  copyRecursive,
  mkdir_p,
};
