import React from 'react'
import styled, { css } from 'styled-components'
import { shallow, mount } from 'enzyme'
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
    <div id="root" className={className} {...props}>
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

const DeriveStyles = styled.div`
  background: aliceblue;
`

describe('withStyledClassNames', () => {
  test('Style container', () => {
    const WithClassNames = withStyledClassNames({}, Component)`background: red;`
    const rendered = shallow(<WithClassNames />)
    expect(rendered).toHaveStyleRule('background', 'red')
  })

  test('Style container and curried', () => {
    const WithClassNames = withStyledClassNames({})(Component)`background: red;`
    const rendered = shallow(<WithClassNames />)
    expect(rendered).toHaveStyleRule('background', 'red')
  })

  test('Style container by deriving styles of other styled-component', () => {
    const WithClassNames = withStyledClassNames({}, Component)(DeriveStyles)
    const rendered = shallow(<WithClassNames />)
    expect(rendered).toHaveStyleRule('background', 'aliceblue')
  })

  test('Do not style container if empty', () => {
    const WithClassNames = withStyledClassNames({}, Component)()
    const rendered = shallow(<WithClassNames />)
    expect(rendered).toHaveProp('className', undefined)
  })

  test('To not override className if already provided', () => {
    const WithClassNames = withStyledClassNames(
      {
        className: `background: red;`,
      },
      Component,
    )`background: blue;`
    const rendered = shallow(<WithClassNames />)
    expect(rendered).toHaveProp('className')
    expect(rendered).not.toHaveStyleRule('background', 'blue')
  })

  test('To provide nested props', () => {
    const WithClassNames = withStyledClassNames(
      {
        nestedClassName: `background: red;`,
      },
      Component,
    )()
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
    )`background: blue`
    const rendered = mount(<WithClassNames />)
    const first = rendered.find('#first')
    const second = rendered.find('#second')
    const root = rendered.find('#root')
    expect(first).toMatchSnapshot()
    expect(second).toMatchSnapshot()
    expect(root).toMatchSnapshot()
    expect(first).toHaveProp('className')
    expect(root).toHaveStyleRule('background', 'blue')
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
    )(
      styled.div`
        background: blue;
      `,
    )
    const rendered = mount(<WithClassNames />)
    const root = rendered.find('#root')
    const nestedClassName = rendered.find('#nestedClassName')
    const first = rendered.find('#first')
    const second = rendered.find('#second')
    expect(root).toMatchSnapshot()
    expect(nestedClassName).toMatchSnapshot()
    expect(first).toMatchSnapshot()
    expect(second).toMatchSnapshot()
    expect(root).toHaveProp('className')
    expect(root).toHaveStyleRule('background', 'blue')
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
    )`
        ${p => p.bool && 'background: blue;'}
      `

    const rendered = mount(<WithClassNames bool />)
    const root = rendered.find('#root')
    const nestedClassName = rendered.find('#nestedClassName')
    const first = rendered.find('#first')
    const second = rendered.find('#second')
    expect(root).toMatchSnapshot()
    expect(nestedClassName).toMatchSnapshot()
    expect(first).toMatchSnapshot()
    expect(second).toMatchSnapshot()
    expect(root).toHaveProp('className')
    expect(root).toHaveStyleRule('background', 'blue')
    expect(nestedClassName).toHaveProp('className')
    expect(nestedClassName).toHaveStyleRule('background', 'red')
    expect(first).toHaveProp('className')
    expect(first).toHaveStyleRule('background', 'yellow')
    expect(second).toHaveProp('className')
    expect(second).toHaveStyleRule('background', 'purple')
  })
})
