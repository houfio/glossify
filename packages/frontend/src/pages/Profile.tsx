import { graphql } from '@glossify/schema';
import { useQuery } from 'urql';

import { Page } from '../components/Page.tsx';
import { Button } from '../components/forms/Button.tsx';
import { useAuthentication } from '../states/authentication.ts';

const query = graphql(`
  query ProfileQuery {
    me {
      id
      email
    }
  }
`);

export function Profile() {
  const [data] = useQuery({ query });
  const [, { removeToken }] = useAuthentication();

  return (
    <Page>
      <Button text="Logout" onClick={removeToken}/>
      {data.data?.me.email}
    </Page>
  );
}
