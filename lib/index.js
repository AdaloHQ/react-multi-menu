'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MultiMenuTrigger = exports.MenuItem = exports.MenuSpacer = exports.OverflowControl = exports.MultiMenu = exports.MultiMenuWrapper = exports.matches = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _reactDocumentEvents = require('react-document-events');

var _reactDocumentEvents2 = _interopRequireDefault(_reactDocumentEvents);

var _dom = require('./dom');

var _sizing = require('./sizing');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LEFT = 'left';
var RIGHT = 'right';
var EXPAND_UP = 'up';
var EXPAND_DOWN = 'down';
var ESC = 27;

var LEFT_ARROW = 37;
var UP_ARROW = 38;
var RIGHT_ARROW = 39;
var DOWN_ARROW = 40;

var ARROWS = [LEFT_ARROW, UP_ARROW, RIGHT_ARROW, DOWN_ARROW];

var WINDOW_PAD = 16;

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

// Implements depth first search to find current value
var getByValue = function getByValue(options, value) {
  var comparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (!comparator) {
    comparator = function comparator(a, b) {
      return a === b;
    };
  }

  if (!options || (typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
    return undefined;
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var opt = _step.value;

      if (!opt || value === undefined || value === null) {
        continue;
      }

      if (comparator(opt.value, value)) {
        return opt;
      }

      if (opt.children) {
        var childResult = getByValue(opt.children, value, comparator);

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
          menuClassName = _props2.menuClassName,
          comparator = _props2.comparator,
          dark = _props2.dark,
          onChange = _props2.onChange,
          options = _props2.options,
          rowHeight = _props2.rowHeight;


      var label = this.getLabel();

      return _react2.default.createElement(
        MultiMenuTrigger,
        {
          fitParent: true,
          isStyledMenu: true,
          className: (0, _classnames2.default)('multi-select-menu', className),
          dark: dark,
          menu: options,
          onSelect: onChange,
          menuClassName: menuClassName,
          rowHeight: rowHeight
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
  placeholder: 'Select...',
  options: []
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
          position = _props3.position,
          isStyledMenu = _props3.isStyledMenu,
          className = _props3.className,
          verticalExpand = _props3.verticalExpand,
          rowHeight = _props3.rowHeight;
      var openPath = this.state.openPath;


      if (!position) {
        position = { top: WINDOW_PAD };
      }

      var maxHeight = void 0;

      if (verticalExpand === EXPAND_UP) {
        maxHeight = window.innerHeight - position.bottom - WINDOW_PAD;
      } else {
        maxHeight = window.innerHeight - position.top - WINDOW_PAD;
      }

      return _react2.default.createElement(
        'div',
        {
          className: (0, _classnames2.default)('multi-menu-wrapper', 'expand-' + expandDirection, 'expand-' + verticalExpand, className, { 'multi-menu-wrapper-attached': isStyledMenu }),
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
          onHover: this.handleHover,
          maxHeight: maxHeight,
          rowHeight: rowHeight
        }))
      );
    }
  }]);

  return MultiMenuWrapper;
}(_react.Component);

MultiMenuWrapper.defaultProps = {
  expandDirection: RIGHT,
  verticalExpand: EXPAND_DOWN,
  rowHeight: _sizing.DEFAULT_ROW_HEIGHT
};

var MultiMenu = exports.MultiMenu = function (_Component3) {
  _inherits(MultiMenu, _Component3);

  function MultiMenu(props) {
    _classCallCheck(this, MultiMenu);

    var _this3 = _possibleConstructorReturn(this, (MultiMenu.__proto__ || Object.getPrototypeOf(MultiMenu)).call(this, props));

    _initialiseProps.call(_this3);

    _this3.evaluateMenu(props);
    return _this3;
  }

  _createClass(MultiMenu, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setOverflow();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.setOverflow();
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(newProps) {
      if (newProps.menu !== this.props.menu) {
        this.evaluateMenu(newProps);
      }

      return true;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props4 = this.props,
          basePath = _props4.basePath,
          isSubMenu = _props4.isSubMenu,
          onHover = _props4.onHover,
          onSelect = _props4.onSelect,
          openPath = _props4.openPath,
          width = _props4.width,
          maxHeight = _props4.maxHeight,
          rowHeight = _props4.rowHeight;


      var menu = this.getMenu();

      var _state = this.state,
          overflowBefore = _state.overflowBefore,
          overflowAfter = _state.overflowAfter;


      var styles = { width: width, maxHeight: maxHeight };

      return _react2.default.createElement(
        'div',
        { className: 'multi-menu-inner-wrapper', style: styles },
        _react2.default.createElement(
          'div',
          {
            className: (0, _classnames2.default)('multi-menu', {
              'multi-menu-overflow-before': overflowBefore,
              'multi-menu-overflow-after': overflowAfter
            }),
            style: styles,
            onWheel: this.handleScroll
          },
          _react2.default.createElement(
            'div',
            {
              className: 'multi-menu-scroll-container',
              style: styles,
              ref: this.menuRef
            },
            menu && menu.length > 0 ? menu.map(function (itm, i) {
              return _react2.default.createElement(MenuItem, {
                key: i,
                data: itm,
                onHover: onHover,
                onSelect: onSelect,
                openPath: openPath,
                path: basePath.concat([i]),
                height: rowHeight
              });
            }) : _react2.default.createElement(
              'div',
              { className: 'multi-menu-empty' },
              'Nothing Available'
            )
          ),
          overflowBefore ? _react2.default.createElement(OverflowControl, { direction: 'up', onScroll: this.handleOverflowScroll }) : null,
          overflowAfter ? _react2.default.createElement(OverflowControl, { direction: 'down', onScroll: this.handleOverflowScroll }) : null
        ),
        this.renderOpenMenu()
      );
    }
  }]);

  return MultiMenu;
}(_react.Component);

