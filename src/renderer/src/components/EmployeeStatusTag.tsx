import { Tag } from 'antd'
import { JSX } from 'react/jsx-runtime'

enum EmployeeStatus {
  Active = 'ACTIVE',
  OnLeave = 'ON_LEAVE',
  Suspended = 'SUSPENDED',
  Terminated = 'TERMINATED'
}

const employeeStatusToLabel: Record<EmployeeStatus, string> = {
  ACTIVE: 'Active',
  ON_LEAVE: 'On Leave',
  SUSPENDED: 'Suspended',
  TERMINATED: 'Terminated'
}

const employeeStatusToColor: Record<EmployeeStatus, string> = {
  ACTIVE: 'blue',
  ON_LEAVE: 'green',
  SUSPENDED: 'orange',
  TERMINATED: 'default'
}

interface Props {
  status: EmployeeStatus
}

const EmployeeStatusTag = ({ status }: Props): JSX.Element => {
  const color = employeeStatusToColor[status]
  const label = employeeStatusToLabel[status]
  return (
    <Tag color={color} variant="outlined">
      {label}
    </Tag>
  )
}

export default EmployeeStatusTag
