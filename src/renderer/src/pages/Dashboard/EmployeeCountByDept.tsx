import { trpc } from '@renderer/trpc';
import { theme } from 'antd';
import { ResponsiveContainer, Tooltip, Treemap } from 'recharts';

const EmployeeCountByDept = () => {
  const { token } = theme.useToken();
  const { data } = trpc.stats.getEmployeeCountByDept.useQuery();

  return (
    <div style={{ width: 500, height: 300 }}>
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <Treemap
          data={data}
          nameKey="departmentName"
          dataKey="employeeCount"
          fill={token.colorPrimaryHover}
          stroke={token.colorBgBase}
        >
          <Tooltip
            contentStyle={{
              backgroundColor: token.colorBgContainer,
              borderColor: token.colorBorder,
              borderRadius: token.borderRadius
            }}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

export default EmployeeCountByDept;
