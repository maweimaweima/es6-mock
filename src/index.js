const path = require('path');
const Mock = require('mockjs');
const miniRequire = require('./mini-require');

/**
 * 中间件mock
 * @param dir
 * @param urlPath
 * @returns {(function(*, *, *): void)|*}
 */
module.exports = function ({ dir, path: urlPath }) {
  return function (request, response, next) {
    if (request.path.indexOf(urlPath) === 0) {
      const file = path.join('/', dir, `${
        request.path.replace(urlPath, '')
          .replace(/\.\w+/, '')
          .replace(/\/$/, '')}`);

      try {
        global.__request = request;
        global.__response = response;
        const content = miniRequire(file);

        response.json(Mock.mock(content || {}));
      } catch (e) {
        response.status(404).send(e.message);
      }
    } else {
      next();
    }
  };
};

