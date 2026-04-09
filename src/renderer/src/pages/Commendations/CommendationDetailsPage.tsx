import { LeftOutlined } from '@ant-design/icons';
import { StyledButton } from '@renderer/components/Buttons';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Descriptions, Flex, Tabs, Typography } from 'antd';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import CommendationPdfView from './CommendationPdfView';

const CommendationDescription = () => {
  const { t } = useTranslation();
  const params = useParams();
  const id = Number(params.id);
  const { data } = trpc.commendations.findCommendationById.useQuery(id);

  if (!data) return null;

  return (
    <Descriptions
      bordered
      column={2}
      items={[
        { label: t('commendations.field.title'), children: data.title, span: 'filled' },
        { label: t('commendations.field.category'), children: data.category },
        {
          label: t('commendations.field.adjustment'),
          children: `${data.adjustment} ${t('global.months')}`
        },
        {
          label: t('commendations.field.issuedDate'),
          children: format(data.issuedAt, 'yyyy/MM/dd'),
          span: 'filled'
        },
        {
          label: t('commendations.field.employees'),
          children: (
            <Flex vertical gap="middle">
              {data.employees.map((empl) => (
                <Typography.Text key={empl.id}>
                  {empl.firstName} {empl.lastName} ({empl.code})
                </Typography.Text>
              ))}
            </Flex>
          ),
          span: 'filled'
        },
        {
          label: t('commendations.field.description'),
          children: data.description,
          span: 'filled'
        }
      ]}
    />
  );
};

const CommendationDetailsPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const id = Number(params.id);
  const { data } = trpc.commendations.findCommendationById.useQuery(id);
  const navigate = useNavigate();

  if (!data) return null;

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: t('global.commendations') }, { title: data.title }]} />

      <Tabs
        items={[
          {
            key: 'details',
            label: 'Details',
            children: <CommendationDescription />
          },
          {
            key: 'pdf',
            label: 'PDF View',
            children: <CommendationPdfView />
          }
        ]}
      />

      <Flex gap="middle" justify="center">
        <StyledButton
          variant="filled"
          color="default"
          icon={<LeftOutlined />}
          onClick={() => navigate(-1)}
        >
          {t('global.back')}
        </StyledButton>
      </Flex>
    </Flex>
  );
};

export default CommendationDetailsPage;
