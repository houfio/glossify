import type { MetaFunction } from '@vercel/remix';

import { Container } from '~/components/Container';

export const meta: MetaFunction = () => [
  { title: 'Glossify / Settings' }
];

export default function Settings() {
  return (
    <Container>
      settings
    </Container>
  );
}
