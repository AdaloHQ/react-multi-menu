"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var DEFAULT_ROW_HEIGHT = exports.DEFAULT_ROW_HEIGHT = 26;
var SPACER_HEIGHT = exports.SPACER_HEIGHT = 21;
var MENU_PAD = exports.MENU_PAD = 8;

var getMenuHeight = exports.getMenuHeight = function getMenuHeight(options, rowHeight) {
  return getMenuItemOffset(options, options.length, rowHeight) + MENU_PAD;
};

var getMenuItemOffset = exports.getMenuItemOffset = function getMenuItemOffset(options, index, rowHeight) {
  var offset = MENU_PAD;
  rowHeight = rowHeight || DEFAULT_ROW_HEIGHT;

  for (var i = 0; i < index; i += 1) {
    var option = options[i];

    if (option && option.label) {
      offset += rowHeight;
    } else {
      offset += SPACER_HEIGHT;
    }
  }

  return offset;
};
//# sourceMappingURL=sizing.js.map