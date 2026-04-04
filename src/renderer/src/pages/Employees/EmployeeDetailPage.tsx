import { CheckOutlined, EditOutlined, LeftOutlined, PictureOutlined } from '@ant-design/icons';
import EmployeeStatusTag from '@renderer/components/EmployeeStatusTag';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Button, Descriptions, Flex, Typography } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { FindEmployeeByIdResponse } from 'src/shared/dto/employees/get-employee.dto';

import { EmployeeEligibilities } from './EmployeeEligibilities';

const EmployeeDetails = ({ empl }: { empl: FindEmployeeByIdResponse }) => {
  const { t } = useTranslation();

  return (
    <>
      <EmployeeEligibilities id={empl.id} />

      <Descriptions
        bordered
        column={2}
        items={[
          { label: t('employees.field.firstName'), children: empl.firstName },
          { label: t('employees.field.lastName'), children: empl.lastName },
          { label: t('employees.field.birthDate'), children: empl.birthDate.toLocaleDateString() },
          { label: t('employees.field.code'), children: empl.code },
          {
            label: t('employees.field.status'),
            children: <EmployeeStatusTag status={empl.status} />
          },
          {
            label: t('employees.field.affiliation'),
            children: `${empl.affiliation?.name} ${empl.isManager ? '(Manager)' : ''}`
          },
          {
            label: t('employees.field.position'),
            children: `${empl.position.name} (G${empl.position.grade})`
          },
          { label: t('employees.field.baseSalary'), children: `€${empl.baseSalary}` },
          {
            label: t('employees.field.lastPromotionDate'),
            children: empl.lastPromotionDate.toLocaleDateString()
          },
          {
            label: t('employees.field.lastRaiseDate'),
            children: empl.lastRaiseDate.toLocaleDateString()
          }
        ]}
      />

      <Descriptions
        bordered
        column={2}
        items={[
          { label: t('employees.field.email'), children: empl.email },
          { label: t('employees.field.phoneNumber'), children: empl.phoneNumber },
          { label: t('employees.field.country'), children: empl.country },
          { label: t('employees.field.state'), children: empl.state },
          { label: t('employees.field.city'), children: empl.city },
          { label: t('employees.field.line1'), children: empl.line1 },
          { label: t('employees.field.line2'), children: empl.line2 },
          { label: t('employees.field.postalCode'), children: empl.postalCode }
        ]}
      />

      <Descriptions
        bordered
        items={[
          {
            label: t('employees.field.remarks'),
            children: <p style={{ width: '30rem', margin: 0 }}>{empl.remarks}</p>
          }
        ]}
      />
    </>
  );
};

const EmployeeDetailPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<boolean>(false);

  const params = useParams();
  const id = Number(params.id);
  const { data: empl } = trpc.employees.findEmployeeById.useQuery(id);

  if (!empl) return null;

  return (
    <Flex gap="large" vertical style={{ padding: '2rem', height: '100%' }}>
      <Breadcrumb
        items={[{ title: t('global.employees') }, { title: `${empl.firstName} ${empl.lastName}` }]}
      />

      {editing ? (
        <>
          <Dragger
            style={{ width: '100%' }}
            multiple={false}
            accept=".csv,.xlsx"
            showUploadList={false}
          >
            <PictureOutlined style={{ fontSize: '3rem', paddingBottom: '1rem' }} />
            <Typography.Paragraph type="secondary">
              Click or drag file to this area to upload
            </Typography.Paragraph>
            <Typography.Paragraph type="secondary">
              Supported format: .png, .jpeg
            </Typography.Paragraph>
          </Dragger>

          <Flex justify="center" gap="middle">
            <Button
              icon={<LeftOutlined />}
              onClick={() => setEditing(false)}
              variant="filled"
              color="default"
            >
              Cancel
            </Button>

            <Button
              icon={<CheckOutlined />}
              onClick={() => setEditing(false)}
              variant="filled"
              color="primary"
            >
              Apply
            </Button>
          </Flex>
        </>
      ) : (
        <>
          <EmployeeDetails
            empl={{
              ...empl,
              birthDate: new Date(empl.birthDate || ''),
              lastPromotionDate: new Date(empl.lastPromotionDate || ''),
              lastRaiseDate: new Date(empl.lastRaiseDate || ''),
              raiseEligibility: {
                ...empl.raiseEligibility,
                scheduledAt: new Date(empl.raiseEligibility.scheduledAt)
              },
              promotionEligibility: {
                ...empl.promotionEligibility,
                scheduledAt: new Date(empl.promotionEligibility.scheduledAt)
              }
            }}
          />

          <Flex justify="center" gap="middle">
            <Button
              icon={<LeftOutlined />}
              onClick={() => navigate(-1)}
              variant="filled"
              color="default"
            >
              {t('global.back')}
            </Button>

            <Button icon={<EditOutlined />} variant="filled" color="primary">
              {t('global.edit')}
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default EmployeeDetailPage;
