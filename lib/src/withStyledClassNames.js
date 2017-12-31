'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withStyledClassNames = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral([''], ['']),
    _templateObject2 = _taggedTemplateLiteral(['\n      ', ';\n    '], ['\n      ', ';\n    ']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function Aux(props) {
  return props.children;
}

var ClassNamesLifter = function (_React$PureComponent) {
  _inherits(ClassNamesLifter, _React$PureComponent);

  function ClassNamesLifter() {
    _classCallCheck(this, ClassNamesLifter);

    return _possibleConstructorReturn(this, (ClassNamesLifter.__proto__ || Object.getPrototypeOf(ClassNamesLifter)).apply(this, arguments));
  }

  _createClass(ClassNamesLifter, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.props.onLiftClassName(this.props.className, this.props.classNameProp, this.props.nestToProp);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      if (newProps.className !== this.props.className) {
        newProps.onLiftClassName(newProps.className, newProps.classNameProp, this.props.nestToProp);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return ClassNamesLifter;
}(_react2.default.PureComponent);

var isStyledComponent = function isStyledComponent(value) {
  return value && value.name === 'StyledComponent';
};
var isObject = function isObject(value) {
  return value && !(value instanceof Array) && typeof value !== 'string';
};

var ClassNamesHolder = function (_React$PureComponent2) {
  _inherits(ClassNamesHolder, _React$PureComponent2);

  function ClassNamesHolder(props) {
    _classCallCheck(this, ClassNamesHolder);

    var _this2 = _possibleConstructorReturn(this, (ClassNamesHolder.__proto__ || Object.getPrototypeOf(ClassNamesHolder)).call(this, props));

    _initialiseProps.call(_this2);

    _this2.Styles = _this2.generateStylesLifters(props.stylesMap);
    return _this2;
  }

  _createClass(ClassNamesHolder, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        Aux,
        null,
        this.renderStyles(),
        _react2.default.createElement(this.props.component, Object.assign({}, this.props, this.state))
      );
    }
  }]);

  return ClassNamesHolder;
}(_react2.default.PureComponent);

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.buildStyleLifter = function (customClassNameProp, nestToProp) {
    return function (props) {
      return _react2.default.createElement(ClassNamesLifter, Object.assign({
        classNameProp: customClassNameProp,
        onLiftClassName: _this3.liftClassName,
        nestToProp: nestToProp
      }, props));
    };
  };

  this.createStyleWithSC = function (value, customClassNameProp, nestToProp) {
    return value.withComponent(_this3.buildStyleLifter(customClassNameProp, nestToProp));
  };

  this.createStyleWithTag = function (value, customClassNameProp, nestToProp) {
    return (0, _styledComponents2.default)(_this3.buildStyleLifter(customClassNameProp, nestToProp))(_templateObject2, value);
  };

  this.generateStylesLifters = function (stylesMap) {
    var StylesLifters = [];
    Object.entries(stylesMap).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          customClassNameProp = _ref2[0],
          value = _ref2[1];

      if (isStyledComponent(value)) {
        StylesLifters.push(_this3.createStyleWithSC(value, customClassNameProp));
      } else if (isObject(value)) {
        Object.entries(value).forEach(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
              key = _ref4[0],
              value = _ref4[1];

          return isStyledComponent(value) ? StylesLifters.push(_this3.createStyleWithSC(value, key, customClassNameProp)) : StylesLifters.push(_this3.createStyleWithTag(value, key, customClassNameProp));
        });
      } else {
        StylesLifters.push(_this3.createStyleWithTag(value, customClassNameProp));
      }
    });
    return StylesLifters;
  };

  this.renderStyles = function () {
    return _this3.Styles.map(function (SC, index) {
      return _react2.default.createElement(SC, Object.assign({ key: index }, _this3.props));
    });
  };

  this.liftClassName = function (className, nestedProp, nestToProp) {
    if (!nestToProp) {
      _this3.setState(_defineProperty({}, nestedProp, className));
    } else {
      _this3.setState(function (prevState) {
        var previousState = prevState ? prevState[nestToProp] : {};
        return _defineProperty({}, nestToProp, Object.assign({}, previousState, _defineProperty({}, nestedProp, className)));
      });
    }
  };
};

var buildClassNamesHolder = function buildClassNamesHolder(stylesMap, Component) {
  return (0, _styledComponents2.default)(function (props) {
    return _react2.default.createElement(ClassNamesHolder, Object.assign({ stylesMap: stylesMap, component: Component }, props));
  })(_templateObject);
};

var withStyledClassNames = exports.withStyledClassNames = function withStyledClassNames(stylesMap, Component) {
  var isComponentPassed = !!Component;
  return isComponentPassed ? buildClassNamesHolder(stylesMap, Component) : function (Component) {
    return buildClassNamesHolder(stylesMap, Component);
  };
};

exports.default = withStyledClassNames;