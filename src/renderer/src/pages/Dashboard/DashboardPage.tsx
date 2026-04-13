import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { Breadcrumb, Card, Flex, Statistic } from 'antd';
import { format } from 'date-fns';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import ReactGridLayout, { Layout, useContainerWidth } from 'react-grid-layout';

const dashboardLayoutAtom = atomWithStorage<Layout>('dashboard-layout', [
  { i: 'a', x: 0, y: 0, w: 3, h: 3, minW: 3, minH: 3 },
  { i: 'b', x: 1, y: 0, w: 3, h: 3, minW: 3, minH: 3 },
  { i: 'c', x: 4, y: 0, w: 3, h: 3, minW: 3, minH: 3 }
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
            <Card key="a">
              <Statistic title="Total Employee Count" value={13} suffix="employees" />
            </Card>
            <Card key="b">
              <Statistic title="Date" value={format(new Date(), 'yyyy/MM/dd')} />
            </Card>
            <Card key="c">
              <Statistic title="Average Salary" value={1000} prefix="€" />
            </Card>
          </ReactGridLayout>
        )}
      </div>
    </Flex>
  );
};

export default DashboardPage;
