import React from 'react'
import styled, { css } from 'styled-components'
import { mount } from 'enzyme'
import withStyledClassNames from './withStyledClassNames'

const Component = props => {
  const {
    className,
    nestedClassName,
    anotherNestedClassName,
    objectClassNamesList = { first: {}, second: {} },
    ...rest
  } = props
  const { first, second } = objectClassNamesList
  return (
    <div id="root" className={className} {...rest}>
      {'Root'}
      <div id="nestedClassName" className={nestedClassName}>
        {'Nested One Level'}
        <div id="anotherNestedClassName" className={anotherNestedClassName}>
          Another nested
        </div>
        <div id="first" className={first}>
          Another first
        </div>
        <div id="second" className={second}>
          Another second
        </div>
      </div>
    </div>
  )
}

class Container extends React.PureComponent {
  state = { bool: false }

  onClick = () => {
    this.setState({ bool: true })
  }

  render() {
    const { children, ...rest } = this.props
    return React.cloneElement(children, {
      onClick: this.onClick,
      ...rest,
      ...this.state,
    })
  }
}

const DeriveStyles = styled.div`
  background: aliceblue;
`

describe('withStyledClassNames', () => {
  test('Style container', () => {
    const WithClassNames = withStyledClassNames({}, Component)
      .extend`background: red;`
    const rendered = mount(<WithClassNames />).find('#root')
    expect(rendered).toHaveStyleRule('background', 'red')
  })

  test('Style container and curried', () => {
    const WithClassNames = withStyledClassNames({})(Component)
      .extend`background: red;`
    const rendered = mount(<WithClassNames />).find('#root')
    expect(rendered).toHaveStyleRule('background', 'red')
  })

  test('Style container by deriving styles of other styled-component', () => {
    const WithClassNames = DeriveStyles.withComponent(
      withStyledClassNames({}, Component),
    )
    const rendered = mount(<WithClassNames />).find('#root')
    expect(rendered).toHaveStyleRule('background', 'aliceblue')
  })

  test('To not override className if already provided', () => {
    const WithClassNames = withStyledClassNames(
      {
        className: `background: red;`,
      },
      Component,
    )
    const rendered = mount(<WithClassNames />).find('#root')
    expect(rendered).toHaveProp('className')
    expect(rendered).toHaveStyleRule('background', 'red')
  })

  test('To provide nested props', () => {
    const WithClassNames = withStyledClassNames(
      {
        nestedClassName: `background: red;`,
      },
      Component,
    )
    const rendered = mount(<WithClassNames />)
    const nested = rendered.find('#nestedClassName')
    expect(nested).toHaveProp('className')
    expect(nested).toHaveStyleRule('background', 'red')
  })

  test('To provide one level nested props', () => {
    const WithClassNames = withStyledClassNames(
      {
        objectClassNamesList: {
          first: `background: yellow`,
          second: `background: purple`,
        },
      },
      Component,
    )
    const rendered = mount(<WithClassNames />)
    const first = rendered.find('#first')
    const second = rendered.find('#second')
    expect(first).toMatchSnapshot()
    expect(second).toMatchSnapshot()
    expect(first).toHaveProp('className')
    expect(first).toHaveStyleRule('background', 'yellow')
    expect(second).toHaveProp('className')
    expect(second).toHaveStyleRule('background', 'purple')
  })

  test('All levels could be styled by another styled-component', () => {
    const WithClassNames = withStyledClassNames(
      {
        nestedClassName: styled.div`
          background: red;
        `,
        objectClassNamesList: {
          first: styled.div`
            background: yellow;
          `,
          second: styled.div`
            background: purple;
          `,
        },
      },
      Component,
    )
    const rendered = mount(<WithClassNames />)
    const nestedClassName = rendered.find('#nestedClassName')
    const first = rendered.find('#first')
    const second = rendered.find('#second')
    expect(nestedClassName).toMatchSnapshot()
    expect(first).toMatchSnapshot()
    expect(second).toMatchSnapshot()
    expect(nestedClassName).toHaveProp('className')
    expect(nestedClassName).toHaveStyleRule('background', 'red')
    expect(first).toHaveProp('className')
    expect(first).toHaveStyleRule('background', 'yellow')
    expect(second).toHaveProp('className')
    expect(second).toHaveStyleRule('background', 'purple')
  })

  test('All levels props dependent styling working', () => {
    const WithClassNames = withStyledClassNames(
      {
        nestedClassName: css`
          ${p => p.bool && 'background: red;'};
        `,
        objectClassNamesList: {
          first: css`
            ${p => p.bool && 'background: yellow;'};
          `,
          second: css`
            ${p => p.bool && 'background: purple;'};
          `,
        },
      },
      Component,
    )

    const rendered = mount(<WithClassNames bool />)
    const nestedClassName = rendered.find('#nestedClassName')
    const first = rendered.find('#first')
    const second = rendered.find('#second')
    expect(nestedClassName).toMatchSnapshot()
    expect(first).toMatchSnapshot()
    expect(second).toMatchSnapshot()
    expect(nestedClassName).toHaveProp('className')
    expect(nestedClassName).toHaveStyleRule('background', 'red')
    expect(first).toHaveProp('className')
    expect(first).toHaveStyleRule('background', 'yellow')
    expect(second).toHaveProp('className')
    expect(second).toHaveStyleRule('background', 'purple')
  })

  test('Style changes on prop change', () => {
    const WithClassNames = withStyledClassNames(
      {
        nestedClassName: css`
          ${p => (p.bool ? 'background: red;' : 'background: blue')};
        `,
      },
      Component,
    )
    const rendered = mount(
      <Container>
        <WithClassNames />
      </Container>,
    )
    expect(rendered.find('#nestedClassName')).toHaveStyleRule(
      'background',
      'blue',
    )
    rendered.simulate('click')
    expect(rendered.find('#nestedClassName')).toHaveStyleRule(
      'background',
      'red',
    )
  })
})
