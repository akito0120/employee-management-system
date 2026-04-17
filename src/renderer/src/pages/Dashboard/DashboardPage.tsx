import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { trpc } from '@renderer/trpc';
import { Breadcrumb, Card, Flex, Statistic, theme } from 'antd';
import { format } from 'date-fns';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useEffect } from 'react';
import ReactGridLayout, { Layout, useContainerWidth } from 'react-grid-layout';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Treemap,
  XAxis,
  YAxis
} from 'recharts';

const dashboardLayoutAtom = atomWithStorage<Layout>('dashboard-layout', [
  { i: 'employee-count', x: 0, y: 0, w: 3, h: 3, isResizable: false },
  { i: 'today', x: 3, y: 0, w: 3, h: 3, isResizable: false },
  { i: 'average-salary', x: 6, y: 0, w: 3, h: 3, isResizable: false },
  { i: 'd', x: 0, y: 3, w: 6, h: 10, isResizable: false },
  { i: 'employee-count-by-dept', x: 6, y: 3, w: 6, h: 10, isResizable: false },
  { i: 'f', x: 0, y: 13, w: 6, h: 10, isResizable: false },
  { i: 'g', x: 6, y: 13, w: 6, h: 10, isResizable: false },
  { i: 'dept-count', x: 9, y: 0, w: 3, h: 3, isResizable: false },
  { i: 'sub-dept-count', x: 1, y: 1, w: 3, h: 3, isResizable: false },
  { i: 'unit-count', x: 1, y: 1, w: 3, h: 3, isResizable: false },
  { i: 'divider-1', x: 0, y: 23, w: 12, h: 2 },
  { i: 'divider-2', x: 0, y: 25, w: 12, h: 2 },
  { i: 'activity-stats', x: 6, y: 3, w: 6, h: 10, isResizable: false }
]);

const LineChartDemo = () => {
  const { token } = theme.useToken();

  const data = [
    { name: 'Jan', pv: 400, count: 2400 },
    { name: 'Feb', pv: 300, count: 1398 },
    { name: 'Mar', pv: 200, count: 9800 },
    { name: 'Apr', pv: 278, count: 3908 }
  ];

  return (
    <div style={{ width: 500, height: 300 }}>
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <LineChart data={data} width={500} height={300}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: token.colorBgContainer,
              borderColor: token.colorBorder,
              borderRadius: token.borderRadius
            }}
          />
          <Line type="linear" dataKey="count" stroke={token.colorPrimaryHover} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const EmployeeCountByDept = () => {
  const { token } = theme.useToken();
  const { data } = trpc.stats.getEmployeeCountByDept.useQuery();

  useEffect(() => {
    console.log(data);
  }, [data]);

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

const BarChartDemo = () => {
  const { token } = theme.useToken();

  const data = [
    { name: 'IT', avg: 3500 },
    { name: 'Sales', avg: 3000 },
    { name: 'Marketing', avg: 2800 },
    { name: 'Human Resources', avg: 3200 }
  ];

  return (
    <div style={{ width: 500, height: 300 }}>
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <BarChart width={500} height={300} data={data} barCategoryGap={20}>
          <XAxis dataKey="name" />
          <YAxis unit="€" dataKey="avg" />
          <Bar dataKey="avg" fill={token.colorPrimaryHover} radius={token.borderRadius} />
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

const EmployeeCountByStatus = () => {
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

const EmployeeCount = () => {
  const { data, isLoading } = trpc.stats.getEmploteeCount.useQuery();

  return (
    <Statistic title="Total Employee Count" value={data} loading={isLoading} suffix="employees" />
  );
};

const AverageSalary = () => {
  const { data, isLoading } = trpc.stats.getAverageSalary.useQuery();

  return <Statistic title="Average Salary" value={data} loading={isLoading} prefix="€" />;
};

const DeptCount = () => {
  const { data, isLoading } = trpc.stats.getDeptCount.useQuery();

  return (
    <Statistic
      title="Total Department Count"
      value={data}
      loading={isLoading}
      suffix="departments"
    />
  );
};

const SubDeptCount = () => {
  const { data, isLoading } = trpc.stats.getSubDeptCount.useQuery();

  return (
    <Statistic
      title="Total Sub Department Count"
      value={data}
      loading={isLoading}
      suffix="sub departments"
    />
  );
};

const UnitCount = () => {
  const { data, isLoading } = trpc.stats.getUnitCount.useQuery();

  return <Statistic title="Total Unit Count" value={data} loading={isLoading} suffix="units" />;
};

const ActivityStats = () => {
  const { token } = theme.useToken();

  const data = [
    { name: 'Mon', dept: 10, subDept: 3, unit: 12, empl: 20 },
    { name: 'Tue', dept: 1, subDept: 0, unit: 0, empl: 10 },
    { name: 'Wed', dept: 0, subDept: 0, unit: 8, empl: 0 },
    { name: 'Thu', dept: 0, subDept: 0, unit: 0, empl: 2 },
    { name: 'Fri', dept: 0, subDept: 0, unit: 3, empl: 7 }
  ];

  return (
    <div style={{ width: 500, height: 300 }}>
      <ResponsiveContainer>
        <AreaChart data={data} width={500} height={300}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: token.colorBgContainer,
              borderColor: token.colorBorder,
              borderRadius: token.borderRadius
            }}
            itemStyle={{ color: token.colorPrimaryHover }}
          />

          {['dept', 'subDept', 'unit', 'empl'].map((dataKey) => (
            <Area
              key={dataKey}
              type="monotone"
              dataKey={dataKey}
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

const DashboardPage = () => {
  const { width, containerRef, mounted } = useContainerWidth();
  const [savedLayout, setSavedLayout] = useAtom(dashboardLayoutAtom);

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: 'Dashboard' }]} />

      <div ref={containerRef}>
        {mounted && (
          <ReactGridLayout
            layout={savedLayout}
            width={width}
            gridConfig={{ cols: 12, rowHeight: 30, containerPadding: [0, 0] }}
            onDragStop={(layout) => setSavedLayout(layout)}
            onResizeStop={(layout) => setSavedLayout(layout)}
          >
            <Card key="employee-count">
              <EmployeeCount />
            </Card>

            <Card key="today">
              <Statistic title="Today's Date" value={format(new Date(), 'yyyy/MM/dd')} />
            </Card>

            <Card key="average-salary">
              <AverageSalary />
            </Card>

            <Card key="d" title="Monthly Employee Count">
              <LineChartDemo />
            </Card>

            <Card key="employee-count-by-dept" title="Employee Count by Department">
              <EmployeeCountByDept />
            </Card>

            <Card key="f" title="Average Salary by Department">
              <BarChartDemo />
            </Card>

            <Card key="g" title="Employee Count By Status">
              <EmployeeCountByStatus />
            </Card>

            <Card key="divider-1" />
            <Card key="divider-2" />

            <Card key="dept-count">
              <DeptCount />
            </Card>

            <Card key="sub-dept-count">
              <SubDeptCount />
            </Card>

            <Card key="unit-count">
              <UnitCount />
            </Card>

            <Card key="activity-stats" title="Activities">
              <ActivityStats />
            </Card>
          </ReactGridLayout>
        )}
      </div>
    </Flex>
  );
};

export default DashboardPage;
