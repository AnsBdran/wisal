import { eq, sql } from 'drizzle-orm';
import { db } from '.';
import { posts } from './schema';

(async () => {
  try {
    console.log('demo started');
    console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||');
    // inserting
    // await db.insert(post).values({
    //     name: 'Hello, world!'
    // })
    // updating
    await db
      .update(posts)
      .set({ title: 'Hello, updated??' })
      .where(eq(posts.id, 1));
    console.log('demo finished');
    console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||');
  } catch (error) {
    console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||');
    console.log('bad happened', error);
  }
})();
