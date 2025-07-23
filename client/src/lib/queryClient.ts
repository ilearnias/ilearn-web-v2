import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest<T = any>(
  options: string | { url: string; method?: string; data?: any }
): Promise<T> {
  let url: string;
  let requestOptions: RequestInit = { credentials: "include" };
  
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
  
  const res = await fetch(url, requestOptions);

  await throwIfResNotOk(res);
  
  // For DELETE requests or empty responses, return an empty object
  if (requestOptions.method === 'DELETE' || res.headers.get('content-length') === '0') {
    return {} as T;
  }
  
  try {
    return await res.json();
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
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000, // 10 minutes instead of Infinity
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
