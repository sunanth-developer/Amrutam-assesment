export const DEMO_ACCOUNT = {
  email: 'sunanth@gmail.com',
  password: '123456789',
  user: {
    id: 'user-demo-1',
    name: 'Sunanth',
    email: 'sunanth@gmail.com',
  },
} as const;

export function validateCredentials(email: string, password: string): boolean {
  const normalized = email.trim().toLowerCase();
  return (
    normalized === DEMO_ACCOUNT.email &&
    password === DEMO_ACCOUNT.password
  );
}
