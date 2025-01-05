import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UnifiedAuthGuard } from './unified-auth.guard';

describe('UnifiedAuthGuard', () => {
  let guard: UnifiedAuthGuard;

  beforeEach(() => {
    guard = new UnifiedAuthGuard();
  });

  describe('getRequest', () => {
    it('should return the GraphQL request when context type is "graphql"', () => {
      //
      const mockGqlContext = {
        getContext: jest.fn().mockReturnValue({
          req: { user: { id: 1, role: 'CLIENT' } },
        }),
      };

      const mockExecutionContext: Partial<ExecutionContext> = {
        getType: jest.fn().mockReturnValue('graphql'),
      };

      jest
        .spyOn(GqlExecutionContext, 'create')
        .mockReturnValue(mockGqlContext as unknown as GqlExecutionContext);

      const result = guard.getRequest(mockExecutionContext as ExecutionContext);

      expect(result).toEqual({ user: { id: 1, role: 'CLIENT' } });
      expect(GqlExecutionContext.create).toHaveBeenCalledWith(
        mockExecutionContext,
      );
    });

    it('should return the HTTP request when context type is "http"', () => {
      const mockRequest = { user: { id: 2, role: 'MANAGER' } };

      const mockExecutionContext: Partial<ExecutionContext> = {
        getType: jest.fn().mockReturnValue('http'),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      };

      const result = guard.getRequest(mockExecutionContext as ExecutionContext);

      expect(result).toEqual(mockRequest);
      expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
    });
  });
});
