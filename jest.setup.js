global.__DEV__ = true;

jest.mock('expo-linking', () => ({
  createURL: (path) => `amrutam://${path.replace(/^\//, '')}`,
  parse: (url) => {
    if (!url) throw new Error('Invalid URL');
    const match = url.match(/^[a-z]+:\/\/(.+)$/i);
  const path = match?.[1]?.split('?')[0] ?? '';
    const query = url.includes('?') ? Object.fromEntries(new URLSearchParams(url.split('?')[1])) : {};
    return { path, queryParams: query };
  },
}));
