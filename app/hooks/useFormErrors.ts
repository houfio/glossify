import { useEffect } from 'react';

import { useNotifications } from '~/hooks/useNotifications';
import type { FormErrors } from '~/types';

export function useFormErrors(errors?: FormErrors, all = false) {
  const notify = useNotifications();

  useEffect(() => {
    for (const error of errors?.filter((e) => all || !e.field) ?? []) {
      const prefix = error.field ? `${error.field}: ` : '';

      notify(`${prefix}${error.message}`);
    }
  }, [errors, all, notify]);
}
