import { CheckOutlined, DeleteOutlined, EditOutlined, LeftOutlined } from '@ant-design/icons';
import AdminGuard from '@renderer/components/AdminGuard';
import { StyledButton } from '@renderer/components/Buttons';
import { trpc } from '@renderer/trpc';
import { App, Breadcrumb, Flex } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import DepartmentForm from './DepartmentForm';

const DepartmentDetailsPage = () => {
  const { t } = useTranslation();
  const { modal, message } = App.useApp();
  const navigate = useNavigate();
  const params = useParams();
  const id = Number(params.id);
  const { data, refetch } = trpc.departments.findDepartmentById.useQuery(id);
  const [editing, setEditing] = useState(false);
  const { mutateAsync: mutateDelete, isPending: deletePending } =
    trpc.departments.deleteDepartmentById.useMutation({
      onSuccess: () => navigate(-1),
      onError: () => message.error(t('global.somethingWentWrongMsg'))
    });

  const deleteDept = async () => {
    modal.confirm({
      title: t('departments.delete.confirmMsg'),
      onOk: () => mutateDelete(id),
      okText: t('global.confirm'),
      okButtonProps: {
        variant: 'filled',
        color: 'primary',
        icon: <CheckOutlined />,
        loading: deletePending
      },
      cancelText: t('global.cancel'),
      cancelButtonProps: { variant: 'filled', color: 'default' }
    });
  };

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
          <StyledButton
            variant="filled"
            color="default"
            icon={<LeftOutlined />}
            onClick={() => navigate(-1)}
          >
            {t('global.back')}
          </StyledButton>

          <AdminGuard>
            <StyledButton
              onClick={() => setEditing(true)}
              color="primary"
              variant="filled"
              icon={<EditOutlined />}
            >
              {t('global.edit')}
            </StyledButton>
          </AdminGuard>

          <AdminGuard>
            <StyledButton
              onClick={deleteDept}
              color="primary"
              variant="filled"
              icon={<DeleteOutlined />}
            >
              {t('global.delete')}
            </StyledButton>
          </AdminGuard>
        </Flex>
      )}
    </Flex>
  );
};

export default DepartmentDetailsPage;
