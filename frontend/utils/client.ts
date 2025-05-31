import React from 'react'

// const apiURL = process.env.REACT_APP_API_URL;
const apiURL = 'https://api.edua.live';


// More specific type for headers
type Headers = Record<string, string>;

// Interface for the configuration object passed to the client function
// It's generic for the type of 'data' (D)
interface ClientConfig<D = any> {
  data?: D;
  token?: string;
  headers?: Headers;
  // Allow any other standard RequestInit properties except the ones we manage
  [key: string]: any; // This allows for ...customConfig.
  // For more safety, you could use Omit<RequestInit, 'body' | 'method' | 'headers'>
  // if customConfig is meant to only pass through other RequestInit options.
}

// Define the structure of a successful API error response, if known
interface ApiErrorResponse {
  message: string;
  code?: number;
  // ... other potential error fields
}

async function client<TResponse = any, DRequest = any>(
  endpoint: string,
  { data, token, headers: customHeaders, ...customConfig }: ClientConfig<DRequest> = {}
): Promise<TResponse> {
  /**
   * title: Api Client Wrapper
   * desc: wrapper function for window.fetch to call backend api's :)
   */

  // Prepare the headers for the request
  const requestHeaders: HeadersInit = {}; // HeadersInit is a built-in type for fetch headers

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }
  if (data) {
    requestHeaders['Content-Type'] = 'application/json';
  }
  if (customHeaders) {
    for (const key in customHeaders) {
      if (Object.prototype.hasOwnProperty.call(customHeaders, key)) {
        requestHeaders[key] = customHeaders[key];
      }
    }
  }

  // Options to modify the request
  const requestOptions: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: requestHeaders,
    ...customConfig, // Spread remaining custom configurations
  };

  // Calls the API with the request options
  return window
    .fetch(`${apiURL}/${endpoint}`, requestOptions)
    .then(async (response) => {
      if (response.status === 403) {
        await auth.logout(); // If unauthorized, logout the user
        // Consistently return a rejected promise with a structured error
        return Promise.reject({
          message: 'Please re-authenticate.',
          status: 403,
        } as ApiErrorResponse); // Return a rejected promise so that the caller knows to redirect the user
      }

      // Try to parse JSON, handle cases where response might not be JSON or is empty
      let responseData: any;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          responseData = await response.json();
        } catch (error) {
          // If JSON parsing fails but response was otherwise OK, this might be an issue.
          // If response not OK, the error below will be caught.
          if (response.ok) {
            return Promise.reject({
              message: 'Failed to parse JSON response.',
              status: response.status,
              error,
            } as ApiErrorResponse);
          }
          // If response not OK and JSON parsing fails, set responseData to a more generic error
          responseData = { message: 'Invalid JSON response from server.', error: await response.text() };
        }
      } else if (response.ok && response.status !== 204) { // 204 No Content shouldn't have a body
        // Handle non-JSON successful responses if necessary, e.g., text
        responseData = await response.text();
      } else if (!response.ok && response.status !== 204) {
        // For non-OK responses that aren't JSON, try to get text for error context
        responseData = { message: await response.text() };
      }
      // For 204 No Content, responseData will be undefined, which is fine if expected.

      if (response.ok) {
        return responseData as TResponse; // Return the data, cast to the expected response type
      }

      // If responseData wasn't successfully parsed into a meaningful error object,
      // create a default one.
      const errorPayload: ApiErrorResponse = typeof responseData === 'object' && responseData !== null
        ? responseData
        : { message: 'An unknown error occurred.', details: responseData };

      if (!errorPayload.message && response.statusText) {
        errorPayload.message = response.statusText;
      }
      (errorPayload as any).status = response.status; // Add status to the error payload

      return Promise.reject(errorPayload); // Else return the structured error
    });
}




// Define interfaces for better type checking
interface User {
  name: string;
  token: string;
}


function useClient() {
  // Explicitly type the user object
  const { user }: { user: User } = { user: { name: "Llamabert", token: "tajdslfkjasepfj" } }; // Corrected initialization
  const token = user?.token;

  return React.useCallback(
    // Explicitly type the parameters and return type of the callback
    (endpoint: string, config?: ClientConfig): Promise<any> => // Adjust Promise<any> to a more specific type if possible
      client(endpoint, { ...config, token }),
    [token]
  );
}

export default useClient
