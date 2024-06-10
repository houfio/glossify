import { Container } from '~/components/layout/Container';
import { Header } from '~/components/layout/Header';
import { Tooltip } from '~/components/popovers/Tooltip';
import { useUser } from '~/hooks/useUser';

export default function Index() {
  const user = useUser();

  return (
    <>
      <Header>
        Words
      </Header>
      <Container>
        <Tooltip content="This is your ID">
          {user.id}
        </Tooltip>
      </Container>
    </>
  );
}
