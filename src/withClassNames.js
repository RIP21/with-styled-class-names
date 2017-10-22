import React from 'react'
import styled from 'styled-components'

const withCustomClassNameProp = (Component, propClass) => ({
  className,
  ...rest
}) => {
  const props = { ...rest, [propClass]: className }
  return <Component {...props} />
}

const withClassNames = (Component, stylesMap) => {
  return (strings, ...interpolations) => {
    const RootComponent =
      (strings != null && strings.length > 0) ||
      (strings != null && interpolations.length > 0)
        ? styled(Component)(strings, interpolations)
        : Component
    return Object.entries(stylesMap).reduce((ResultComponent, entry) => {
      const customClassNameProp = entry[0]
      const tagOrStyledComponent = entry[1]
      if (tagOrStyledComponent.name === 'StyledComponent') {
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
}

export default withClassNames
