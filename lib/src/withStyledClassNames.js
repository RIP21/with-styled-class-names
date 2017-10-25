var _templateObject = _taggedTemplateLiteral(['\n      ', ';\n    '], ['\n      ', ';\n    ']),
    _templateObject2 = _taggedTemplateLiteral([''], ['']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import styled from 'styled-components';

var withCustomClassNameProp = function withCustomClassNameProp(Component, propClass, keyToNest) {
  return function (_ref) {
    var className = _ref.className,
        rest = _objectWithoutProperties(_ref, ['className']);

    var classNamesAlreadySet = keyToNest ? rest[keyToNest] ? rest[keyToNest] : {} : undefined;
    var objToMerge = keyToNest ? _defineProperty({}, propClass, className) : undefined;
    var merged = Object.assign({}, classNamesAlreadySet, objToMerge);
    var props = keyToNest ? Object.assign({}, rest, _defineProperty({}, keyToNest, merged)) : Object.assign({}, rest, _defineProperty({}, propClass, className));
    return React.createElement(Component, props);
  };
};

var injectControlledClassNames = function injectControlledClassNames(stylesMap, Component, keyToNest) {
  return Object.entries(stylesMap).reduce(function (ResultComponent, entry) {
    var customClassNameProp = entry[0];
    var tagOrStyledComponent = entry[1];
    if (tagOrStyledComponent && tagOrStyledComponent.name === 'StyledComponent') {
      return tagOrStyledComponent.withComponent(withCustomClassNameProp(ResultComponent, customClassNameProp, keyToNest));
    }
    if (tagOrStyledComponent && !(tagOrStyledComponent instanceof Array) && typeof tagOrStyledComponent !== 'string') {
      return injectControlledClassNames(tagOrStyledComponent, ResultComponent, customClassNameProp);
    }
    return styled(withCustomClassNameProp(ResultComponent, customClassNameProp, keyToNest))(_templateObject, tagOrStyledComponent);
  }, Component);
};

function withStyledClassNames(stylesMap, Component) {
  var isComponentPassed = !!Component;
  return isComponentPassed ? injectControlledClassNames(stylesMap, styled(Component)(_templateObject2)) : function (Component) {
    return injectControlledClassNames(stylesMap, styled(Component)(_templateObject2));
  };
}

export default withStyledClassNames;