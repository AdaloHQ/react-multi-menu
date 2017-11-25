'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MultiMenuTrigger = exports.MenuItem = exports.MultiMenu = exports.matches = exports.ALIGN_RIGHT = exports.ALIGN_CENTER = exports.ALIGN_LEFT = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ALIGN_LEFT = exports.ALIGN_LEFT = 'align-left';
var ALIGN_CENTER = exports.ALIGN_CENTER = 'align-center';
var ALIGN_RIGHT = exports.ALIGN_RIGHT = 'align-right';

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

var MultiMenuWrapper = function (_Component) {
  _inherits(MultiMenuWrapper, _Component);

  function MultiMenuWrapper(props) {
    _classCallCheck(this, MultiMenuWrapper);

    var _this = _possibleConstructorReturn(this, (MultiMenuWrapper.__proto__ || Object.getPrototypeOf(MultiMenuWrapper)).call(this, props));

    _this.handleHover = function (openPath) {
      _this.setState({ openPath: openPath });
    };

    _this.state = {
      openPath: []
    };
    return _this;
  }

  _createClass(MultiMenuWrapper, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          align = _props.align,
          isSubMenu = _props.isSubMenu,
          menu = _props.menu,
          position = _props.position,
          onSelect = _props.onSelect;
      var openPath = this.state.openPath;


      return _react2.default.createElement(
        'div',
        { className: 'multi-menu-wrapper' },
        _react2.default.createElement(MultiMenu, _extends({ isSubMenu: isSubMenu, onSelect: onSelect }, {
          basePath: [],
          menu: menu,
          openPath: openPath,
          onHover: this.handleHover
        }))
      );
    }
  }]);

  return MultiMenuWrapper;
}(_react.Component);

exports.default = MultiMenuWrapper;

var MultiMenu = exports.MultiMenu = function (_Component2) {
  _inherits(MultiMenu, _Component2);

  function MultiMenu() {
    _classCallCheck(this, MultiMenu);

    return _possibleConstructorReturn(this, (MultiMenu.__proto__ || Object.getPrototypeOf(MultiMenu)).apply(this, arguments));
  }

  _createClass(MultiMenu, [{
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          basePath = _props2.basePath,
          isSubMenu = _props2.isSubMenu,
          menu = _props2.menu,
          onHover = _props2.onHover,
          onSelect = _props2.onSelect,
          openPath = _props2.openPath;


      return _react2.default.createElement(
        'div',
        { className: 'multi-menu' },
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

var MenuItem = exports.MenuItem = function (_Component3) {
  _inherits(MenuItem, _Component3);

  function MenuItem() {
    var _ref;

    var _temp, _this3, _ret;

    _classCallCheck(this, MenuItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this3 = _possibleConstructorReturn(this, (_ref = MenuItem.__proto__ || Object.getPrototypeOf(MenuItem)).call.apply(_ref, [this].concat(args))), _this3), _this3.handleClick = function (e) {
      var _this3$props = _this3.props,
          value = _this3$props.data.value,
          onSelect = _this3$props.onSelect;


      if (!onSelect) {
        return;
      }

      onSelect(value);
    }, _this3.handleHover = function (e) {
      var _this3$props2 = _this3.props,
          path = _this3$props2.path,
          onHover = _this3$props2.onHover;


      e.stopPropagation();

      onHover(path);
    }, _temp), _possibleConstructorReturn(_this3, _ret);
  }

  _createClass(MenuItem, [{
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          data = _props3.data,
          path = _props3.path,
          onHover = _props3.onHover,
          onSelect = _props3.onSelect,
          openPath = _props3.openPath;


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

var MultiMenuTrigger = exports.MultiMenuTrigger = function (_Component4) {
  _inherits(MultiMenuTrigger, _Component4);

  function MultiMenuTrigger() {
    var _ref2;

    var _temp2, _this4, _ret2;

    _classCallCheck(this, MultiMenuTrigger);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this4 = _possibleConstructorReturn(this, (_ref2 = MultiMenuTrigger.__proto__ || Object.getPrototypeOf(MultiMenuTrigger)).call.apply(_ref2, [this].concat(args))), _this4), _this4.state = { expanded: false, align: null }, _this4.handleClick = function (e) {
      if (_this4.state.expanded) {
        return _this4.setState({ expanded: false });
      }

      var align = _this4.state.align || ALIGN_CENTER;

      if (_this4.element) {
        var rect = _this4.element.getBoundingClientRect();
        var windowWidth = window.innerWidth;

        var center = (rect.left + rect.right) / 2;

        if (center - 90 < 20) {
          align = ALIGN_LEFT;
        } else if (center + 90 > windowWidth - 20) {
          align = ALIGN_RIGHT;
        }
      }

      _this4.setState({ align: align, expanded: true });
    }, _this4.handleSelect = function (val) {
      var onSelect = _this4.props.onSelect;


      _this4.setState({ expanded: false });

      if (onSelect) {
        onSelect(val);
      }
    }, _this4.handleClickOutside = function (e) {
      _this4.setState({ expanded: false });
    }, _this4.elementRef = function (el) {
      return _this4.element = el;
    }, _temp2), _possibleConstructorReturn(_this4, _ret2);
  }

  _createClass(MultiMenuTrigger, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener('mousedown', this.handleClickOutside);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('mousedown', this.handleClickOutside);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props4 = this.props,
          children = _props4.children,
          menu = _props4.menu;
      var _state = this.state,
          expanded = _state.expanded,
          align = _state.align;


      return _react2.default.createElement(
        'div',
        {
          className: (0, _classnames2.default)('multi-menu-trigger', align, { expanded: expanded }),
          onMouseDown: stopPropagation,
          ref: this.elementRef
        },
        expanded ? _react2.default.createElement(MultiMenuWrapper, {
          menu: menu,
          onSelect: this.handleSelect
        }) : null,
        _react2.default.createElement(
          'div',
          { className: 'multi-menu-trigger-element', onClick: this.handleClick },
          children
        )
      );
    }
  }]);

  return MultiMenuTrigger;
}(_react.Component);
//# sourceMappingURL=index.js.map