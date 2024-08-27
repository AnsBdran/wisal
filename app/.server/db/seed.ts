import { eq } from 'drizzle-orm';
import { db } from '.';
import {
  comment,
  commentReaction,
  conversation,
  conversationMember,
  image,
  message,
  post,
  postReaction,
} from './schema';
import { user } from './schema/user';
import { fakerAR as faker } from '@faker-js/faker';

// const arr = num =>  Array.from({length: num}).fill(0)
const COUNT = 100;

const seedUsers = async () => {
  // const images = await db.select().from(image);
  for (let i = 0; i < COUNT; i++) {
    await db.insert(user).values({
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(),
      username: faker.internet.userName(),
      role: faker.helpers.maybe(() => 'admin', { probability: 0.1 }) || 'user',
      profileImage: faker.image.avatar(),
      // profileImageID: images[i].id
    });
  }
};

export const seedPosts = async () => {
  const users = await db.select().from(user);
  for (let i = 0; i < COUNT; i++) {
    await db.insert(post).values({
      content: faker.lorem.sentences(),
      title: faker.lorem.sentence(),
      userID: users[i].id,
    });
  }
};

export const seedComments = async () => {
  const posts = await db.select().from(post);
  const users = await db.select().from(user);
  for (let j = 0; j < posts.length; j++) {
    for (let i = 0; i < COUNT / 4; i++) {
      await db.insert(comment).values({
        content: faker.lorem.sentence(),
        postsID: posts[j].id,
        userID: users[i].id,
      });
    }
  }
};

const seedImages = async () => {
  // const users = await db.select().from(user);
  const posts = await db.select().from(post);
  // console.log('seed images called', users);

  for (let j = 0; j < posts.length; j++) {
    for (let i = 0; i < faker.helpers.rangeToNumber({ min: 0, max: 6 }); i++) {
      console.log('seed images called');
      await db.insert(image).values({
        url: faker.image.urlPicsumPhotos(),
        // userID: posts[j].id,
        postID: posts[j].id,

        // key: `user-${users[j].id}`,
      });
    }
  }

  // for (let k = 0; k < posts.length; k++) {
  //   faker.helpers.maybe(
  //     async () => {
  //       await db.insert(postImage).values({
  //         url: faker.image.urlLoremFlickr(),
  //         postID: posts[k].id,
  //         // key: `post-${posts[k].id}`
  //       });
  //     },
  //     { probability: 0.7 }
  //   );
  // }
};

const seedPostsReactions = async () => {
  const posts = await db.select().from(post);
  const users = await db.select().from(user);

  for (let j = 0; j < posts.length; j++) {
    for (
      let i = 0;
      i < faker.helpers.rangeToNumber({ min: 10, max: 30 });
      i++
    ) {
      await db.insert(postReaction).values({
        type: faker.helpers.arrayElement([
          'angry',
          'haha',
          'like',
          'dislike',
          'love',
        ]),
        userID: users[i].id,
        postID: posts[j].id,
        // key: `post-${posts[j].id}`,
      });
    }
  }
};
const seedCommentsReactions = async () => {
  //   const posts = await db.select().from(post);
  const comments = await db.select().from(comment);
  const users = await db.select().from(user);
  for (let j = 0; j < comments.length; j++) {
    for (let i = 0; i < faker.helpers.rangeToNumber({ min: 0, max: 3 }); i++) {
      await db.insert(commentReaction).values({
        type: faker.helpers.arrayElement([
          'angry',
          'haha',
          'like',
          'dislike',
          'love',
        ]),
        userID: users[i].id,
        commentID: comments[j].id,
        // key: `post-${posts[j].id}`,
      });
    }
  }
};

// const updateProfilesImages = async () => {
//     const users = await db.select().from(user);
//     // const images = await db.insert
//     for (let i = 0; i < users.length; i++) {
//         // const usersImages = await db.select().from(image).where(eq(image.key, `user-${users[i].id}`))
//         await db.update(user).set({ profileImage: faker.image.avatar() })
//         // await db.update(user).set({ profileImageID: faker.helpers.arrayElement(usersImages).id })
//     }
// }

const seedConversations = async () => {
  for (let i = 0; i < 25; i++) {
    await db.insert(conversation).values({
      name: faker.lorem.words(),
    });
  }
};

const seedConversationMembers = async () => {
  const conversations = await db.select().from(conversation);
  const users = await db.select().from(user);
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < conversations.length; j++) {
      faker.helpers.maybe(
        async () => {
          await db.insert(conversationMember).values({
            conversationID: conversations[j].id,
            leftAt: faker.helpers.maybe(() => faker.date.future(), {
              probability: 0.1,
            }),
            userID: users[i].id,
          });
        },
        { probability: 0.5 }
      );
    }
  }
};

const seedMessages = async () => {
  const conversations = await db.select().from(conversation);
  const users = await db.select().from(user);

  for (let i = 0; i < COUNT * 20; i++) {
    await db.insert(message).values({
      content: faker.lorem.sentence(),
      conversationID: faker.helpers.arrayElement(conversations).id,
      fromID: faker.helpers.arrayElement(users).id,
    });
  }
};

const clear = async () => {
  await db.delete(user);
  await db.delete(image);
  await db.delete(post);
  await db.delete(comment);
  //   await db.delete(reaction);
  await db.delete(conversation);
  await db.delete(conversationMember);
  await db.delete(message);
  await db.delete(commentReaction);
  await db.delete(postReaction);
};

const seed = async () => {
  await seedUsers();
  await seedPosts();
  await seedImages();

  await seedComments();
  //   await seedReactions();
  await seedCommentsReactions();
  await seedPostsReactions();
  // await updateProfilesImages()
  await seedConversations();
  await seedConversationMembers();
  await seedMessages();
};

const main = async () => {
  try {
    await clear();
    await seed();
    console.log('seed successfull');
  } catch (e) {
    console.log('|||||||||||||||||||||||||||||||||||||||||||');
    console.log('some error happened || ', e);
  }
};

main();
