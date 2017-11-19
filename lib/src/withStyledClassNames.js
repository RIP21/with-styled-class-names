'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withStyledClassNames = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Aux(props) {
  return props.children;
}

class ClassNamesLifter extends _react2.default.PureComponent {
  componentWillMount() {
    this.props.onLiftClassName(this.props.className, this.props.classNameProp, this.props.nestToProp);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.className !== this.props.className) {
      newProps.onLiftClassName(newProps.className, newProps.classNameProp, this.props.nestToProp);
    }
  }

  render() {
    return null;
  }
}

const isStyledComponent = value => value && value.name === 'StyledComponent';
const isObject = value => value && !(value instanceof Array) && typeof value !== 'string';

class ClassNamesHolder extends _react2.default.PureComponent {
  constructor(props) {
    super(props);

    _initialiseProps.call(this);

    this.Styles = this.generateStylesLifters(props.stylesMap);
  }

  render() {
    return _react2.default.createElement(
      Aux,
      null,
      this.renderStyles(),
      _react2.default.createElement(this.props.component, _extends({}, this.props, this.state))
    );
  }
}

var _initialiseProps = function () {
  this.buildStyleLifter = (customClassNameProp, nestToProp) => props => _react2.default.createElement(ClassNamesLifter, _extends({
    classNameProp: customClassNameProp,
    onLiftClassName: this.liftClassName,
    nestToProp: nestToProp
  }, props));

  this.createStyleWithSC = (value, customClassNameProp, nestToProp) => {
    return value.withComponent(this.buildStyleLifter(customClassNameProp, nestToProp));
  };

  this.createStyleWithTag = (value, customClassNameProp, nestToProp) => {
    return (0, _styledComponents2.default)(this.buildStyleLifter(customClassNameProp, nestToProp))`
      ${value};
    `;
  };

  this.generateStylesLifters = stylesMap => {
    const StylesLifters = [];
    Object.entries(stylesMap).forEach(entry => {
      const customClassNameProp = entry[0];
      const value = entry[1];
      if (isStyledComponent(value)) {
        StylesLifters.push(this.createStyleWithSC(value, customClassNameProp));
      } else if (isObject(value)) {
        Object.entries(value).forEach(style => isStyledComponent(style[1]) ? StylesLifters.push(this.createStyleWithSC(style[1], style[0], customClassNameProp)) : StylesLifters.push(this.createStyleWithTag(style[1], style[0], customClassNameProp)));
      } else {
        StylesLifters.push(this.createStyleWithTag(value, customClassNameProp));
      }
    });
    return StylesLifters;
  };

  this.renderStyles = () => {
    return this.Styles.map(SC => _react2.default.createElement(SC, this.props));
  };

  this.liftClassName = (className, nestedProp, nestToProp) => {
    if (!nestToProp) {
      this.setState({ [nestedProp]: className });
    } else {
      this.setState(prevState => {
        const previousState = prevState ? prevState[nestToProp] : {};
        return {
          [nestToProp]: _extends({}, previousState, { [nestedProp]: className })
        };
      });
    }
  };
};

const buildClassNamesHolder = (stylesMap, Component) => (0, _styledComponents2.default)(props => _react2.default.createElement(ClassNamesHolder, _extends({ stylesMap: stylesMap, component: Component }, props)))``;

const withStyledClassNames = exports.withStyledClassNames = (stylesMap, Component) => {
  const isComponentPassed = !!Component;
  return isComponentPassed ? buildClassNamesHolder(stylesMap, Component) : Component => {
    return buildClassNamesHolder(stylesMap, Component);
  };
};

exports.default = withStyledClassNames;