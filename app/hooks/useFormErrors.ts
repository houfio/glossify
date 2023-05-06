import { useEffect } from 'react';

import { useNotifications } from '~/hooks/useNotifications';
import type { FormErrors } from '~/types';

export function useFormErrors(errors?: FormErrors) {
  const notifications = useNotifications();

  useEffect(() => {
    for (const error of errors?.filter((e) => !e.field) ?? []) {
      notifications(error.message);
    }
  }, [errors, notifications]);
}
