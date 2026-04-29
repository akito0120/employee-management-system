import styled from '@emotion/styled';
import { trpc } from '@renderer/trpc';
import { theme } from 'antd';
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const StyledPirChart = styled(PieChart)`
  .recharts-wrapper:focus,
  .recharts-surface:focus,
  .recharts-sector:focus {
    outline: none;
  }
`;

const EmplCountByStatus = () => {
  const { token } = theme.useToken();
  const { data } = trpc.stats.getEmployeeCountByStatus.useQuery();

  return (
    <div style={{ width: 500, height: 300 }}>
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <StyledPirChart width={500} height={300}>
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
        </StyledPirChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmplCountByStatus;
