import { validateCredentials } from '../config/demoAccount';

describe('validateCredentials', () => {
  it('accepts demo account credentials', () => {
    expect(validateCredentials('sunanth@gmail.com', '123456789')).toBe(true);
    expect(validateCredentials('  SUNANTH@gmail.com  ', '123456789')).toBe(true);
  });

  it('rejects wrong password', () => {
    expect(validateCredentials('sunanth@gmail.com', 'wrong')).toBe(false);
  });

  it('rejects unknown email', () => {
    expect(validateCredentials('other@test.com', '123456789')).toBe(false);
  });
});
