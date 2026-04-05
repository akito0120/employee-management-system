import { DeleteOutlined, EditOutlined, LeftOutlined } from '@ant-design/icons';
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
  const navigate = useNavigate();
  const { message, modal } = App.useApp();
  const params = useParams();
  const id = Number(params.id);
  const { data, refetch } = trpc.departments.findDepartmentById.useQuery(id);
  const [editing, setEditing] = useState(false);
  const { mutateAsync: deleteDept, isPending: deletePending } =
    trpc.departments.deleteDepartmentById.useMutation({
      onSuccess: () => navigate(-1),
      onError: () => message.error(t('global.somethingWentWrongMsg'))
    });

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
              variant="filled"
              color="danger"
              icon={<DeleteOutlined />}
              onClick={() =>
                modal.confirm({
                  title: t('departments.details.confirmDeleteMsg'),
                  onOk: () => deleteDept(id),
                  okText: t('global.confirm'),
                  okButtonProps: { loading: deletePending, variant: 'filled', color: 'primary' },
                  cancelText: t('global.cancel'),
                  cancelButtonProps: { variant: 'filled', color: 'default' }
                })
              }
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
