# withClassNames 🤡

This is a tiny helpful utility function for `styled-components` which helps 
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
or with `styled-component` form which styles will be derived. 
Take a look at the example having both of the options.

[![Edit with-class-names example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/k9zzro0wm7)

```jsx harmony
import withClassNames from 'with-class-names'
import styled, { css } from 'styled-components'

// 3rd party component with nested classNames options
const Component = ({
  className,
  nestedClassName,
  anotherNestedClassName,
  ...props
}) => (
  <div className={className} {...props}>
    {"Root"}
    <div className={nestedClassName}>
      {"Nested One Level"}
      <div className={anotherNestedClassName}>Another nested</div>
    </div>
  </div>
);

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
const StyledComponent = withClassNames(Component, {
  // This className will be populated with class of the DerivedFromStyledComponent  
  nestedClassName: DerivedFromStyledComponent,
  // If you want interpolations to work, use css from `styled-components` (PR welcome 😇)
  anotherNestedClassName: css`
    color: white;
    background: blue;
    border: ${p => p.color} 8px solid;
  `
  // Here is the styles of the wrapper. So the one that will come to className
  // as if you call styled(Component)``
})`
  background: black;
  color: ${p => p.color};
`;
```

## Known issues

If you want to interpolations to work for nested classNames please use `css` from 
`styled-components` for them to work like in the example here. PR Welcome to fix that :)
I give up trying :D