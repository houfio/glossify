import type { V2_MetaFunction } from '@vercel/remix';

import { useUser } from '~/hooks/useUser';

export const meta: V2_MetaFunction = () => [{ title: 'Words | Glossify' }];

export default function Words() {
  const user = useUser();

  return (
    <div>
      Welcome back, {user.username}
    </div>
  );
}