var _initialiseProps = function _initialiseProps() {
  var _this9 = this;

  this.state = {
    overflowBefore: false,
    overflowAfter: false
  };

  this.renderOpenMenu = function () {
    if (!_this9._el) {
      return null;
    }

    var _props7 = _this9.props,
        basePath = _props7.basePath,
        openPath = _props7.openPath,
        onHover = _props7.onHover,
        onSelect = _props7.onSelect,
        rowHeight = _props7.rowHeight;

    var menu = _this9.getMenu();

    var openIndex = void 0;

    if (matches(openPath, basePath)) {
      openIndex = openPath[basePath.length];
    }

    if (openIndex === undefined) {
      return null;
    }

    var openMenu = menu[openIndex] && menu[openIndex].children;

    if (typeof openMenu === 'function') {
      openMenu = openMenu();
    }

    var windowHeight = window.innerHeight;
    var scrollTop = _this9._el.scrollTop;
    var offsetTop = _this9._el.getBoundingClientRect().top;
    var calculatedHeight = (0, _sizing.getMenuHeight)(openMenu, rowHeight);
    var currentItemOffset = (0, _sizing.getMenuItemOffset)(menu, openIndex, rowHeight);
    var positionTop = currentItemOffset - scrollTop;
    var currentOpenPath = basePath.concat([openIndex]);
    var maxHeight = windowHeight - (offsetTop + positionTop) - WINDOW_PAD;

    if (maxHeight < calculatedHeight) {
      var diff = calculatedHeight - maxHeight;
      var maxDiff = windowHeight - maxHeight - 2 * WINDOW_PAD;

      diff = Math.min(diff, maxDiff);

      maxHeight += diff;
      positionTop -= diff - 8;
    }

    return _react2.default.createElement(
      'div',
      {
        className: 'multi-menu-child',
        onMouseOver: stopPropagation,
        style: { top: positionTop }
      },
      _react2.default.createElement(MultiMenu, {
        basePath: currentOpenPath,
        menu: openMenu,
        onHover: onHover,
        onSelect: onSelect,
        openPath: openPath,
        maxHeight: maxHeight,
        rowHeight: rowHeight
      })
    );
  };

  this.handleScroll = function (e) {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();

    _this9.setOverflow();
  };

  this.handleOverflowScroll = function (amount) {
    if (!_this9._el) {
      return;
    }

    _this9._el.scrollTop += amount;

    _this9.setOverflow();
  };

  this.menuRef = function (el) {
    _this9._el = el;
  };

  this.setOverflow = function () {
    var _props8 = _this9.props,
        maxHeight = _props8.maxHeight,
        rowHeight = _props8.rowHeight;

    var menu = _this9.getMenu();
    var calculatedHeight = (0, _sizing.getMenuHeight)(menu, rowHeight);

    if (!_this9._el) {
      return;
    }

    var scrollOffset = _this9._el.scrollTop;
    var overflowBefore = scrollOffset > 10;
    var overflowAfter = calculatedHeight - scrollOffset > maxHeight + 10;

    if (overflowBefore !== _this9.state.overflowBefore || overflowAfter !== _this9.state.overflowAfter) {

      _this9.setState({ overflowBefore: overflowBefore, overflowAfter: overflowAfter });
    }
  };

  this.evaluateMenu = function () {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    var _ref4 = props || _this9.props,
        menu = _ref4.menu;

    if (typeof menu === 'function') {
      _this9._evaluatedMenu = menu();
    } else {
      _this9._evaluatedMenu = menu;
    }
  };

  this.getMenu = function () {
    return _this9._evaluatedMenu;
  };
};

