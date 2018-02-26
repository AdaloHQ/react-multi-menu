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

var LEFT_ARROW = 37;
var UP_ARROW = 38;
var RIGHT_ARROW = 39;
var DOWN_ARROW = 40;

var ARROWS = [LEFT_ARROW, UP_ARROW, RIGHT_ARROW, DOWN_ARROW];

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
  e.preventDefault();
};

var getByValue = function getByValue(options, value) {
  var comparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (!comparator) {
    comparator = function comparator(a, b) {
      return a === b;
    };
  }

  if (!options) {
    return undefined;
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
    key: 'getLabel',
    value: function getLabel() {
      var _props = this.props,
          value = _props.value,
          options = _props.options,
          getLabel = _props.getLabel,
          placeholder = _props.placeholder,
          comparator = _props.comparator;


      var label = null;

      if (typeof options === 'function' && !getLabel) {
        console.error('Warning: if options is a function, getLabel must also be provided');
      }

      if (getLabel) {
        label = getLabel(value);
      } else if (Array.isArray(options)) {
        var selectedOption = getByValue(options, value, comparator);

        if (selectedOption) {
          label = selectedOption.label;
        }
      }

      if (!label) {
        return _react2.default.createElement(
          'span',
          { className: 'multi-select-menu-placeholder' },
          placeholder
        );
      }

      return label;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          className = _props2.className,
          comparator = _props2.comparator,
          dark = _props2.dark,
          onChange = _props2.onChange,
          options = _props2.options;


      var label = this.getLabel();

      return _react2.default.createElement(
        MultiMenuTrigger,
        {
          fitParent: true,
          className: (0, _classnames2.default)('multi-select-menu', className),
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

    _this2.handleKeyDown = function (e) {
      // Prevent arrow-triggered scrolling
      if (ARROWS.indexOf(e.which) >= 0) {
        e.preventDefault();
      }

      if (e.which === UP_ARROW) {
        // console.log("GETTING PREVIOUS VALUE")
      } else if (e.which === DOWN_ARROW) {
        // console.log("GETTING NEXT VALUE")
      }
    };

    _this2.state = {
      openPath: []
    };
    return _this2;
  }

  _createClass(MultiMenuWrapper, [{
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          align = _props3.align,
          expandDirection = _props3.expandDirection,
          isSubMenu = _props3.isSubMenu,
          menu = _props3.menu,
          onSelect = _props3.onSelect,
          position = _props3.position;
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
        _react2.default.createElement(_reactDocumentEvents2.default, {
          onKeyDown: this.handleKeyDown
        }),
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
      var _props4 = this.props,
          basePath = _props4.basePath,
          isSubMenu = _props4.isSubMenu,
          menu = _props4.menu,
          onHover = _props4.onHover,
          onSelect = _props4.onSelect,
          openPath = _props4.openPath,
          width = _props4.width;


      var styles = { width: width };

      if (typeof menu === 'function') {
        menu = menu();
      }

      return _react2.default.createElement(
        'div',
        { className: 'multi-menu', style: styles },
        menu && menu.length > 0 ? menu.map(function (itm, i) {
          return _react2.default.createElement(MenuItem, {
            key: i,
            data: itm,
            onHover: onHover,
            onSelect: onSelect,
            openPath: openPath,
            path: basePath.concat([i])
          });
        }) : _react2.default.createElement(
          'div',
          { className: 'multi-menu-empty' },
          'Nothing Available'
        )
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
          _this4$props$data = _this4$props.data,
          value = _this4$props$data.value,
          onClick = _this4$props$data.onClick,
          onSelect = _this4$props.onSelect;


      if (onClick) {
        onClick();
      }

      if (!onSelect || value === undefined && !onClick) {
        return;
      }

      onSelect(value);
    }, _this4.hasChildren = function () {
      var data = _this4.props.data;
      var children = data.children;


      if (typeof children === 'function') {
        children = children();
      }

      return children && children.length > 0;
    }, _this4.handleHover = function (e) {
      var _this4$props2 = _this4.props,
          data = _this4$props2.data,
          path = _this4$props2.path,
          onHover = _this4$props2.onHover;


      e.stopPropagation();

      if (data.disabled) {
        return;
      }

      if (_this4.hasChildren()) {
        onHover(path);
      } else {
        onHover(path.slice(0, path.length - 1));
      }
    }, _temp), _possibleConstructorReturn(_this4, _ret);
  }

  _createClass(MenuItem, [{
    key: 'render',
    value: function render() {
      var _props5 = this.props,
          data = _props5.data,
          path = _props5.path,
          onHover = _props5.onHover,
          onSelect = _props5.onSelect,
          openPath = _props5.openPath;


      if (data === null) {
        return _react2.default.createElement(MenuSpacer, null);
      }

      var disabled = data.disabled;


      var open = matches(openPath, path);
      var hasChildren = this.hasChildren();
      var clickAction = data.onClick;

      var childrenOnly = false;

      if (data.value === undefined) {
        if (hasChildren) {
          childrenOnly = true;
        } else if (!clickAction) {
          disabled = true;
        }
      }

      return _react2.default.createElement(
        'div',
        {
          className: (0, _classnames2.default)('multi-menu-item', {
            disabled: disabled,
            open: open,
            'has-children': hasChildren,
            'children-only': childrenOnly
          }),
          onMouseOver: this.handleHover
        },
        _react2.default.createElement(
          'div',
          {
            className: 'multi-menu-item-label',
            onClick: this.handleClick,
            title: data.label
          },
          data.label,
          data.subtitle ? _react2.default.createElement(
            'span',
            { className: 'multi-menu-item-subtitle' },
            data.subtitle
          ) : null
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
      e.stopPropagation();

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
      var _props6 = this.props,
          children = _props6.children,
          className = _props6.className,
          dark = _props6.dark,
          menu = _props6.menu;
      var _state = this.state,
          expandDirection = _state.expandDirection,
          expanded = _state.expanded,
          position = _state.position;


      return _react2.default.createElement(
        'div',
        {
          className: (0, _classnames2.default)('multi-menu-trigger', className, { expanded: expanded, 'multi-menu-dark': dark }),
          ref: this.elementRef,
          onClick: stopPropagation,
          onMouseDown: stopPropagation,
          onDoubleClick: stopPropagation,
          onMouseUp: stopPropagation
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
          {
            className: 'multi-menu-trigger-element',
            onMouseDown: this.handleClick
          },
          children
        )
      );
    }
  }]);

  return MultiMenuTrigger;
}(_react.Component);
//# sourceMappingURL=index.js.map