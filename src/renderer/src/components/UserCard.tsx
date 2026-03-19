import { EllipsisOutlined, LogoutOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import { primaryColorAtom, themeAtom } from '@renderer/hooks/theme';
import { trpc } from '@renderer/trpc';
import { Button, ColorPicker, Divider, Flex, Popover, Typography } from 'antd';
import Card from 'antd/es/card/Card';
import { useAtom, useSetAtom } from 'jotai';
import { JSX } from 'react/jsx-runtime';

import ChangePasswordModal from './ChangePasswordModal';

const UserCardActionButton = (): JSX.Element => {
  const setTheme = useSetAtom(themeAtom);
  const [primaryColor, setPrimaryColor] = useAtom(primaryColorAtom);
  const { refetch: refetchMe } = trpc.auth.getMe.useQuery();
  const { mutate: logout, isPending: logoutPending } = trpc.auth.logout.useMutation({
    onSuccess: () => refetchMe()
  });

  return (
    <Popover
      placement="topLeft"
      content={
        <Flex vertical gap="small">
          <Button type="text" icon={<SunOutlined />} onClick={() => setTheme('light')}>
            Light Theme
          </Button>

          <Button type="text" icon={<MoonOutlined />} onClick={() => setTheme('dark')}>
            Dark Theme
          </Button>

          <Flex gap="small" align="center" justify="center">
            <ColorPicker
              size="small"
              onChange={(color) => setPrimaryColor(color.toHex())}
              defaultValue={primaryColor}
              disabledAlpha
              disabledFormat
            />
            <Typography.Text>Primary Color</Typography.Text>
          </Flex>

          <Divider orientation="horizontal" style={{ margin: 0 }} />

          <ChangePasswordModal />

          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={() => logout()}
            loading={logoutPending}
          >
            Logout
          </Button>
        </Flex>
      }
    >
      <Button icon={<EllipsisOutlined />} type="text" />
    </Popover>
  );
};

const UserCard = (): JSX.Element => {
  const { data: me } = trpc.auth.getMe.useQuery();

  return (
    <Card
      style={{ height: '10%', borderRadius: 0 }}
      styles={{
        title: { padding: 0, margin: 0 },
        body: {
          padding: 0,
          height: '100%',
          paddingLeft: '1rem',
          paddingRight: '1rem'
        }
      }}
    >
      <Flex justify="space-between" align="center" style={{ height: '100%' }}>
        <Flex vertical>
          <Typography.Text style={{ fontSize: 12, margin: 0 }} ellipsis>
            {`${me?.firstName} ${me?.lastName}`}
          </Typography.Text>
          <Typography.Text style={{ fontSize: 12, margin: 0 }} type="secondary" ellipsis>
            {me?.email}
          </Typography.Text>
        </Flex>

        <UserCardActionButton />
      </Flex>
    </Card>
  );
};

export default UserCard;