var OverflowControl = exports.OverflowControl = function (_Component4) {
  _inherits(OverflowControl, _Component4);

  function OverflowControl() {
    var _ref;

    var _temp, _this4, _ret;

    _classCallCheck(this, OverflowControl);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this4 = _possibleConstructorReturn(this, (_ref = OverflowControl.__proto__ || Object.getPrototypeOf(OverflowControl)).call.apply(_ref, [this].concat(args))), _this4), _this4.scrollAction = function () {
      var _this4$props = _this4.props,
          direction = _this4$props.direction,
          onScroll = _this4$props.onScroll;

      var amount = direction === 'up' ? -6 : 6;

      onScroll(amount);
    }, _this4.handleMouseLeave = function () {
      window.clearInterval(_this4._timer);
    }, _this4.handleMouseEnter = function () {
      _this4._timer = window.setInterval(_this4.scrollAction, 20);
    }, _temp), _possibleConstructorReturn(_this4, _ret);
  }

  _createClass(OverflowControl, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.handleMouseLeave();
    }
  }, {
    key: 'render',
    value: function render() {
      var direction = this.props.direction;


      return _react2.default.createElement(
        'div',
        {
          className: (0, _classnames2.default)('multi-menu-overflow', 'multi-menu-overflow-' + direction),
          onMouseEnter: this.handleMouseEnter,
          onMouseLeave: this.handleMouseLeave
        },
        _react2.default.createElement('div', { className: 'multi-menu-overflow-icon' })
      );
    }
  }]);

  return OverflowControl;
}(_react.Component);

var MenuSpacer = exports.MenuSpacer = function MenuSpacer() {
  return _react2.default.createElement('div', { className: 'multi-menu-spacer' });
};

var MenuItem = exports.MenuItem = function (_Component5) {
  _inherits(MenuItem, _Component5);

  function MenuItem() {
    var _ref2;

    var _temp2, _this5, _ret2;

    _classCallCheck(this, MenuItem);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this5 = _possibleConstructorReturn(this, (_ref2 = MenuItem.__proto__ || Object.getPrototypeOf(MenuItem)).call.apply(_ref2, [this].concat(args))), _this5), _this5.handleClick = function (e) {
      var _this5$props = _this5.props,
          _this5$props$data = _this5$props.data,
          value = _this5$props$data.value,
          onClick = _this5$props$data.onClick,
          onSelect = _this5$props.onSelect;


      if (onClick) {
        onClick();
      }

      if (!onSelect || value === undefined && !onClick) {
        return;
      }

      onSelect(value);
    }, _this5.hasChildren = function () {
      var data = _this5.props.data;
      var children = data.children;


      if (typeof children === 'function') {
        children = children();
      }

      return children && children.length > 0;
    }, _this5.handleHover = function (e) {
      var _this5$props2 = _this5.props,
          data = _this5$props2.data,
          path = _this5$props2.path,
          onHover = _this5$props2.onHover;


      e.stopPropagation();

      if (data.disabled) {
        return;
      }

      if (_this5.hasChildren()) {
        onHover(path);
      } else {
        onHover(path.slice(0, path.length - 1));
      }
    }, _temp2), _possibleConstructorReturn(_this5, _ret2);
  }

  _createClass(MenuItem, [{
    key: 'render',
    value: function render() {
      var _props5 = this.props,
          data = _props5.data,
          path = _props5.path,
          onHover = _props5.onHover,
          onSelect = _props5.onSelect,
          openPath = _props5.openPath,
          height = _props5.height;


      if (data === null) {
        return _react2.default.createElement(MenuSpacer, null);
      }

      var disabled = data.disabled;


      var open = matches(openPath, path);
      var hasChildren = this.hasChildren();
      var clickAction = data.onClick;

      var styles = {
        height: height
      };

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
          onMouseOver: this.handleHover,
          style: styles
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
        )
      );
    }
  }]);

  return MenuItem;
}(_react.Component);

