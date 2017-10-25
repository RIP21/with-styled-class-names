import 'jest-enzyme'
import 'jest-styled-components'
import enzyme from 'enzyme'
import './shim'

import Adapter from 'enzyme-adapter-react-16'
enzyme.configure({ adapter: new Adapter() })
console.error = () => {} //To suppress browser errors that React generates for tests
