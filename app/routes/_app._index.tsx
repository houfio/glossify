import { Container } from '~/components/Container';
import { Tooltip } from '~/components/popovers/Tooltip';
import { useUser } from '~/hooks/useUser';

export default function Index() {
  const user = useUser();

  return (
    <Container>
      <Tooltip content="This is your user data" asChild={true}>
        <pre>
          {JSON.stringify(user, undefined, 2)}
        </pre>
      </Tooltip>
    </Container>
  );
}
