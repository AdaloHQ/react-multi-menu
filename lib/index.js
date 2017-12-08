'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MultiMenuTrigger = exports.MenuItem = exports.MenuSpacer = exports.MultiMenu = exports.MultiMenuWrapper = exports.matches = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactDocumentEvents = require('react-document-events');

var _reactDocumentEvents2 = _interopRequireDefault(_reactDocumentEvents);

var _dom = require('./dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LEFT = 'left';
var RIGHT = 'right';
var ESC = 27;

var matches = exports.matches = function matches(openPath, path) {
  for (var i = 0; i < path.length; i += 1) {
    if (openPath[i] !== path[i]) {
      return false;
    }
  }

  return true;
};

var stopPropagation = function stopPropagation(e) {
  e.stopPropagation();
};

var getByValue = function getByValue(options, value) {
  var comparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (!comparator) {
    comparator = function comparator(a, b) {
      return a === b;
    };
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var opt = _step.value;

      if (!opt || !value) {
        continue;
      }

      if (comparator(opt.value, value)) {
        return opt;
      }

      if (opt.children) {
        var childResult = getByValue(opt.children, value);

        if (childResult) {
          return childResult;
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

var MultiSelectMenu = function (_Component) {
  _inherits(MultiSelectMenu, _Component);

  function MultiSelectMenu() {
    _classCallCheck(this, MultiSelectMenu);

    return _possibleConstructorReturn(this, (MultiSelectMenu.__proto__ || Object.getPrototypeOf(MultiSelectMenu)).apply(this, arguments));
  }

  _createClass(MultiSelectMenu, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          comparator = _props.comparator,
          dark = _props.dark,
          onChange = _props.onChange,
          options = _props.options,
          placeholder = _props.placeholder,
          value = _props.value;


      var selectedOption = getByValue(options, value, comparator);

      var label = selectedOption ? selectedOption.label : _react2.default.createElement(
        'span',
        { className: 'multi-select-menu-placeholder' },
        placeholder
      );

      return _react2.default.createElement(
        MultiMenuTrigger,
        {
          fitParent: true,
          className: 'multi-select-menu',
          dark: dark,
          menu: options,
          onSelect: onChange
        },
        _react2.default.createElement(
          'div',
          { className: 'multi-select-menu-selection' },
          _react2.default.createElement(
            'span',
            { className: 'multi-select-menu-value' },
            label
          ),
          _react2.default.createElement('span', { className: 'multi-select-menu-expand-icon' })
        )
      );
    }
  }]);

  return MultiSelectMenu;
}(_react.Component);

MultiSelectMenu.defaultProps = {
  placeholder: 'Select...'
};
exports.default = MultiSelectMenu;

var MultiMenuWrapper = exports.MultiMenuWrapper = function (_Component2) {
  _inherits(MultiMenuWrapper, _Component2);

  function MultiMenuWrapper(props) {
    _classCallCheck(this, MultiMenuWrapper);

    var _this2 = _possibleConstructorReturn(this, (MultiMenuWrapper.__proto__ || Object.getPrototypeOf(MultiMenuWrapper)).call(this, props));

    _this2.handleHover = function (openPath) {
      _this2.setState({ openPath: openPath });
    };

    _this2.state = {
      openPath: []
    };
    return _this2;
  }

  _createClass(MultiMenuWrapper, [{
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          align = _props2.align,
          expandDirection = _props2.expandDirection,
          isSubMenu = _props2.isSubMenu,
          menu = _props2.menu,
          onSelect = _props2.onSelect,
          position = _props2.position;
      var openPath = this.state.openPath;


      if (!position) {
        position = {};
      }

      return _react2.default.createElement(
        'div',
        {
          className: (0, _classnames2.default)('multi-menu-wrapper', 'expand-' + expandDirection),
          style: position
        },
        _react2.default.createElement(MultiMenu, _extends({ isSubMenu: isSubMenu, onSelect: onSelect }, {
          basePath: [],
          menu: menu,
          openPath: openPath,
          width: position.width,
          onHover: this.handleHover
        }))
      );
    }
  }]);

  return MultiMenuWrapper;
}(_react.Component);

MultiMenuWrapper.defaultProps = {
  expandDirection: RIGHT
};

var MultiMenu = exports.MultiMenu = function (_Component3) {
  _inherits(MultiMenu, _Component3);

  function MultiMenu() {
    _classCallCheck(this, MultiMenu);

    return _possibleConstructorReturn(this, (MultiMenu.__proto__ || Object.getPrototypeOf(MultiMenu)).apply(this, arguments));
  }

  _createClass(MultiMenu, [{
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          basePath = _props3.basePath,
          isSubMenu = _props3.isSubMenu,
          menu = _props3.menu,
          onHover = _props3.onHover,
          onSelect = _props3.onSelect,
          openPath = _props3.openPath,
          width = _props3.width;


      var styles = { width: width };

      return _react2.default.createElement(
        'div',
        { className: 'multi-menu', style: styles },
        menu.map(function (itm, i) {
          return _react2.default.createElement(MenuItem, {
            key: i,
            data: itm,
            onHover: onHover,
            onSelect: onSelect,
            openPath: openPath,
            path: basePath.concat([i])
          });
        })
      );
    }
  }]);

  return MultiMenu;
}(_react.Component);

