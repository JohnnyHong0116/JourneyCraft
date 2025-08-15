export const Routes = {
  home: '/',
  signIn: '/auth/sign-in',
  signUp: '/auth/sign-up',
} as const;

export type Route = typeof Routes[keyof typeof Routes];


