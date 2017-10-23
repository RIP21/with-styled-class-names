import React from 'react'
import styled from 'styled-components'
import curry from 'lodash.curry'

const withCustomClassNameProp = (Component, propClass) => ({
  className,
  ...rest
}) => {
  const props = { ...rest, [propClass]: className }
  return <Component {...props} />
}

const withStyledClassNames = curry((stylesMap, Component) => {
  return (stringsOrSC, ...interpolations) => {
    const isTaggedTemplateLiteral =
      (stringsOrSC != null && stringsOrSC.length > 0) ||
      (stringsOrSC != null && interpolations.length > 0)
    const isStyledComponent =
      stringsOrSC != null && stringsOrSC.name === 'StyledComponent'

    const RootComponent = isTaggedTemplateLiteral
      ? styled(Component)(stringsOrSC, interpolations)
      : isStyledComponent ? stringsOrSC.withComponent(Component) : Component

    return Object.entries(stylesMap).reduce((ResultComponent, entry) => {
      const customClassNameProp = entry[0]
      const tagOrStyledComponent = entry[1]
      if (
        tagOrStyledComponent &&
        tagOrStyledComponent.name === 'StyledComponent'
      ) {
        return tagOrStyledComponent.withComponent(
          withCustomClassNameProp(ResultComponent, customClassNameProp),
        )
      }
      return styled(
        withCustomClassNameProp(ResultComponent, customClassNameProp),
      )`
        ${tagOrStyledComponent};
      `
    }, RootComponent)
  }
})

export default withStyledClassNames
