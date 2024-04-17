jest.mock('@callstack/repack/client', () => ({
  Federated: {
    importModule: jest.fn((container, module) => {
      if (container === 'auth') {
        const authMock = require('../auth/mocks/chat');
        return Promise.resolve(authMock.default(module));
      }
    }),
  },
}));
