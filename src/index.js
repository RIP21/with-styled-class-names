import React from 'react'
import { render } from 'react-dom'
import styled, { css } from 'styled-components'
import registerServiceWorker from './createServiceWorker'

import withStyledClassNames from './withStyledClassNames'

const Component = ({
  className,
  nestedClassName,
  anotherNestedClassName,
  ...props
}) => (
  <div className={className} {...props}>
    {'Root'}
    <div className={nestedClassName}>
      {'Nested One Level'}
      <div className={anotherNestedClassName}>Another nested</div>
    </div>
  </div>
)

const DerivedFromStyledComponent = styled.div`
  background: palevioletred;
  color: ${props => props.purple};

  &:hover {
    background: mediumaquamarine;
  }
`

const StyledComponent = withStyledClassNames(
  {
    nestedClassName: DerivedFromStyledComponent,
    anotherNestedClassName: css`
      color: white;
      background: blue;
      border: ${p => p.color} 8px solid;
    `,
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
