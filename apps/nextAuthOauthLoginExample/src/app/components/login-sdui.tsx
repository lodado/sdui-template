'use client'

import { SduiLayoutRenderer } from '@lodado/sdui-template'

import { loginDocument } from '../lib/sdui-document'
import { sduiComponents } from './sdui-components'

const LoginSdui = () => {
  return <SduiLayoutRenderer document={loginDocument} components={sduiComponents} />
}

export default LoginSdui
