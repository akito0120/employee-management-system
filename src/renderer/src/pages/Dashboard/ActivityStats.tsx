import { trpc } from '@renderer/trpc';
import { theme } from 'antd';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const ActivityStats = () => {
  const { token } = theme.useToken();
  const { data } = trpc.stats.getActivitieStats.useQuery();

  return (
    <div style={{ width: 1000, height: 300 }}>
      <ResponsiveContainer>
        <AreaChart data={data} width={1000} height={300}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: token.colorBgContainer,
              borderColor: token.colorBorder,
              borderRadius: token.borderRadius
            }}
            itemStyle={{ color: token.colorPrimaryHover }}
          />

          {[
            'DEPARTMENT',
            'SUB_DEPARTMENT',
            'UNIT',
            'POSITION',
            'EMPLOYEE',
            'COMMENDATION',
            'PERFORMANCE_EVALUATION'
          ].map((dataKey) => (
            <Area
              key={dataKey}
              type="monotone"
              dataKey={`value.${dataKey}`}
              stackId="1"
              fill={token.colorPrimaryHover}
              stroke={token.colorBgBase}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityStats;
