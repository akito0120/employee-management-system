import { trpc } from '@renderer/trpc';
import { Alert, App, Button, Flex, Form, Modal, Select } from 'antd';
import { useState } from 'react';
import { ConfirmPromotionRequest } from 'src/shared/dto/employees/confirm-promotion.dto';

export const EmployeeEligibilities = ({ id }: { id: number }) => {
  const { message, modal } = App.useApp();
  const { data: empl, refetch } = trpc.employees.findEmployeeById.useQuery(id);
  const { mutateAsync: confirmRaise, isPending: confirmRaisePending } =
    trpc.employees.confirmRaise.useMutation({
      onSuccess: () => refetch(),
      onError: () => message.error('Something went wrong')
    });

  const openRaiseModal = () =>
    modal.confirm({
      onOk: () => confirmRaise(id),
      content: "Do you confirm this employee's raise?",
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
      okText: 'Confirm'
    });

  if (!empl) return null;

  return (
    <Flex vertical gap="middle">
      {empl.raiseEligibility.eligible ? (
        <Alert
          type="success"
          title="This employee is eligible for raise."
          description={`Next salary : €${empl.raiseEligibility.nextSalary}`}
          showIcon
          action={
            <Button variant="filled" color="default" onClick={openRaiseModal}>
              Confirm Raise
            </Button>
          }
        />
      ) : (
        <Alert
          type="warning"
          title="This employee is not eligible for raise yet."
          description={`Next raise is scheduled on ${new Date(empl.raiseEligibility.scheduledAt).toLocaleDateString()}`}
          showIcon
        />
      )}

      {empl.promotionEligibility.eligible ? (
        <Alert
          type="success"
          title="This employee is eligible for promotion."
          description={`Next grade : G${empl.promotionEligibility.nextGrade}`}
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
          title="This employee is not eligible for promotion yet."
          description={`Next promotion is scheduled on ${new Date(empl.promotionEligibility.scheduledAt).toLocaleDateString()}`}
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
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const { data: positionOptions } = trpc.positions.getPositionOptions.useQuery({
    grade: nextGrade
  });
  const { refetch } = trpc.employees.findEmployeeById.useQuery(employeeId);
  const { mutateAsync: confirmPromotion, isPending: confirmPromotionPending } =
    trpc.employees.confirmPromotion.useMutation({
      onSuccess: () => refetch(),
      onError: () => message.error('Something went wrong')
    });

  const [form] = Form.useForm<ConfirmPromotionRequest>();
  const submit = async () => {
    const values = await form.validateFields();
    await confirmPromotion({ ...values, employeeId });
  };

  return (
    <>
      <Button variant="filled" color="default" onClick={() => setOpen(true)}>
        Confirm Promotion
      </Button>

      <Modal
        open={open}
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
        onOk={submit}
        okText="Confirm"
        okButtonProps={{ variant: 'filled', color: 'primary', loading: confirmPromotionPending }}
        cancelButtonProps={{
          variant: 'filled',
          color: 'default',
          disabled: confirmPromotionPending
        }}
        title="Select next position and confirm promotion"
      >
        <Form form={form} style={{ padding: '1rem' }} layout="vertical">
          <Form.Item<ConfirmPromotionRequest>
            name="positionId"
            label="Position"
            rules={[{ required: true }]}
          >
            <Select options={positionOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