var MenuSpacer = exports.MenuSpacer = function MenuSpacer() {
  return _react2.default.createElement('div', { className: 'multi-menu-spacer' });
};

var MenuItem = exports.MenuItem = function (_Component4) {
  _inherits(MenuItem, _Component4);

  function MenuItem() {
    var _ref;

    var _temp, _this4, _ret;

    _classCallCheck(this, MenuItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this4 = _possibleConstructorReturn(this, (_ref = MenuItem.__proto__ || Object.getPrototypeOf(MenuItem)).call.apply(_ref, [this].concat(args))), _this4), _this4.handleClick = function (e) {
      var _this4$props = _this4.props,
          value = _this4$props.data.value,
          onSelect = _this4$props.onSelect;


      if (!onSelect) {
        return;
      }

      onSelect(value);
    }, _this4.handleHover = function (e) {
      var _this4$props2 = _this4.props,
          data = _this4$props2.data,
          path = _this4$props2.path,
          onHover = _this4$props2.onHover;


      e.stopPropagation();

      if (data && data.children && data.children.length) {
        onHover(path);
      } else {
        onHover(path.slice(0, path.length - 1));
      }
    }, _temp), _possibleConstructorReturn(_this4, _ret);
  }

  _createClass(MenuItem, [{
    key: 'render',
    value: function render() {
      var _props4 = this.props,
          data = _props4.data,
          path = _props4.path,
          onHover = _props4.onHover,
          onSelect = _props4.onSelect,
          openPath = _props4.openPath;


      if (data === null) {
        return _react2.default.createElement(MenuSpacer, null);
      }

      var open = matches(openPath, path);
      var hasChildren = data.children && data.children.length > 0;

      return _react2.default.createElement(
        'div',
        {
          className: (0, _classnames2.default)('multi-menu-item', { open: open, 'has-children': hasChildren }),
          onMouseOver: this.handleHover
        },
        _react2.default.createElement(
          'div',
          {
            className: 'multi-menu-item-label',
            onClick: this.handleClick,
            title: data.label
          },
          data.label
        ),
        open && hasChildren ? _react2.default.createElement(
          'div',
          {
            className: 'multi-menu-child',
            onMouseOver: stopPropagation
          },
          _react2.default.createElement(MultiMenu, {
            basePath: path,
            menu: data.children,
            onHover: onHover,
            onSelect: onSelect,
            openPath: openPath
          })
        ) : null
      );
    }
  }]);

  return MenuItem;
}(_react.Component);

