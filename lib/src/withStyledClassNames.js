var _templateObject = _taggedTemplateLiteral(['\n      ', ';\n    '], ['\n      ', ';\n    ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import React from 'react';
import styled from 'styled-components';

var withCustomClassNameProp = function withCustomClassNameProp(Component, propClass) {
  var keyToNest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
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

var injectControlledClassNames = function injectControlledClassNames(stylesMap, Component) {
  var keyToNest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
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

function buildComponent(stringsOrSC) {
  var stylesMap = this.stylesMap;
  var Component = this.Component;

  for (var _len = arguments.length, interpolations = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    interpolations[_key - 1] = arguments[_key];
  }

  var isTaggedTemplateLiteral = stringsOrSC != null && stringsOrSC.length > 0 || stringsOrSC != null && interpolations.length > 0;
  var isStyledComponent = stringsOrSC != null && stringsOrSC.name === 'StyledComponent';

  var RootComponent = isTaggedTemplateLiteral ? styled(Component)(stringsOrSC, interpolations) : isStyledComponent ? stringsOrSC.withComponent(Component) : Component;

  return injectControlledClassNames(stylesMap, RootComponent);
}

function withStyledClassNames(stylesMap, Component) {
  var that = this;
  var isComponentPassed = !!Component ? (that.Component = Component) && true : false;
  that.stylesMap = stylesMap;
  return isComponentPassed ? buildComponent.bind(that) : function (Component) {
    that.Component = Component;
    return buildComponent.bind(that);
  };
}

export default withStyledClassNames.bind({});