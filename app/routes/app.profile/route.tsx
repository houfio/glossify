import { Form } from '@remix-run/react';
import type { V2_MetaFunction } from '@vercel/remix';

import { Page } from '~/components/Page';
import { Button } from '~/components/forms/Button';

export const meta: V2_MetaFunction = () => [{ title: 'Profile | Glossify' }];

export default function Words() {
  return (
    <Page>
      <Form action="/logout" method="post">
        <Button text="Logout" type="submit"/>
      </Form>
    </Page>
  );
}
