// __mocks__/mails.service.ts
export const mockMailsService = {
  sendPasswordResetEmail: jest.fn(),
  sendPasswordChangeConfirmationEmail: jest.fn(),
};
