import React from 'react'
import { render } from 'react-dom'
import styled, { css } from 'styled-components'
import registerServiceWorker from './createServiceWorker'

import withStyledClassNames from './withStyledClassNames'

const Component = ({
  className,
  nestedClassName,
  anotherNestedClassName,
  objectClassNamesList = { first: {}, second: {} },
  ...props
}) => {
  const { first, second } = objectClassNamesList
  return (
    <div className={className} {...props}>
      {'Root'}
      <div className={nestedClassName}>
        {'Nested One Level'}
        <div className={anotherNestedClassName}>Another nested</div>
        <div className={first}>Another first</div>
        <div className={second}>Another second</div>
      </div>
    </div>
  )
}
const DerivedFromStyledComponent = styled.div`
  background: palevioletred;
  color: ${props => props.purple};

  &:hover {
    background: mediumaquamarine;
  }
`

const Derived = styled.div`
  background: white;
`

const StyledComponent = withStyledClassNames(
  {
    nestedClassName: DerivedFromStyledComponent,
    anotherNestedClassName: css`
      color: white;
      background: blue;
      border: ${p => p.color} 8px solid;
    `,
    objectClassNameListProp: {
      first: css`
        background: black;
        border: ${p => p.color} 8px solid;
      `,
      second: Derived,
    },
  },
  Component,
)()

const Curried = withStyledClassNames({
  nestedClassName: DerivedFromStyledComponent,
  anotherNestedClassName: css`
    color: white;
    background: blue;
    border: ${p => p.color} 8px solid;
  `,
})(Component)(DerivedFromStyledComponent)

const App = () => (
  <div>
    <StyledComponent color="green" purple="purple" />
    <Curried color="yellow" purple="blue" />
  </div>
)

render(<App />, document.getElementById('root'))
registerServiceWorker()
