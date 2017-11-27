"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isDescendent = exports.isDescendent = function isDescendent(childNode, parentNode) {
  if (!childNode || !parentNode) {
    return false;
  }

  for (var node = childNode; node; node = node.parentNode) {
    if (parentNode === node) {
      return true;
    }
  }

  return false;
};
//# sourceMappingURL=dom.js.map