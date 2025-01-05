import { Reflector } from '@nestjs/core';
import { ThrottlerStorage } from '@nestjs/throttler';
import { ThrottlerModuleOptions } from '@nestjs/throttler'; // Import this if needed
import { CustomThrottlerGuard } from './custom-throttler.guard';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext } from '@nestjs/common';

describe('CustomThrottlerGuard', () => {
  let guard: CustomThrottlerGuard;

  beforeEach(() => {
    const mockOptions: ThrottlerModuleOptions = {} as ThrottlerModuleOptions;
    const mockStorageService = {} as ThrottlerStorage;
    const mockReflector = {} as Reflector;

    guard = new CustomThrottlerGuard(
      mockOptions,
      mockStorageService,
      mockReflector,
    );
  });

  describe('getRequestResponse', () => {
    it('should return HTTP request and response for HTTP context', () => {
      const mockRequest = { method: 'GET' };
      const mockResponse = { statusCode: 200 };

      const mockExecutionContext: Partial<ExecutionContext> = {
        getType: jest.fn().mockReturnValue('http'),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
          getResponse: jest.fn().mockReturnValue(mockResponse),
        }),
      };

      const result = guard.getRequestResponse(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toEqual({ req: mockRequest, res: mockResponse });
      expect(mockExecutionContext.switchToHttp).toHaveBeenCalled();
    });

    it('should return GraphQL request and response for GraphQL context', () => {
      const mockRequest = { method: 'POST' };
      const mockResponse = { statusCode: 201 };

      const mockGqlContext = {
        req: mockRequest,
        res: mockResponse,
      };

      // Mock GqlExecutionContext.create and getContext
      const gqlExecutionContextMock = {
        getContext: jest.fn().mockReturnValue(mockGqlContext),
      };

      jest
        .spyOn(GqlExecutionContext, 'create')
        .mockReturnValue(
          gqlExecutionContextMock as unknown as GqlExecutionContext,
        );

      const mockExecutionContext: Partial<ExecutionContext> = {
        getType: jest.fn().mockReturnValue('graphql'),
      };

      const result = guard.getRequestResponse(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toEqual({ req: mockRequest, res: mockResponse });
      expect(GqlExecutionContext.create).toHaveBeenCalledWith(
        mockExecutionContext,
      );
      expect(gqlExecutionContextMock.getContext).toHaveBeenCalled();
    });
  });
});
