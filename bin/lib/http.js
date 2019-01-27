const Promise = require('bluebird');
const fse = require('fs-extra');
const sha256 = require('sha256');

const MAX_BODY_LENGTH = 10000;

const generateEtagError = (response, reason) =>
  new Error(
    `Unable to verify etag (${response.headers.etag}) with x-etag-fn (${
      response.headers['x-etag-fn']
    }) - ${reason}`,
  );

const logBodyLength = ({body}) =>
  console.error(`Body Length: ${body && body.length}`);

const logResponse = ({body, statusCode}) =>
  console.error({
    body:
      body.length > MAX_BODY_LENGTH
        ? `body too long (${body.length} > ${MAX_BODY_LENGTH})`
        : body,
    bodyLength: body.length,
    statusCode,
  });

const logStatusCode = ({statusCode}) => console.error(`Status: ${statusCode}`);

const saveEtag = etagFile => response => {
  if (response.statusCode === 304) return response;

  const etag = response.headers.etag;

  return Promise.resolve(response).tap(() => fse.writeFile(etagFile, etag));
};

const verifyEtag = response => {
  const etagFn = response.headers['x-etag-fn'];
  const etag = response.headers.etag;

  switch (etagFn) {
    case 'sha256':
      if (sha256(response.body) !== etag) {
        throw generateEtagError(response, 'did not match');
      }

      break;
    default:
      throw generateEtagError(response, 'unsupported');

      break;
  }
};

const verifyXFileLengthHeader = response =>
  Promise.resolve(response).tap(({body, headers}) => {
    const fileLength = headers['x-file-length'];

    if (`${body.length}` !== fileLength) {
      throw new Error(
        `body length (${
          body.length
        }) did not match file length (${fileLength})`,
      );
    }
  });

module.exports = {
  logBodyLength,
  logResponse,
  logStatusCode,
  saveEtag,
  verifyEtag,
  verifyXFileLengthHeader,
};
