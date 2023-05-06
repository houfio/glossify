import type { User } from '@prisma/client';

import { useMatchesData } from '~/hooks/useMatchesData';

export function useUser() {
  const data = useMatchesData('routes/app');

  if (!data) {
    throw new Error('User not found');
  }

  return data.user as Omit<User, 'password'>;
}
