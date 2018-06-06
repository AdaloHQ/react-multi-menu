"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ROW_HEIGHT = 26;
var SPACER_HEIGHT = 21;
var MENU_PAD = 8;

var getMenuHeight = exports.getMenuHeight = function getMenuHeight(options) {
  return getMenuItemOffset(options, options.length) + MENU_PAD;
};

var getMenuItemOffset = exports.getMenuItemOffset = function getMenuItemOffset(options, index) {
  var offset = MENU_PAD;

  for (var i = 0; i < index; i += 1) {
    var option = options[i];

    if (option && option.label) {
      offset += ROW_HEIGHT;
    } else {
      offset += SPACER_HEIGHT;
    }
  }

  return offset;
};
//# sourceMappingURL=sizing.js.map