var MultiMenuTrigger = exports.MultiMenuTrigger = function (_Component5) {
  _inherits(MultiMenuTrigger, _Component5);

  function MultiMenuTrigger() {
    var _ref2;

    var _temp2, _this5, _ret2;

    _classCallCheck(this, MultiMenuTrigger);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this5 = _possibleConstructorReturn(this, (_ref2 = MultiMenuTrigger.__proto__ || Object.getPrototypeOf(MultiMenuTrigger)).call.apply(_ref2, [this].concat(args))), _this5), _this5.state = { expanded: false, position: null, expandDirection: null }, _this5.handleClick = function (e) {
      if (_this5.state.expanded) {
        return _this5.setState({ expanded: false });
      }

      var fitParent = _this5.props.fitParent;


      var position = _this5.state.position;
      var expandDirection = RIGHT;

      if (_this5.element) {
        var rect = _this5.element.getBoundingClientRect();
        var windowWidth = window.innerWidth;

        var center = (rect.left + rect.right) / 2;

        if (center * 2 > windowWidth) {
          expandDirection = LEFT;
        }

        position = { top: rect.bottom + 8 };
        var menuWidth = 180;

        if (fitParent) {
          position = { top: rect.bottom, left: rect.left, width: rect.width };
        } else if (center - menuWidth / 2 < 20) {
          position.left = rect.left;
        } else if (center + menuWidth / 2 > windowWidth - 20) {
          position.left = rect.right - menuWidth;
        } else {
          position.left = center - menuWidth / 2;
        }
      }

      _this5.setState({ position: position, expandDirection: expandDirection, expanded: true });
    }, _this5.handleSelect = function (val) {
      var onSelect = _this5.props.onSelect;


      _this5.setState({ expanded: false });

      if (onSelect) {
        onSelect(val);
      }
    }, _this5.handleClickOutside = function (e) {
      if ((0, _dom.isDescendent)(e.target, _this5.element)) {
        return;
      }

      _this5.setState({ expanded: false });
    }, _this5.handleClose = function () {
      _this5.setState({ expanded: false });
    }, _this5.handleScroll = function (e) {
      e.preventDefault();
    }, _this5.handleKeyDown = function (e) {
      if (e.which === ESC) {
        _this5.setState({ expanded: false });
      }
    }, _this5.handleBlur = function () {
      _this5.setState({ expanded: false });
    }, _this5.elementRef = function (el) {
      return _this5.element = el;
    }, _temp2), _possibleConstructorReturn(_this5, _ret2);
  }

  _createClass(MultiMenuTrigger, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      window.addEventListener('blur', this.handleBlur);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('blur', this.handleBlur);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props5 = this.props,
          children = _props5.children,
          className = _props5.className,
          dark = _props5.dark,
          menu = _props5.menu;
      var _state = this.state,
          expandDirection = _state.expandDirection,
          expanded = _state.expanded,
          position = _state.position;


      return _react2.default.createElement(
        'div',
        {
          className: (0, _classnames2.default)('multi-menu-trigger', className, { expanded: expanded, 'multi-menu-dark': dark }),
          ref: this.elementRef
        },
        expanded ? _react2.default.createElement('div', {
          className: 'multi-menu-trigger-close',
          onMouseDown: this.handleClose
        }) : null,
        expanded ? _react2.default.createElement(_reactDocumentEvents2.default, {
          onMouseDown: this.handleClickOutside,
          onWheel: this.handleScroll,
          onKeyDown: this.handleKeyDown
        }) : null,
        expanded ? _react2.default.createElement(MultiMenuWrapper, {
          expandDirection: expandDirection,
          menu: menu,
          onSelect: this.handleSelect,
          position: position
        }) : null,
        _react2.default.createElement(
          'div',
          { className: 'multi-menu-trigger-element', onMouseDown: this.handleClick },
          children
        )
      );
    }
  }]);

  return MultiMenuTrigger;
}(_react.Component);
//# sourceMappingURL=index.js.map