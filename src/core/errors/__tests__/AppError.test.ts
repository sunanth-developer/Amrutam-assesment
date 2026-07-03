import { AppError, getErrorMessage } from '../AppError';

describe('AppError', () => {
  it('creates error with code and message', () => {
    const error = new AppError('SLOT_CONFLICT', 'Slot unavailable');
    expect(error.code).toBe('SLOT_CONFLICT');
    expect(error.message).toBe('Slot unavailable');
    expect(error.recoverable).toBe(true);
  });

  it('getErrorMessage extracts message from AppError', () => {
    const error = new AppError('TIMEOUT', 'Request timed out');
    expect(getErrorMessage(error)).toBe('Request timed out');
  });

  it('getErrorMessage handles unknown errors', () => {
    expect(getErrorMessage('something')).toBe('An unexpected error occurred');
  });
});
