import { graphql, LoginInput } from '@glossify/schema';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { useMutation } from 'urql';

import { Button } from '../components/forms/Button.tsx';
import { Form } from '../components/forms/Form.tsx';
import { Input } from '../components/forms/Input.tsx';
import { useNotifications } from '../hooks/useNotifications.tsx';
import { useAuthentication } from '../states/authentication.ts';

import styles from './Login.module.scss';

const mutation = graphql(`
  mutation LoginMutation($input: LoginInput!) {
    login(input: $input) {
      token
    }
  }
`);

export function Login() {
  const [{ token }, { setToken }] = useAuthentication();
  const [, mutate] = useMutation(mutation);
  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const open = useNotifications();

  if (token) {
    return (
      <Navigate to="/" replace={true}/>
    );
  }

  const login = (input: LoginInput) => {
    mutate({ input })
      .then(({ data }) => {
        if (data) {
          open('Successfully logged in');

          return setToken(data.login.token);
        } else {
          open('Whoops, something went wrong');
        }
      });
  };

  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <span className={styles.logo}>
          glossify
        </span>
        <Form form={form} onSubmit={login}>
          <Input name="email" label="E-mail" type="email"/>
          <Input name="password" label="Password" type="password"/>
          <Button text="Login" type="submit"/>
        </Form>
      </div>
    </div>
  );
}
