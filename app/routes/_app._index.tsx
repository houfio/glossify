import { faArrowRightFromBracket } from '@fortawesome/pro-regular-svg-icons';
import { Form } from '@remix-run/react';

import { Button } from '~/components/forms/Button';
import { Tooltip } from '~/components/popovers/Tooltip';
import { useUser } from '~/hooks/useUser';

export default function Index() {
  const user = useUser();

  return (
    <>
      <pre>
        {JSON.stringify(user, undefined, 2)}
      </pre>
      <Form method="post" action="/logout">
        <Tooltip content="Clicking on this will log you out" asChild={true}>
          <Button text="Logout" type="submit" icon={faArrowRightFromBracket}/>
        </Tooltip>
      </Form>
    </>
  );
}
