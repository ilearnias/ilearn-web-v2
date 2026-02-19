import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { API } from "@/config/api";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("adminToken");
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Makes an API request. If the URL starts with http, it's used as-is.
 * Otherwise, it's appended to the ilearn-server base URL.
 */
export async function apiRequest<T = any>(
  options: string | { url: string; method?: string; data?: any }
): Promise<T> {
  let url: string;
  let requestOptions: RequestInit = {};

  if (typeof options === 'string') {
    url = options;
  } else {
    url = options.url;
    if (options.method) {
      requestOptions.method = options.method;
    }
    if (options.data) {
      requestOptions.headers = {
        ...requestOptions.headers,
        'Content-Type': 'application/json',
      };
      requestOptions.body = JSON.stringify(options.data);
    }
  }

  // Prepend base URL if URL is relative (not starting with http)
  if (!url.startsWith('http')) {
    // Strip leading slash if present
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
    url = API.BASEURL + cleanUrl;
  }

  // Add auth headers
  requestOptions.headers = {
    ...requestOptions.headers,
    ...getAuthHeaders(),
  };

  const res = await fetch(url, requestOptions);

  await throwIfResNotOk(res);

  // For DELETE requests or empty responses, return an empty object
  if (requestOptions.method === 'DELETE' || res.headers.get('content-length') === '0') {
    return {} as T;
  }

  try {
    const json = await res.json();
    // Unwrap ilearn-server response format
    if (json && json.data !== undefined && json.status !== undefined) {
      return json.data as T;
    }
    return json as T;
  } catch (error) {
    console.warn('Response was not JSON:', error);
    return {} as T;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    let url = queryKey[0] as string;

    // Prepend base URL if URL is relative
    if (!url.startsWith('http')) {
      const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
      url = API.BASEURL + cleanUrl;
    }

    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    const json = await res.json();
    // Unwrap ilearn-server response format
    if (json && json.data !== undefined && json.status !== undefined) {
      return json.data;
    }
    return json;
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
