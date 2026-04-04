import { EditOutlined, LeftOutlined } from '@ant-design/icons';
import { StyledButton } from '@renderer/components/Buttons';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Flex } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import UnitForm from './UnitForm';

const UnitDetailsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const params = useParams();
  const id = Number(params.id);
  const { data, refetch } = trpc.units.findUnitById.useQuery(id);
  const [editing, setEditing] = useState(false);

  if (!data) return null;

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: t('global.units') }, { title: data.name }]} />
      <UnitForm
        unit={data}
        editing={editing}
        onCancel={() => setEditing(false)}
        onSuccess={() => {
          setEditing(false);
          refetch();
        }}
      />

      {!editing && (
        <Flex justify="center" gap="middle">
          <StyledButton
            variant="filled"
            color="default"
            icon={<LeftOutlined />}
            onClick={() => navigate(-1)}
          >
            {t('global.back')}
          </StyledButton>

          <StyledButton
            variant="filled"
            color="primary"
            icon={<EditOutlined />}
            onClick={() => setEditing(true)}
          >
            {t('global.edit')}
          </StyledButton>
        </Flex>
      )}
    </Flex>
  );
};

export default UnitDetailsPage;
