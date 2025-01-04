import { GraphQLError, GraphQLFormattedError } from 'graphql';

export const formatGraphQLError = (
  formatedError: GraphQLError,
): GraphQLFormattedError => {
  const path = formatedError.path;
  const timestamp = new Date().toISOString();
  const originalError = formatedError.extensions.originalError;

  const errorMessage = {
    message:
      typeof originalError === 'string'
        ? originalError
        : originalError['message'] || 'Internal server error',
    path,
    extensions: {
      error: originalError['error'] || 'InternalServerError',
      statusCode: originalError['statusCode'] || 500,
      timestamp,
    },
  };

  return errorMessage;
};
