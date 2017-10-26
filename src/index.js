import React from 'react'
import { render } from 'react-dom'
import styled, { css } from 'styled-components'

import withStyledClassNames from './withStyledClassNames'
import { withClasses } from './withStyledClassNames'

const Component = ({
  nestedClassName,
  anotherNestedClassName,
  objectClassNameList,
  className,
  ...props
}) => {
  const first = objectClassNameList && objectClassNameList.first
  const second = objectClassNameList && objectClassNameList.second
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

const StyledComponent = withClasses(
  {
    nestedClassName: DerivedFromStyledComponent,
    anotherNestedClassName: css`
      color: white;
      background: blue;
      border: ${p => p.color} 8px solid;
      ${p => p.font && `font-size: 20px`};
    `,
    objectClassNameList: {
      first: css`
        background: black;
        border: ${p => p.color} 8px solid;
      `,
      second: Derived,
    },
  },
  Component,
).extend`background: red;`

const Curried = withClasses({
  nestedClassName: DerivedFromStyledComponent,
  anotherNestedClassName: css`
    color: white;
    background: blue;
    border: ${p => p.color} 8px solid;
  `,
})(Component).extend`background: #0074D9`

const App = () => (
  <div>
    <StyledComponent color="green" purple="purple" />
    <Curried color="yellow" purple="blue" />
  </div>
)

render(<App />, document.getElementById('root'))
