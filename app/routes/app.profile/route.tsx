import { Form } from '@remix-run/react';
import type { V2_MetaFunction } from '@vercel/remix';

import { Button } from '~/components/forms/Button';

export const meta: V2_MetaFunction = () => [{ title: 'Profile | Glossify' }];

export default function Words() {
  return (
    <div>
      <Form action="/logout" method="post">
        <Button text="Logout" type="submit"/>
      </Form>
    </div>
  );
}
