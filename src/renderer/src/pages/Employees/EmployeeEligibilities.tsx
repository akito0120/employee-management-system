import { trpc } from '@renderer/trpc';
import { Alert, App, Button, Flex, Form, Modal, Select } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmPromotionRequest } from 'src/shared/dto/employees/confirm-promotion.dto';

export const EmployeeEligibilities = ({ id }: { id: number }) => {
  const { t } = useTranslation();
  const { message, modal } = App.useApp();
  const { data: empl, refetch } = trpc.employees.findEmployeeById.useQuery(id);
  const { mutateAsync: confirmRaise, isPending: confirmRaisePending } =
    trpc.employees.confirmRaise.useMutation({
      onSuccess: () => refetch(),
      onError: () => message.error(t('global.somethingWentWrongMsg'))
    });

  const openRaiseModal = () =>
    modal.confirm({
      onOk: () => confirmRaise(id),
      content: t('employees.details.confirmRaiseModalMsg'),
      cancelButtonProps: {
        variant: 'filled',
        color: 'default',
        disabled: confirmRaisePending
      },
      okButtonProps: {
        variant: 'filled',
        color: 'primary',
        loading: confirmRaisePending
      },
      okText: t('global.confirm'),
      cancelText: t('global.cancel')
    });

  if (!empl) return null;

  return (
    <Flex vertical gap="middle">
      {empl.raiseEligibility.eligible ? (
        <Alert
          type="success"
          title={t('employees.details.eligibleForRaiseMsg')}
          description={`${t('employees.details.nextSalaryMsg')} : €${empl.raiseEligibility.nextSalary}`}
          showIcon
          action={
            <Button variant="filled" color="default" onClick={openRaiseModal}>
              {t('employees.details.confirmRaiseButton')}
            </Button>
          }
        />
      ) : (
        <Alert
          type="warning"
          title={t('employees.details.notEligibleForRaiseMsg')}
          description={`${t('employees.details.nextRaiseScheduleMsg')} : ${new Date(empl.raiseEligibility.scheduledAt).toLocaleDateString()}`}
          showIcon
        />
      )}

      {empl.promotionEligibility.eligible ? (
        <Alert
          type="success"
          title={t('employees.details.eligibleForPromotionMsg')}
          description={`${t('employees.details.nextGradeMsg')} : G${empl.promotionEligibility.nextGrade}`}
          showIcon
          action={
            <ConfirmPromotionModal
              nextGrade={empl.promotionEligibility.nextGrade}
              employeeId={empl.id}
            />
          }
        />
      ) : (
        <Alert
          type="warning"
          title={t('employees.details.notEligibleForPromotionMsg')}
          description={`${t('employees.details.nextPromotionScheduleMsg')} : ${new Date(empl.promotionEligibility.scheduledAt).toLocaleDateString()}`}
          showIcon
        />
      )}
    </Flex>
  );
};

const ConfirmPromotionModal = ({
  nextGrade,
  employeeId
}: {
  nextGrade: number;
  employeeId: number;
}) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const { data: positionOptions } = trpc.positions.getPositionOptions.useQuery({
    grade: nextGrade
  });
  const { refetch } = trpc.employees.findEmployeeById.useQuery(employeeId);
  const { mutateAsync: confirmPromotion, isPending: confirmPromotionPending } =
    trpc.employees.confirmPromotion.useMutation({
      onSuccess: () => refetch(),
      onError: () => message.error(t('global.somethingWentWrongMsg'))
    });

  const [form] = Form.useForm<ConfirmPromotionRequest>();
  const submit = async () => {
    const values = await form.validateFields();
    await confirmPromotion({ ...values, employeeId });
  };

  return (
    <>
      <Button variant="filled" color="default" onClick={() => setOpen(true)}>
        {t('employees.details.confirmPromotionButton')}
      </Button>

      <Modal
        open={open}
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
        onOk={submit}
        okText={t('global.confirm')}
        cancelText={t('global.cancel')}
        okButtonProps={{ variant: 'filled', color: 'primary', loading: confirmPromotionPending }}
        cancelButtonProps={{
          variant: 'filled',
          color: 'default',
          disabled: confirmPromotionPending
        }}
        title={t('employees.details.selectNextPositionModalMsg')}
      >
        <Form form={form} style={{ padding: '1rem' }} layout="vertical">
          <Form.Item<ConfirmPromotionRequest>
            name="positionId"
            label={t('employees.field.position')}
            rules={[{ required: true }]}
          >
            <Select options={positionOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
