'use strict';

function extractUuid (uriBase, uri) {
  if (!uri.startsWith(uriBase)) {
    return null;
  }
  const uuid = uri.slice(uriBase.length);
  return uuid.toLowerCase();
}
exports.extractUuid = extractUuid;
