import {
  useLoaderData,
  useResolvedPath,
  useRevalidator,
} from '@remix-run/react';
import { startTransition, useEffect } from 'react';
import { useEventSource } from 'remix-utils/sse/react';

export const useLiveLoader = <T>() => {
  const streamPath = useResolvedPath('./stream');
  const data = useEventSource(streamPath.pathname);

  const { revalidate } = useRevalidator();
  useEffect(() => {
    startTransition(() => {
      revalidate();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return useLoaderData<T>();
};
