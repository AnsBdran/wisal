import { eq, sql } from 'drizzle-orm';
import { db } from '.';
import { post } from './schema';

(async () => {
    try {

        console.log('demo started')
        console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||');
        // inserting
        // await db.insert(post).values({
        //     name: 'Hello, world!'
        // })
        // updating
        await db.update(post).set({ title: 'Hello, updated??' }).where(eq(post.id, 1,))
        console.log('demo finished')
        console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||');
    } catch (error) {
        console.log('||||||||||||||||||||||||||||||||||||||||||||||||||||||');
        console.log('bad happened', error)
    }
})()