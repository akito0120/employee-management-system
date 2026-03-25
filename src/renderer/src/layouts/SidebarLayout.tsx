import { RadarChartOutlined } from '@ant-design/icons';
import UserCard from '@renderer/components/UserCard';
import { trpc } from '@renderer/trpc';
import { Col, Menu, Row } from 'antd';
import Card from 'antd/es/card/Card';
import {
  ArrowBigUpIcon,
  AwardIcon,
  Building2Icon,
  BuildingIcon,
  IdCardLanyardIcon,
  UserPenIcon,
  Users2Icon
} from 'lucide-react';
import { JSX } from 'react/jsx-runtime';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const SidebarLayout = (): JSX.Element => {
  const navigate = useNavigate();
  const menuSpan = 5;
  const contentSpan = 24 - menuSpan;
  const { data: me, isFetching } = trpc.auth.getMe.useQuery();

  if (!isFetching && !me) return <Navigate to="login" />;

  return (
    <Row gutter={0}>
      <Col
        style={{ height: '100vh', top: 0, left: 0, position: 'sticky', zIndex: 1 }}
        span={menuSpan}
      >
        <Menu
          style={{ height: '90%', overflow: 'auto', margin: 0 }}
          mode="inline"
          items={[
            {
              label: 'Departments',
              key: 'departments',
              icon: <BuildingIcon size={15} />,
              onClick: () => navigate('/departments')
            },
            {
              label: 'Sub Departments',
              key: 'sub-departments',
              icon: <Building2Icon size={15} />,
              onClick: () => navigate('/sub-departments')
            },
            {
              key: 'units',
              label: 'Units',
              icon: <Users2Icon size={15} />,
              onClick: () => navigate('/units')
            },
            {
              label: 'Employees',
              key: 'employees',
              icon: <IdCardLanyardIcon size={15} />,
              onClick: () => navigate('/employees')
            },
            {
              label: 'Positions',
              key: 'positions',
              icon: <UserPenIcon size={15} />,
              onClick: () => navigate('/positions')
            },
            {
              label: 'Rewards/Disciplinary Actions',
              key: 'rewards',
              icon: <AwardIcon size={15} />,
              onClick: () => navigate('/rewards')
            },
            {
              label: 'Performance Evaluations',
              key: 'performance-evaluations',
              icon: <RadarChartOutlined />,
              onClick: () => navigate('/performance-evaluations')
            },
            {
              label: 'Promotions',
              key: 'promotions',
              icon: <ArrowBigUpIcon size={15} />,
              onClick: () => navigate('/promotions')
            }
          ]}
        />

        <UserCard />
      </Col>

      <Col style={{ minHeight: '100vh' }} span={contentSpan}>
        <Card
          variant="borderless"
          style={{ height: '100%', borderRadius: 0 }}
          styles={{ body: { padding: 0 }, title: { padding: 0 } }}
        >
          <Outlet />
        </Card>
      </Col>
    </Row>
  );
};

export default SidebarLayout;
