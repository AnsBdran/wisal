import { LoaderFunctionArgs } from '@remix-run/node';
import { createEventStream } from '~/.server/utils';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  return createEventStream(request, `${params.chat}-${params.type}`);
};
