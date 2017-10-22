import React from 'react'
import styled from 'styled-components'
import reduce from 'lodash.reduce'

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
    return reduce(
      stylesMap,
      (ResultComponent, value, propClass) => {
        if (value.name === 'StyledComponent') {
          return value.withComponent(
            withCustomClassNameProp(ResultComponent, propClass),
          )
        }
        return styled(withCustomClassNameProp(ResultComponent, propClass))`
          ${value};
        `
      },
      RootComponent,
    )
  }
}

export default withClassNames
