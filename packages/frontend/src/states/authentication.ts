import { createDakpan } from 'dakpan';

type State = {
  token?: string
};

export const [AuthProvider, useAuthentication] = createDakpan<State>(() => {
  if (typeof localStorage === 'undefined') {
    return {};
  }

  return {
    token: localStorage.getItem('token') || undefined
  };
})({
  setToken: (token: string) => () => {
    localStorage.setItem('token', token);

    return {
      token
    };
  },
  removeToken: () => () => {
    localStorage.removeItem('token');

    return {};
  }
});
