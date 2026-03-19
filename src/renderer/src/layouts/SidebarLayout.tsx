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
              // children: [
              //   {
              //     label: 'List',
              //     key: 'departments-list',
              //     onClick: () => navigate('/departments')
              //   },
              //   {
              //     label: 'Register',
              //     key: 'departments-register',
              //     onClick: () => navigate('/departments/register')
              //   },
              //   {
              //     label: 'Import',
              //     key: 'departments-import',
              //     onClick: () => navigate('/departments/import')
              //   }
              // ]
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
              // children: [
              //   {
              //     label: 'List',
              //     key: 'employees-list',
              //     onClick: () => navigate('/employees')
              //   },
              //   {
              //     label: 'Register',
              //     key: 'employees-register',
              //     onClick: () => navigate('/employees/register')
              //   },
              //   {
              //     label: 'Import',
              //     key: 'employees-import',
              //     onClick: () => navigate('/employees/import')
              //   }
              // ]
            },
            {
              label: 'Positions',
              key: 'positions',
              icon: <UserPenIcon size={15} />,
              onClick: () => navigate('/positions')
              // children: [
              //   {
              //     label: 'List',
              //     key: 'positions-list',
              //     onClick: () => navigate('/positions')
              //   },
              //   {
              //     label: 'Register',
              //     key: 'positions-register',
              //     onClick: () => navigate('/positions/register')
              //   }
              // ]
            },
            {
              label: 'Awards/Disciplinary Actions',
              key: 'awards',
              icon: <AwardIcon size={15} />,
              onClick: () => navigate('/awards')
              // children: [
              //   { label: 'List', key: 'awards-list', onClick: () => navigate('/awards') },
              //   {
              //     label: 'Register',
              //     key: 'awards-register',
              //     onClick: () => navigate('/awards/register')
              //   }
              // ]
            },
            {
              label: 'Performance Evaluations',
              key: 'performance-evaluations',
              icon: <RadarChartOutlined />,
              onClick: () => navigate('/performance-evaluations')
              // children: [
              //   {
              //     label: 'List',
              //     key: 'performance-evaluations-list',
              //     onClick: () => navigate('/performance-evaluations')
              //   },
              //   {
              //     label: 'Register',
              //     key: 'performance-evaluations-register',
              //     onClick: () => navigate('/performance-evaluations/register')
              //   }
              // ]
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
