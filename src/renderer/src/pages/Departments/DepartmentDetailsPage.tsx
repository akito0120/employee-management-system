import { EditOutlined, LeftOutlined } from '@ant-design/icons';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Flex } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import DepartmentForm from './DepartmentForm';

const DepartmentDetailsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const id = Number(params.id);
  const { data, refetch } = trpc.departments.findDepartmentById.useQuery(id);
  const [editing, setEditing] = useState(false);

  if (!data) return null;

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: t('global.departments') }, { title: data.name }]} />

      <DepartmentForm
        department={data}
        editing={editing}
        onCancel={() => setEditing(false)}
        onSuccess={() => {
          setEditing(false);
          refetch();
        }}
      />

      {!editing && (
        <Flex justify="center" gap="middle">
          <Button
            variant="filled"
            color="default"
            icon={<LeftOutlined />}
            onClick={() => navigate(-1)}
          >
            {t('global.back')}
          </Button>

          <Button
            onClick={() => setEditing(true)}
            color="primary"
            variant="filled"
            icon={<EditOutlined />}
          >
            {t('global.edit')}
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default DepartmentDetailsPage;