var MultiMenuTrigger = exports.MultiMenuTrigger = function (_Component6) {
  _inherits(MultiMenuTrigger, _Component6);

  function MultiMenuTrigger() {
    var _ref3;

    var _temp3, _this6, _ret3;

    _classCallCheck(this, MultiMenuTrigger);

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return _ret3 = (_temp3 = (_this6 = _possibleConstructorReturn(this, (_ref3 = MultiMenuTrigger.__proto__ || Object.getPrototypeOf(MultiMenuTrigger)).call.apply(_ref3, [this].concat(args))), _this6), _this6.state = {
      expanded: false,
      position: null,
      expandDirection: null,
      verticalExpand: EXPAND_DOWN
    }, _this6.handleClick = function (e) {
      e.stopPropagation();

      if (_this6.state.expanded) {
        return _this6.setState({ expanded: false });
      }

      var fitParent = _this6.props.fitParent;


      var position = _this6.state.position;
      var expandDirection = RIGHT;
      var verticalExpand = EXPAND_DOWN;

      if (_this6.element) {
        var rect = _this6.element.getBoundingClientRect();
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;

        var center = (rect.left + rect.right) / 2;

        if (center * 2 > windowWidth) {
          expandDirection = LEFT;
        }

        var verticalCenter = (rect.top + rect.bottom) / 2;

        if (verticalCenter * 2 > windowHeight) {
          verticalExpand = EXPAND_UP;
        }

        if (verticalExpand === EXPAND_UP) {
          position = { bottom: windowHeight - rect.top + _sizing.MENU_PAD };
        } else {
          position = { top: rect.bottom + _sizing.MENU_PAD };
        }

        var menuWidth = 180;

        if (fitParent) {
          if (verticalExpand === EXPAND_UP) {
            position = { bottom: windowHeight - rect.top, left: rect.left, width: rect.width };
          } else {
            position = { top: rect.bottom, left: rect.left, width: rect.width };
          }
        } else if (center - menuWidth / 2 < 20) {
          position.left = rect.left;
        } else if (center + menuWidth / 2 > windowWidth - 20) {
          position.left = rect.right - menuWidth;
        } else {
          position.left = center - menuWidth / 2;
        }
      }

      _this6.setState({
        position: position,
        expandDirection: expandDirection,
        verticalExpand: verticalExpand,
        expanded: true
      });
    }, _this6.handleSelect = function (val) {
      var onSelect = _this6.props.onSelect;


      _this6.setState({ expanded: false });

      if (onSelect) {
        onSelect(val);
      }
    }, _this6.handleClickOutside = function (e) {
      if ((0, _dom.isDescendent)(e.target, _this6.element)) {
        return;
      }

      _this6.setState({ expanded: false });
    }, _this6.handleClose = function () {
      _this6.setState({ expanded: false });
    }, _this6.handleScroll = function (e) {
      e.preventDefault();
    }, _this6.handleKeyDown = function (e) {
      if (e.which === ESC) {
        _this6.setState({ expanded: false });
      }
    }, _this6.handleBlur = function () {
      _this6.setState({ expanded: false });
    }, _this6.elementRef = function (el) {
      return _this6.element = el;
    }, _temp3), _possibleConstructorReturn(_this6, _ret3);
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
          menuClassName = _props6.menuClassName,
          dark = _props6.dark,
          menu = _props6.menu,
          isStyledMenu = _props6.isStyledMenu,
          rowHeight = _props6.rowHeight;
      var _state2 = this.state,
          expandDirection = _state2.expandDirection,
          expanded = _state2.expanded,
          position = _state2.position,
          verticalExpand = _state2.verticalExpand;


      return _react2.default.createElement(
        'div',
        {
          className: (0, _classnames2.default)('multi-menu-trigger', className, 'expand-' + verticalExpand, { expanded: expanded, 'multi-menu-dark': dark }),
          ref: this.elementRef,
          onClick: stopPropagation,
          onMouseDown: stopPropagation,
          onDoubleClick: stopPropagation,
          onMouseUp: stopPropagation
        },
        expanded ? _react2.default.createElement(_reactDocumentEvents2.default, {
          onWheel: this.handleScroll,
          onKeyDown: this.handleKeyDown
        }) : null,
        expanded ? _react2.default.createElement(
          MenuPortal,
          null,
          _react2.default.createElement('div', {
            className: 'multi-menu-trigger-close',
            onMouseDown: this.handleClose
          }),
          _react2.default.createElement(MultiMenuWrapper, {
            isStyledMenu: isStyledMenu,
            expandDirection: expandDirection,
            verticalExpand: verticalExpand,
            menu: menu,
            onSelect: this.handleSelect,
            position: position,
            className: menuClassName,
            rowHeight: rowHeight
          })
        ) : null,
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

var MenuPortal = function (_Component7) {
  _inherits(MenuPortal, _Component7);

  function MenuPortal() {
    _classCallCheck(this, MenuPortal);

    return _possibleConstructorReturn(this, (MenuPortal.__proto__ || Object.getPrototypeOf(MenuPortal)).apply(this, arguments));
  }

  _createClass(MenuPortal, [{
    key: 'getNode',
    value: function getNode() {
      if (!this._node) {
        this._node = document.createElement('div');
        this._node.className = 'multi-menu-container';
        document.body.appendChild(this._node);
      }

      return this._node;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this8 = this;

      window.setTimeout(function () {
        // Remove node if exists
        if (!_this8._node) {
          return;
        }

        document.body.removeChild(_this8._node);
        _this8._node = null;
      }, 0);
    }
  }, {
    key: 'render',
    value: function render() {
      var children = this.props.children;


      return _reactDom2.default.createPortal(_react2.default.createElement(
        _react2.default.Fragment,
        null,
        children
      ), this.getNode());
    }
  }]);

  return MenuPortal;
}(_react.Component);
//# sourceMappingURL=index.js.map