import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { Breadcrumb, Card, Flex, Statistic, theme } from 'antd';
import { format } from 'date-fns';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import ReactGridLayout, { Layout, useContainerWidth } from 'react-grid-layout';
import {
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
  { i: 'a', x: 0, y: 0, w: 3, h: 3, isResizable: false },
  { i: 'b', x: 3, y: 0, w: 3, h: 3, isResizable: false },
  { i: 'c', x: 6, y: 0, w: 3, h: 3, isResizable: false },
  { i: 'd', x: 0, y: 3, w: 6, h: 10, isResizable: false },
  { i: 'e', x: 6, y: 3, w: 6, h: 10, isResizable: false },
  { i: 'f', x: 0, y: 13, w: 6, h: 10, isResizable: false },
  { i: 'g', x: 6, y: 13, w: 6, h: 10, isResizable: false },
  { i: 'h', x: 9, y: 0, w: 3, h: 3, isResizable: false },
  { i: 'divider-1', x: 0, y: 23, w: 12, h: 2 },
  { i: 'divider-2', x: 0, y: 25, w: 12, h: 2 }
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

const PieChartDemo = () => {
  const { token } = theme.useToken();

  return (
    <div style={{ width: 500, height: 300 }}>
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <Treemap
          data={[
            { name: 'IT', count: 590 },
            { name: 'Marketing', count: 590 },
            { name: 'Sales', count: 868 },
            { name: 'Human Resources', count: 308 }
          ]}
          nameKey="name"
          dataKey="count"
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

  return (
    <div style={{ width: 500, height: 300 }}>
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        <PieChart width={500} height={300}>
          <Pie
            fill={token.colorPrimaryHover}
            stroke={token.colorBgBase}
            data={[
              { status: 'Active', count: 590 },
              { status: 'Suspended', count: 16 },
              { status: 'On Leave', count: 8 },
              { status: 'Terminated', count: 60 }
            ]}
            dataKey="count"
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
            <Card key="a">
              <Statistic title="Total Employee Count" value={13} suffix="employees" />
            </Card>

            <Card key="b">
              <Statistic title="Today's Date" value={format(new Date(), 'yyyy/MM/dd')} />
            </Card>

            <Card key="c">
              <Statistic title="Average Salary" value={1000} prefix="€" />
            </Card>

            <Card key="d" title="Monthly Employee Count">
              <LineChartDemo />
            </Card>

            <Card key="e" title="Employee Count by Department">
              <PieChartDemo />
            </Card>

            <Card key="f" title="Average Salary by Department">
              <BarChartDemo />
            </Card>

            <Card key="g" title="Employee Count By Status">
              <EmployeeCountByStatus />
            </Card>

            <Card key="divider-1" />
            <Card key="divider-2" />

            <Card key="h">
              <Statistic title="Total Position Count" value={43} suffix="positions" />
            </Card>
          </ReactGridLayout>
        )}
      </div>
    </Flex>
  );
};

export default DashboardPage;
