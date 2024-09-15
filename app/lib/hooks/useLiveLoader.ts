import {
  useLoaderData,
  useResolvedPath,
  useRevalidator,
} from '@remix-run/react';
import { useEffect } from 'react';
import { useEventSource } from 'remix-utils/sse/react';

export const useLiveLoader = <T>() => {
  const streamPath = useResolvedPath('./stream');
  const data = useEventSource(streamPath.pathname);

  const { revalidate } = useRevalidator();
  useEffect(() => {
    revalidate();
  }, [data]);
  return useLoaderData<T>();
};
