import { useEffect } from 'react';

import { useNotifications } from '~/hooks/useNotifications';
import type { FormErrors } from '~/types';

export function useFormErrors(errors?: FormErrors, all = false) {
  const notifications = useNotifications();

  useEffect(() => {
    for (const error of errors?.filter((e) => all || !e.field) ?? []) {
      const prefix = error.field ? `${error.field}: ` : '';

      notifications(`${prefix}${error.message}`);
    }
  }, [errors, all, notifications]);
}
