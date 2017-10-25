import React from 'react'
import styled from 'styled-components'

const withCustomClassNameProp = (Component, propClass, keyToNest) => ({
  className,
  ...rest
}) => {
  const classNamesAlreadySet = keyToNest
    ? rest[keyToNest] ? rest[keyToNest] : {}
    : undefined
  const objToMerge = keyToNest ? { [propClass]: className } : undefined
  const merged = { ...classNamesAlreadySet, ...objToMerge }
  const props = keyToNest
    ? { ...rest, [keyToNest]: merged }
    : { ...rest, [propClass]: className }
  return <Component {...props} />
}

const injectControlledClassNames = (stylesMap, Component, keyToNest) =>
  Object.entries(stylesMap).reduce((ResultComponent, entry) => {
    const customClassNameProp = entry[0]
    const tagOrStyledComponent = entry[1]
    if (
      tagOrStyledComponent &&
      tagOrStyledComponent.name === 'StyledComponent'
    ) {
      return tagOrStyledComponent.withComponent(
        withCustomClassNameProp(
          ResultComponent,
          customClassNameProp,
          keyToNest,
        ),
      )
    }
    if (
      tagOrStyledComponent &&
      !(tagOrStyledComponent instanceof Array) &&
      typeof tagOrStyledComponent !== 'string'
    ) {
      return injectControlledClassNames(
        tagOrStyledComponent,
        ResultComponent,
        customClassNameProp,
      )
    }
    return styled(
      withCustomClassNameProp(ResultComponent, customClassNameProp, keyToNest),
    )`
      ${tagOrStyledComponent};
    `
  }, Component)

function buildComponent(stringsOrSC, ...interpolations) {
  const stylesMap = this.stylesMap
  const Component = this.Component
  const isTaggedTemplateLiteral =
    (stringsOrSC != null && stringsOrSC.length > 0) ||
    (stringsOrSC != null && interpolations.length > 0)
  const isStyledComponent =
    stringsOrSC != null && stringsOrSC.name === 'StyledComponent'

  const RootComponent = isTaggedTemplateLiteral
    ? styled(Component)(stringsOrSC, interpolations)
    : isStyledComponent ? stringsOrSC.withComponent(Component) : Component

  return injectControlledClassNames(stylesMap, RootComponent)
}

function withStyledClassNames(stylesMap, Component) {
  const that = this
  const isComponentPassed = !!Component
    ? (that.Component = Component) && true
    : false
  that.stylesMap = stylesMap
  return isComponentPassed
    ? buildComponent.bind(that)
    : Component => {
        that.Component = Component
        return buildComponent.bind(that)
      }
}

export default withStyledClassNames.bind({})
