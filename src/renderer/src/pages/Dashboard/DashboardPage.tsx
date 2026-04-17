import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { Breadcrumb, Card, Flex, Statistic } from 'antd';
import { format } from 'date-fns';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import ReactGridLayout, { Layout, useContainerWidth } from 'react-grid-layout';

import ActivityStats from './ActivityStats';
import AvgSalaryByDept from './AvgSalaryByDept';
import EmplCountByJobGrade from './EmplCountByJobGrade';
import EmplCountByStatus from './EmplCountByStatus';
import EmployeeCountByDept from './EmployeeCountByDept';
import { AverageSalary, DeptCount, EmployeeCount, SubDeptCount, UnitCount } from './SimpleStats';

const dashboardLayoutAtom = atomWithStorage<Layout>('dashboard-layout', [
  // Simple Stats
  { i: 'employee-count', x: 0, y: 0, w: 3, h: 3, isResizable: false },
  { i: 'average-salary', x: 3, y: 0, w: 3, h: 3, isResizable: false },
  { i: 'dept-count', x: 6, y: 0, w: 3, h: 3, isResizable: false },
  { i: 'sub-dept-count', x: 9, y: 0, w: 3, h: 3, isResizable: false },
  { i: 'unit-count', x: 0, y: 3, w: 3, h: 3, isResizable: false },
  { i: 'today', x: 3, y: 3, w: 3, h: 3, isResizable: false },
  // Charts
  { i: 'employee-count-by-dept', x: 6, y: 6, w: 6, h: 10, isResizable: false },
  { i: 'empl-count-by-status', x: 0, y: 6, w: 6, h: 10, isResizable: false },
  { i: 'avg-salary-by-dept', x: 6, y: 16, w: 6, h: 10, isResizable: false },
  { i: 'empl-count-by-job-grade', x: 0, y: 16, w: 6, h: 10, isResizable: false },
  { i: 'activity-stats', x: 6, y: 26, w: 12, h: 10, isResizable: false },
  // Dividers
  { i: 'divider-1', x: 6, y: 3, w: 6, h: 3 },
  { i: 'divider-2', x: 0, y: 36, w: 12, h: 2 }
]);

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

            <Card key="employee-count-by-dept" title="Employee Count by Department">
              <EmployeeCountByDept />
            </Card>

            <Card key="avg-salary-by-dept" title="Average Salary by Department">
              <AvgSalaryByDept />
            </Card>

            <Card key="empl-count-by-status" title="Employee Count by Status">
              <EmplCountByStatus />
            </Card>

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

            <Card key="empl-count-by-job-grade" title="Employee Count by Job Grade">
              <EmplCountByJobGrade />
            </Card>

            <Card key="divider-1" />
            <Card key="divider-2" />
          </ReactGridLayout>
        )}
      </div>
    </Flex>
  );
};

export default DashboardPage;
