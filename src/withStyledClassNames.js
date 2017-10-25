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

function withStyledClassNames(stylesMap, Component) {
  const isComponentPassed = !!Component
  return isComponentPassed
    ? injectControlledClassNames(stylesMap, styled(Component)``)
    : Component => {
        return injectControlledClassNames(stylesMap, styled(Component)``)
      }
}

export default withStyledClassNames
