import { EllipsisOutlined, LogoutOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import { primaryColorAtom, themeAtom } from '@renderer/hooks/theme';
import { trpc } from '@renderer/trpc';
import { Button, ColorPicker, Divider, Flex, Popover, Typography } from 'antd';
import Card from 'antd/es/card/Card';
import { useAtom, useSetAtom } from 'jotai';
import { JSX } from 'react/jsx-runtime';
import { useTranslation } from 'react-i18next';

import ChangePasswordModal from './ChangePasswordModal';

const UserCardActionButton = () => {
  const { t, i18n } = useTranslation();
  const setTheme = useSetAtom(themeAtom);
  const [primaryColor, setPrimaryColor] = useAtom(primaryColorAtom);
  const { refetch: refetchMe } = trpc.auth.getMe.useQuery();
  const { mutate: logout, isPending: logoutPending } = trpc.auth.logout.useMutation({
    onSuccess: () => refetchMe()
  });

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ja' ? 'en' : 'ja';
    i18n.changeLanguage(nextLang);
  };

  return (
    <Popover
      placement="topLeft"
      content={
        <Flex vertical gap="small">
          <Button onClick={toggleLanguage} style={{ width: '100%' }} variant="text" color="default">
            {t('switchLanguageButton')}
          </Button>

          <Button type="text" icon={<SunOutlined />} onClick={() => setTheme('light')}>
            {t('sidebar.userCard.lightTheme')}
          </Button>

          <Button type="text" icon={<MoonOutlined />} onClick={() => setTheme('dark')}>
            {t('sidebar.userCard.darkTheme')}
          </Button>

          <Flex gap="small" align="center" justify="center">
            <ColorPicker
              size="small"
              onChange={(color) => setPrimaryColor(color.toHex())}
              defaultValue={primaryColor}
              disabledAlpha
              disabledFormat
            />
            <Typography.Text>{t('sidebar.userCard.primaryColor')}</Typography.Text>
          </Flex>

          <Divider orientation="horizontal" style={{ margin: 0 }} />

          <ChangePasswordModal />

          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={() => logout()}
            loading={logoutPending}
          >
            {t('sidebar.userCard.logout')}
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
