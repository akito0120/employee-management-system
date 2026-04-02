import { trpc } from '@renderer/trpc';
import { JSX } from 'react';

export interface AdminGuardProps {
  children: JSX.Element;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const { data } = trpc.auth.getMe.useQuery();

  if (!data || !data.isAdmin) return null;
  return children;
};

export default AdminGuard;
