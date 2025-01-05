import { ExecutionContext } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';

describe('LocalAuthGuard', () => {
  let guard: LocalAuthGuard;

  beforeEach(() => {
    guard = new LocalAuthGuard();
  });

  describe('getRequest', () => {
    it('should return the HTTP request from the execution context', () => {
      const mockRequest = { body: { username: 'test', password: 'password' } };

      const mockExecutionContext: Partial<ExecutionContext> = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      };

      const result = guard.getRequest(mockExecutionContext as ExecutionContext);

      expect(result).toEqual(mockRequest);
      expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
      expect(
        mockExecutionContext.switchToHttp()?.getRequest,
      ).toHaveBeenCalled();
    });
  });
});
