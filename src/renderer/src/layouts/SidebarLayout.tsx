import { EditOutlined, RadarChartOutlined } from '@ant-design/icons';
import UserCard from '@renderer/components/UserCard';
import { useInstitutionName } from '@renderer/hooks/metadata';
import { trpc } from '@renderer/trpc';
import { Button, Col, Flex, Menu, Row, theme, Typography } from 'antd';
import Card from 'antd/es/card/Card';
import {
  AwardIcon,
  Building2Icon,
  BuildingIcon,
  CctvIcon,
  IdCardLanyardIcon,
  UserPenIcon,
  Users2Icon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const SidebarLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const menuSpan = 5;
  const contentSpan = 24 - menuSpan;
  const { data: me, isFetching } = trpc.auth.getMe.useQuery();
  const [institutionName] = useInstitutionName();
  const { token } = theme.useToken();

  if (!isFetching && !me) return <Navigate to="login" />;

  return (
    <Row gutter={0}>
      <Col
        style={{ height: '100vh', top: 0, left: 0, position: 'sticky', zIndex: 1 }}
        span={menuSpan}
      >
        <Card
          style={{
            borderRight: `solid 1px ${token.colorBorder}`,
            width: '100%',
            height: '8%',
            borderRadius: 0
          }}
          styles={{
            title: { padding: 0, margin: 0 },
            body: {
              padding: 0,
              height: '100%',
              paddingLeft: '1rem',
              paddingRight: '1rem'
            }
          }}
        >
          <Flex gap="middle" justify="center" align="center" style={{ height: '100%' }}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {institutionName}
            </Typography.Title>
            <Button icon={<EditOutlined />} variant="text" color="default" />
          </Flex>
        </Card>

        <Menu
          style={{ height: '82%', overflow: 'auto', margin: 0, padding: '0.5rem' }}
          mode="inline"
          items={[
            {
              label: t('sidebar.departments'),
              key: 'departments',
              icon: <BuildingIcon size={15} />,
              onClick: () => navigate('/departments')
            },
            {
              label: t('sidebar.subDepartments'),
              key: 'sub-departments',
              icon: <Building2Icon size={15} />,
              onClick: () => navigate('/sub-departments')
            },
            {
              label: t('sidebar.units'),
              key: 'units',
              icon: <Users2Icon size={15} />,
              onClick: () => navigate('/units')
            },
            {
              label: t('sidebar.positions'),
              key: 'positions',
              icon: <UserPenIcon size={15} />,
              onClick: () => navigate('/positions')
            },
            {
              label: t('sidebar.employees'),
              key: 'employees',
              icon: <IdCardLanyardIcon size={15} />,
              onClick: () => navigate('/employees')
            },
            {
              label: t('sidebar.commendations'),
              key: 'commendations',
              icon: <AwardIcon size={15} />,
              onClick: () => navigate('/commendations')
            },
            {
              label: t('sidebar.performanceEvaluations'),
              key: 'performance-evaluations',
              icon: <RadarChartOutlined />,
              onClick: () => navigate('/performance-evaluations')
            },
            {
              label: t('sidebar.auditLogs'),
              key: 'audit-logs',
              icon: <CctvIcon size={15} />,
              onClick: () => navigate('/audit-logs')
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
