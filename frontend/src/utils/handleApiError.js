const handleApiError = (error) => {
  if (error.response) {
    const { data, status } = error.response;

    if (data?.message) return data.message;
    if (data?.errors) {
      const messages = Object.values(data.errors);
      return messages.flat().join(', ');
    }

    switch (status) {
      case 400: return 'Invalid request. Please check your input.';
      case 401: return 'Session expired. Please login again.';
      case 403: return 'You do not have permission for this action.';
      case 404: return 'Requested resource not found.';
      case 409: return 'A conflict occurred. Please try again.';
      case 422: return 'Validation failed. Please check your input.';
      case 429: return 'Too many requests. Please try again later.';
      case 500: return 'Server error. Please try again later.';
      default: return 'Something went wrong. Please try again.';
    }
  }

  if (error.request) {
    return 'Network error. Please check your internet connection.';
  }

  return error.message || 'An unexpected error occurred.';
};

export default handleApiError;
