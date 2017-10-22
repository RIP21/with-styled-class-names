var _templateObject = _taggedTemplateLiteral(['\n        ', ';\n      '], ['\n        ', ';\n      ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import styled from 'styled-components';

var withCustomClassNameProp = function withCustomClassNameProp(Component, propClass) {
  return function (_ref) {
    var className = _ref.className,
        rest = _objectWithoutProperties(_ref, ['className']);

    var props = Object.assign({}, rest, _defineProperty({}, propClass, className));
    return React.createElement(Component, props);
  };
};

var withClassNames = function withClassNames(Component, stylesMap) {
  return function (strings) {
    for (var _len = arguments.length, interpolations = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      interpolations[_key - 1] = arguments[_key];
    }

    var RootComponent = strings ? styled(Component)(strings, interpolations) : Component;
    return Object.entries(stylesMap).reduce(function (ResultComponent, entry) {
      var propClass = entry[0];
      var value = entry[1];
      if (value.name === 'StyledComponent') {
        return value.withComponent(withCustomClassNameProp(ResultComponent, propClass));
      }
      return styled(withCustomClassNameProp(ResultComponent, propClass))(_templateObject, value);
    }, RootComponent);
  };
};

export default withClassNames;