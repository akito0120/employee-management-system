import { LeftOutlined } from '@ant-design/icons';
import { StyledButton } from '@renderer/components/Buttons';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Descriptions, Flex } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const PerformanceEvaluationDetailsPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const id = Number(params.id);
  const { data } = trpc.performanceEvaluations.findPerformanceEvaluationById.useQuery(id);
  const navigate = useNavigate();

  if (!data) return null;

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: t('global.performanceEvaluations') }, { title: data.title }]} />

      <Descriptions
        bordered
        column={2}
        items={[
          {
            label: t('performanceEvaluations.field.evaluator'),
            children: data.evaluatorEmployee
          },
          {
            label: t('performanceEvaluations.field.evaluated'),
            children: data.evaluatedEmployee
          },
          { label: t('performanceEvaluations.field.title'), children: data.title },
          { label: t('performanceEvaluations.field.score'), children: data.score },
          {
            label: t('performanceEvaluations.field.description'),
            children: data.description,
            span: 'filled'
          }
        ]}
      />

      <Flex justify="center">
        <StyledButton
          variant="filled"
          color="default"
          onClick={() => navigate(-1)}
          icon={<LeftOutlined />}
        >
          {t('global.back')}
        </StyledButton>
      </Flex>
    </Flex>
  );
};

export default PerformanceEvaluationDetailsPage;
