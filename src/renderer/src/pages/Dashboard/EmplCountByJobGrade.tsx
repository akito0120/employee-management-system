import { trpc } from '@renderer/trpc';
import { theme } from 'antd';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const EmplCountByJobGrade = () => {
  const { token } = theme.useToken();
  const { data } = trpc.stats.getEmployeeCountByJobGrade.useQuery();

  return (
    <div style={{ width: 500, height: 300 }}>
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <BarChart width={500} height={300} data={data} barCategoryGap={20}>
          <XAxis dataKey="grade" />
          <YAxis dataKey="employeeCount" />
          <Bar dataKey="employeeCount" fill={token.colorPrimaryHover} radius={token.borderRadius} />
          <Tooltip
            contentStyle={{
              backgroundColor: token.colorBgContainer,
              borderColor: token.colorBorder,
              borderRadius: token.borderRadius
            }}
            cursor={{ fill: token.colorBgBlur }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmplCountByJobGrade;
