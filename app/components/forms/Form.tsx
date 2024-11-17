import type { BaseSyntheticEvent } from 'react';
import { Form as AriaForm, type FormProps } from 'react-aria-components';
import { type FormMethod, type RelativeRoutingType, useFormAction, useSubmit } from 'react-router';

type Props = Omit<FormProps, 'action' | 'onSubmit'> & {
  action?: string;
  fetcherKey?: string;
  relative?: RelativeRoutingType;
};

type HTMLSubmitEvent = BaseSyntheticEvent<SubmitEvent, Event, HTMLFormElement>;

type HTMLFormSubmitter = HTMLButtonElement | HTMLInputElement;

export function Form({ action, fetcherKey, relative, ...props }: Props) {
  const submit = useSubmit();
  const formAction = useFormAction(action, { relative });

  return (
    <AriaForm
      action={formAction}
      onSubmit={(e) => {
        e.preventDefault();

        const submitter = (e as unknown as HTMLSubmitEvent).nativeEvent.submitter as HTMLFormSubmitter | null;
        const method = (submitter?.getAttribute('formmethod') as FormMethod) || props.method;

        submit(submitter || e.currentTarget, {
          fetcherKey,
          method
        });
      }}
      {...props}
    />
  );
}
