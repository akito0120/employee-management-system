import { Breadcrumb, Flex } from 'antd'
import { JSX } from 'react/jsx-runtime'

const RegisterPositionPage = (): JSX.Element => {
  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Positions' }, { title: 'Register' }]} />
    </Flex>
  )
}

export default RegisterPositionPage
