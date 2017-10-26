import React from 'react'
import Aux from 'react-aux'
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

class ClassNamesLifter extends React.PureComponent {
  componentWillMount() {
    this.props.onLiftClassName(
      this.props.className,
      this.props.classNameProp,
      this.props.nestToProp,
    )
  }

  componentWillReceiveProps(newProps) {
    if (newProps.className !== this.props.className) {
      newProps.onLiftClassName(
        newProps.className,
        newProps.classNameProp,
        this.props.nestToProp,
      )
    }
  }

  render() {
    return null
  }
}

const isStyledComponent = value => value && value.name === 'StyledComponent'
const isObject = value =>
  value && !(value instanceof Array) && typeof value !== 'string'

class ClassNamesHolder extends React.PureComponent {
  constructor(props) {
    super(props)
    this.Styles = []
    Object.entries(props.stylesMap).forEach(entry => {
      const customClassNameProp = entry[0]
      const value = entry[1]
      if (value && value.name === 'StyledComponent') {
        this.Styles.push(this.createStyleWithSC(value, customClassNameProp))
      } else if (isObject(value)) {
        Object.entries(value).forEach(
          style =>
            isStyledComponent(style[1])
              ? this.Styles.push(
                  this.createStyleWithSC(
                    style[1],
                    style[0],
                    customClassNameProp,
                  ),
                )
              : this.Styles.push(
                  this.createStyleWithTag(
                    style[1],
                    style[0],
                    customClassNameProp,
                  ),
                ),
        )
      } else {
        this.Styles.push(this.createStyleWithTag(value, customClassNameProp))
      }
    })
  }

  createStyleWithSC = (value, customClassNameProp, nestToProp) => {
    return value.withComponent(props => (
      <ClassNamesLifter
        classNameProp={customClassNameProp}
        onLiftClassName={this.liftClassName}
        nestToProp={nestToProp}
        {...props}
      />
    ))
  }

  createStyleWithTag = (value, customClassNameProp, nestToProp) => {
    return styled(props => (
      <ClassNamesLifter
        classNameProp={customClassNameProp}
        onLiftClassName={this.liftClassName}
        nestToProp={nestToProp}
        {...props}
      />
    ))`
      ${value};
    `
  }

  renderStyles = () => {
    return this.Styles.map(SC => <SC {...this.props} />)
  }

  liftClassName = (className, nestedProp, nestToProp) => {
    !nestToProp
      ? this.setState({ [nestedProp]: className })
      : this.setState(prevState => ({
          [nestToProp]: { ...prevState[nestToProp], [nestedProp]: className },
        }))
  }

  render() {
    return (
      <Aux>
        {this.renderStyles()}
        <this.props.component {...this.props} {...this.state} />
      </Aux>
    )
  }
}

export const withClasses = (stylesMap, Component) => {
  const isComponentPassed = !!Component
  return isComponentPassed
    ? styled(props => {
        return (
          <ClassNamesHolder
            stylesMap={stylesMap}
            component={Component}
            {...props}
          />
        )
      })``
    : Component => {
        return styled(props => {
          return (
            <ClassNamesHolder
              stylesMap={stylesMap}
              component={Component}
              {...props}
            />
          )
        })``
      }
}
