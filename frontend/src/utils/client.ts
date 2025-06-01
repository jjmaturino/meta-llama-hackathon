import React from 'react'

// const apiURL = process.env.REACT_APP_API_URL;
const apiURL = 'http://localhost:8000';


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


async function client<TResponse = any, DRequest = any>(
  endpoint: string,
  { data, token, headers: customHeaders, ...customConfig }: ClientConfig<DRequest> = {}
): Promise<TResponse> {
  /**
   * title: Api Client Wrapper
   * desc: wrapper function for window.fetch to call backend api's :)
   */

  const requestHeaders: HeadersInit = {
    'Accept': 'application/json',
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }
  if (data) {
    requestHeaders['Content-Type'] = 'application/json';
  }
  if (customHeaders) {
    Object.assign(requestHeaders, customHeaders);
  }

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: requestHeaders,
    mode: 'cors',
    ...customConfig,
  };

  try {
    console.log(`Making request to ${apiURL}/${endpoint}`);
    const response = await fetch(`${apiURL}/${endpoint}`, config);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
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
