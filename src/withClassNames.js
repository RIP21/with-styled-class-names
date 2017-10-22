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
    const RootComponent = strings
      ? styled(Component)(strings, interpolations)
      : Component
    return Object.entries(stylesMap).reduce((ResultComponent, entry) => {
      const propClass = entry[0]
      const value = entry[1]
      if (value.name === 'StyledComponent') {
        return value.withComponent(
          withCustomClassNameProp(ResultComponent, propClass),
        )
      }
      return styled(withCustomClassNameProp(ResultComponent, propClass))`
        ${value};
      `
    }, RootComponent)
  }
}

export default withClassNames
