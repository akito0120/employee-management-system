import { EditOutlined, LeftOutlined } from '@ant-design/icons';
import { StyledButton } from '@renderer/components/Buttons';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Flex } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import PositionForm from './PositionForm';

const PositionDetailsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const id = Number(params.id);
  const { data, refetch } = trpc.positions.findPositionById.useQuery(id);
  const [editing, setEditing] = useState(false);

  if (!data) return null;

  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: t('global.positions') }, { title: data.name }]} />

      <PositionForm
        position={data}
        editing={editing}
        onCancel={() => setEditing(false)}
        onSuccess={() => {
          setEditing(false);
          refetch();
        }}
      />

      {!editing && (
        <Flex gap="middle" justify="center">
          <StyledButton
            icon={<LeftOutlined />}
            variant="filled"
            color="default"
            onClick={() => navigate(-1)}
          >
            {t('global.back')}
          </StyledButton>

          <StyledButton
            icon={<EditOutlined />}
            variant="filled"
            color="primary"
            onClick={() => setEditing(true)}
          >
            {t('global.edit')}
          </StyledButton>
        </Flex>
      )}
    </Flex>
  );
};

export default PositionDetailsPage;
