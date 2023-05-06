import type { V2_MetaFunction } from '@vercel/remix';

import { Page } from '~/components/Page';
import { useUser } from '~/hooks/useUser';

export const meta: V2_MetaFunction = () => [{ title: 'Words | Glossify' }];

export default function Words() {
  const user = useUser();

  return (
    <Page>
      Welcome back, {user.username}
    </Page>
  );
}
