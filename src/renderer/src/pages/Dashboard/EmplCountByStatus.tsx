import { trpc } from '@renderer/trpc';
import { theme } from 'antd';
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const EmplCountByStatus = () => {
  const { token } = theme.useToken();
  const { data } = trpc.stats.getEmployeeCountByStatus.useQuery();

  return (
    <div style={{ width: 500, height: 300 }}>
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <PieChart width={500} height={300}>
          <Pie
            fill={token.colorPrimaryHover}
            stroke={token.colorBgBase}
            data={data}
            dataKey="employeeCount"
            nameKey="status"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: token.colorBgContainer,
              borderColor: token.colorBorder,
              borderRadius: token.borderRadius
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmplCountByStatus;
