import { useEffect } from 'react';

import { useNotifications } from '~/hooks/useNotifications';
import type { FormErrors } from '~/types';

export function useFormErrors(response?: { errors: FormErrors } | object, all = false) {
  const notifications = useNotifications();

  useEffect(() => {
    if (response && 'errors' in response) {
      for (const error of response.errors.filter((e) => all || !e.field) ?? []) {
        const prefix = error.field ? `${error.field}: ` : '';

        notifications(`${prefix}${error.message}`);
      }
    }
  }, [response, all, notifications]);
}
