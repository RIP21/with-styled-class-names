# withStyledClassNames 🤡 
[![npm version](https://badge.fury.io/js/with-styled-class-names.svg)](https://badge.fury.io/js/with-styled-class-names) [![codecov](https://codecov.io/gh/RIP21/with-styled-class-names/branch/master/graph/badge.svg)](https://codecov.io/gh/RIP21/with-styled-class-names) [![Build Status](https://travis-ci.org/RIP21/with-styled-class-names.svg?branch=master)](https://travis-ci.org/RIP21/with-styled-class-names)

This is a tiny (666 bytes gzipped) zero dependency helpful utility function for `styled-components` which helps 
to override 3rd parties components with custom `className` props for their deep
nested children or different states. For example `activeClassName`, or 
`inputClassName` etc.

## Installation
Yarn:
```
yarn add with-class-names
```
npm:
```
npm install with-class-names --save
```

## Usage example

You basically pass 3rd party Component to be styled, and then an object with
keys as name of the props, and values as Tagged Template Literals with CSS, 
or with `styled-component` from which styles will be derived. 
Take a look at the example that have both of the options.

Simple: 
```jsx harmony
import { css } from 'styled-components'
import withStyledClassNames from 'with-styled-class-names'
import WithNestedClassNames from './WithNestedClassNames'

const StyledComponent = withStyledClassNames({
  activeClassName: `
    color: red;
  `,
  inputClassName: css`
    color: ${p => p.primary && `red`};
  `
  //Extend hack to immediately style container itself (hence default className prop)
}, WithNestedClassNames).extend`
  margin: 2px;
  background: blue;
`
```

More detailed example:

[![Edit with-class-names example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/k9zzro0wm7)

```jsx harmony
import withStyledClassNames from 'with-styled-class-names'
import styled, { css } from 'styled-components'

// 3rd party component with nested classNames options
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

// styled-component which from you would like to derive styles
const DerivedFromStyledComponent = styled.div`
  background: palevioletred;
  color: ${props => props.purple};

  &:hover {
    background: mediumaquamarine;
  }
`

// Usage 
// arg0: Component to style
// arg1: (key: NestedClassNameProp, value: Tagged Template Literal/StyledComponent)
const StyledComponent = withStyledClassNames({
  // This className will be populated with class of the DerivedFromStyledComponent  
  nestedClassName: DerivedFromStyledComponent,
  // If you want interpolations to work, use css from `styled-components` (PR welcome 😇)
  anotherNestedClassName: css`
    color: white;
    background: blue;
    border: ${p => p.color} 8px solid;
  `,
  // Nested 1 lvl deep classNamesProps supported too (like react-modal)
  objectClassNamesList: {
    first: `background: red;`,
    second: DerivedFromStyledComponent,
  }
}, Component).extend`
  background: black;
  color: ${p => p.color};
`;
```

## API

### withStyledClassNames
Curried `withStyledClassNames({}, Comp)` or `withStyledClassNames({})(Comp)` is possible.
Returns styled-component, so call .extend is possible and it will style root/container of the component.

Arguments:
 * styledMap: `ClassNamesProps: Object(key: classNameProp, value: TemplateLiteralCSS/StyledComponent)`   
 * Component: `Any React Component`  

Returns: `StyledComponent`
```
// All possible combintaions

withStyledClassNames(
  ClassNamesProps, 
  Component
)

withStyledClassNames(ClassNamesProps)(Component)
```

## Hacks and hints
Function return StyledComponent, so you can continue chaining its functions like
```jsx harmony
withStyledClassNames({}, Component).extend`background: red;`
```
To style container. And then to extend it further if you will export this component to outside world.
Hence `withComponent` and other handy styled reusage functions are here.

Another option to style main container is by using className prop like the others.
```jsx harmony
withStyledClassNames({ className: `background: red` }, Component)
```
Note that you need to use `css` helper function from styled-component in this case, to
have interpolation functions to work. (if you know how to solve that please PR)

## Known issues

If you want to interpolations to work for nested classNames please use `css` from 
`styled-components` like in the examples here. PR Welcome to fix that 😍
I gave up trying 😇
