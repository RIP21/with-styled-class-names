import React from 'react'
import styled from 'styled-components'

function Aux(props) {
  return props.children
}

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
    this.Styles = this.generateStylesLifters(props.stylesMap)
  }

  buildStyleLifter = (customClassNameProp, nestToProp) => props => (
    <ClassNamesLifter
      classNameProp={customClassNameProp}
      onLiftClassName={this.liftClassName}
      nestToProp={nestToProp}
      {...props}
    />
  )

  createStyleWithSC = (value, customClassNameProp, nestToProp) => {
    return value.withComponent(
      this.buildStyleLifter(customClassNameProp, nestToProp),
    )
  }

  createStyleWithTag = (value, customClassNameProp, nestToProp) => {
    return styled(this.buildStyleLifter(customClassNameProp, nestToProp))`
      ${value};
    `
  }

  generateStylesLifters = stylesMap => {
    const StylesLifters = []
    Object.entries(stylesMap).forEach(([customClassNameProp, value]) => {
      if (isStyledComponent(value)) {
        StylesLifters.push(this.createStyleWithSC(value, customClassNameProp))
      } else if (isObject(value)) {
        Object.entries(value).forEach(
          ([key, value]) =>
            isStyledComponent(value)
              ? StylesLifters.push(
                  this.createStyleWithSC(value, key, customClassNameProp),
                )
              : StylesLifters.push(
                  this.createStyleWithTag(value, key, customClassNameProp),
                ),
        )
      } else {
        StylesLifters.push(this.createStyleWithTag(value, customClassNameProp))
      }
    })
    return StylesLifters
  }

  renderStyles = () => {
    return this.Styles.map((SC, index) => <SC key={index} {...this.props} />)
  }

  liftClassName = (className, nestedProp, nestToProp) => {
    if (!nestToProp) {
      this.setState({ [nestedProp]: className })
    } else {
      this.setState(prevState => {
        const previousState = prevState ? prevState[nestToProp] : {}
        return {
          [nestToProp]: { ...previousState, [nestedProp]: className },
        }
      })
    }
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

const buildClassNamesHolder = (stylesMap, Component) =>
  styled(props => (
    <ClassNamesHolder stylesMap={stylesMap} component={Component} {...props} />
  ))``

export const withStyledClassNames = (stylesMap, Component) => {
  const isComponentPassed = !!Component
  return isComponentPassed
    ? buildClassNamesHolder(stylesMap, Component)
    : Component => {
        return buildClassNamesHolder(stylesMap, Component)
      }
}

export default withStyledClassNames
