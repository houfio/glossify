import { Form as RemixForm } from '@remix-run/react';
import type { ComponentPropsWithoutRef } from 'react';

import { useForm } from '~/hooks/useForm';
import type { Issue } from '~/types';

type Props = ComponentPropsWithoutRef<typeof RemixForm> & {
  issues?: Issue[]
};

export function Form({ issues = [], ...props }: Props) {
  return (
    <useForm.Provider issues={issues}>
      <RemixForm {...props}/>
    </useForm.Provider>
  );
}
