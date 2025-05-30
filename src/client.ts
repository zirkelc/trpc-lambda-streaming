import {
  createTRPCClient,
  httpBatchStreamLink,
  loggerLink,
} from '@trpc/client';
import type { AppRouter } from './server';

const client = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) => opts.direction === 'down',
    }),
    httpBatchStreamLink({
      url: 'https://er32gpgfcptinus2u27lufwcpy0utgcw.lambda-url.us-east-1.on.aws/', 
    }),
  ],
});

void (async () => {
  try {
    const a = await client.lorem.query();
    for await (const i of a) {
      console.log(i);
    }

    const q = await client.greet.query({ name: 'Erik' });
    console.log(q);

    const deferred = await Promise.all([
      client.deferred.query({ wait: 3 }),
      client.deferred.query({ wait: 1 }),
      client.deferred.query({ wait: 2 }),
    ]);
    console.log('Deferred:', deferred);

    const iterable = await client.iterable.query();
    for await (const i of iterable) {
      console.log('Iterable:', i);
    }
  } catch (error) {
    console.log('error', error);
  }
})();
