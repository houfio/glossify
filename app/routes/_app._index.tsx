import { Container } from '~/components/layout/Container';
import { Tooltip } from '~/components/popovers/Tooltip';
import { useUser } from '~/hooks/useUser';

export default function Index() {
  const user = useUser();

  return (
    <Container>
      <Tooltip content="This is your ID">
        {user.id}
      </Tooltip>
    </Container>
  );
}
