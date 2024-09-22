import { eq } from 'drizzle-orm';
import { db } from '.';
import {
  comments,
  commentReactions,
  chats,
  chatMembers,
  images,
  messages,
  posts,
  postReactions,
  postsToTags,
  tags,
  suggestions,
  choices,
  votes,
} from './schema';
import { users, usersPrefs } from './schema/user';
import { fakerAR as faker } from '@faker-js/faker';

// const arr = num =>  Array.from({length: num}).fill(0)
const COUNT = 100;

const seedUsers = async () => {
  // const images = await db.select().from(images);
  await db.insert(users).values({
    email: faker.internet.email(),
    firstName: 'أنس',
    lastName: 'بدران',
    password: 'anas',
    username: 'anas',
    bio: faker.word.words(),
    middleName: 'كمال',
    isVerified: true,
    isApproved: true,
    role: 'super_admin',
    profileImage: faker.image.avatarLegacy(),
    nickname: faker.person.prefix(),
  });
  for (let i = 0; i < COUNT; i++) {
    await db.insert(users).values({
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(),
      username: faker.internet.userName(),
      role: faker.helpers.maybe(() => 'admin', { probability: 0.1 }) || 'user',
      profileImage: faker.image.avatar(),
      bio: faker.word.words(),
      isVerified: faker.datatype.boolean({ probability: 0.3 }),
      isApproved: faker.datatype.boolean({ probability: 0.8 }),
      // profileImageID: images[i].id
    });
  }
};

const seedPrefs = async () => {
  const _users = await db.select().from(users);
  for (let i = 0; i < _users.length; i++) {
    await db.insert(usersPrefs).values({
      userID: _users[i].id,
      locale: faker.helpers.arrayElement(['ar', 'en']),
      showAds: faker.datatype.boolean(),
      itemsPerPage: faker.helpers.arrayElement(['eight', 'fifteen', 'twelve']),
    });
  }
};

export const seedPosts = async () => {
  const userss = await db.select().from(users);
  for (let i = 0; i < COUNT - 1; i++) {
    await db.insert(posts).values({
      content: faker.lorem.sentences(),
      title: faker.lorem.sentence(),
      userID: userss[i].id,
      createdAt: faker.date.past(),
    });
  }
  await db.insert(posts).values({
    content: faker.lorem.sentences(),
    title: faker.lorem.sentence(),
    userID: userss[5].id,
    createdAt: faker.date.recent(),
  });
};

export const seedComments = async () => {
  const _posts = await db.select().from(posts);
  const userss = await db.select().from(users);
  for (let j = 0; j < _posts.length; j++) {
    const time = faker.date.between({
      from: _posts[j].createdAt,
      to: faker.date.soon(),
    });
    for (let i = 0; i < COUNT / 4; i++) {
      await db.insert(comments).values({
        content: faker.lorem.sentence(),
        postID: _posts[j].id,
        userID: userss[i].id,
        createdAt: new Date(
          time.getTime() +
            faker.helpers.rangeToNumber({ min: 2, max: 500 }) * 60 * 1000
        ),
      });
    }
  }
};

export const seedTags = async () => {
  for (let i = 0; i < COUNT / 3; i++) {
    await db.insert(tags).values({
      name: faker.word.adjective(),
      nameEn: faker.word.noun(),
    });
  }
};

export const seedPostsToTags = async () => {
  const _posts = await db.select().from(posts);
  const _tags = await db.select().from(tags);

  for (let i = 0; i < _posts.length; i++) {
    const __tags = faker.helpers.arrayElements(_tags, { min: 2, max: 7 });
    for (let j = 0; j < __tags.length; j++) {
      await db.insert(postsToTags).values({
        postID: _posts[i].id,
        tagID: _tags[j].id,
      });
    }
  }
  // _tags.map(async (t) => {
  //   await db.insert(postsToTags).values({
  //     postID: posts[i].id,
  //     tagID: t.id,
  //   });
  // });
  // for (let j = 0; j < faker.helpers.rangeToNumber({ min: 2, max: 5 }); j++) {
  //   await db.insert(postsToTags).values({
  //     postID: posts[i].id,
  //     tagID: faker.helpers.arrayElement(tags).id,
  //   });
  // }
  // }
};

const seedImages = async () => {
  // const userss = await db.select().from(users);
  const _posts = await db.select().from(posts);
  // console.log('seed images called', userss);

  for (let j = 0; j < _posts.length; j++) {
    for (let i = 0; i < faker.helpers.rangeToNumber({ min: 0, max: 6 }); i++) {
      console.log('seed images called');
      await db.insert(images).values({
        secureURL: faker.image.urlPicsumPhotos(),
        // userID: posts[j].id,
        postID: _posts[j].id,
        format: faker.internet.protocol(),
        publicID: faker.color.cssSupportedFunction(),

        // key: `users-${userss[j].id}`,
      });
    }
  }

  // for (let k = 0; k < posts.length; k++) {
  //   faker.helpers.maybe(
  //     async () => {
  //       await db.insert(postimages).values({
  //         url: faker.image.urlLoremFlickr(),
  //         postID: posts[k].id,
  //         // key: `posts-${posts[k].id}`
  //       });
  //     },
  //     { probability: 0.7 }
  //   );
  // }
};

const seedPostsReactions = async () => {
  const _posts = await db.select().from(posts);
  const userss = await db.select().from(users);

  for (let j = 0; j < _posts.length; j++) {
    const reactionsNum = faker.helpers.rangeToNumber({ min: 3, max: COUNT });
    for (let i = 0; i < reactionsNum; i++) {
      await db.insert(postReactions).values({
        type: faker.helpers.arrayElement([
          'angry',
          'haha',
          'like',
          'dislike',
          'love',
        ]),
        userID: userss[i].id,
        postID: _posts[j].id,
        // key: `posts-${posts[j].id}`,
      });
    }
  }
};
const seedCommentsReactions = async () => {
  //   const posts = await db.select().from(posts);
  const _comments = await db.select().from(comments);
  const _users = await db.select().from(users);
  const chooseComments = faker.helpers.arrayElements(_comments, {
    min: 20,
    max: _comments.length,
  });
  for (let j = 0; j < chooseComments.length; j++) {
    const reactionsNum = faker.helpers.rangeToNumber({ min: 0, max: 7 });
    for (let i = 0; i < reactionsNum; i++) {
      await db.insert(commentReactions).values({
        type: faker.helpers.arrayElement([
          'angry',
          'haha',
          'like',
          'dislike',
          'love',
        ]),
        userID: _users[i].id,
        commentID: chooseComments[j].id,
        // key: `posts-${posts[j].id}`,
      });
    }
  }
};

// const updateProfilesImages = async () => {
//     const userss = await db.select().from(users);
//     // const images = await db.insert
//     for (let i = 0; i < userss.length; i++) {
//         // const userssImages = await db.select().from(images).where(eq(images.key, `users-${userss[i].id}`))
//         await db.update(users).set({ profileimages: faker.images.avatar() })
//         // await db.update(users).set({ profileImageID: faker.helpers.arrayElement(userssImages).id })
//     }
// }

const seedChats = async () => {
  for (let i = 0; i < 25; i++) {
    await db.insert(chats).values({
      name: faker.lorem.words(),
      bio: faker.lorem.sentence(),
      image: faker.image.urlLoremFlickr(),
    });
  }
};

const seedChatsMembers = async () => {
  const _chats = await db.select().from(chats);
  const userss = await db.select().from(users);
  // const anas = await db.select().from(users).where(eq(users.username, 'anas'));
  for (let j = 0; j < _chats.length; j++) {
    for (let i = 0; i < userss.length; i++) {
      faker.helpers.maybe(
        async () => {
          await db.insert(chatMembers).values({
            chatID: _chats[j].id,
            leftAt: faker.helpers.maybe(() => faker.date.future(), {
              probability: 0.1,
            }),
            userID: userss[i].id,
          });
        },
        { probability: 0.5 }
      );
    }
  }
};

const seedMessages = async () => {
  const _chats = await db.select().from(chats);
  const _users = await db.select().from(users);

  for (let k = 0; k < _chats.length; k++) {
    const messagesCount = faker.helpers.rangeToNumber({ min: 30, max: 70 });
    for (let i = 0; i < messagesCount; i++) {
      let lastMessageTime = faker.date.past();
      const fromSameSender = faker.helpers.rangeToNumber({ min: 1, max: 7 });
      const sender = faker.helpers.arrayElement(_users).id;
      for (let j = 0; j < fromSameSender; j++) {
        const timeIncrement = faker.helpers.rangeToNumber({ min: 1, max: 5 });
        lastMessageTime = new Date(
          lastMessageTime.getTime() + timeIncrement * 60 * 1000
        );
        await db.insert(messages).values({
          content: faker.lorem.sentence(),
          chatID: _chats[k].id,
          createdAt: lastMessageTime,
          senderID: sender,
        });
      }
    }
  }
};

export const seedSuggestions = async () => {
  for (let i = 0; i < COUNT; i++) {
    await db.insert(suggestions).values({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraphs(),
      isAccepted: faker.datatype.boolean({ probability: 0.6 }),
    });
  }

  // const _suggestions = await db.select().from(suggestions);
  const acceptedSuggestions = await db
    .select()
    .from(suggestions)
    .where(eq(suggestions.isAccepted, true));

  for (let i = 0; i < acceptedSuggestions.length; i++) {
    const choicesCount = faker.helpers.rangeToNumber({ min: 2, max: 4 });

    for (let j = 0; j < choicesCount; j++) {
      await db.insert(choices).values({
        suggestionID: acceptedSuggestions[i].id,
        title: faker.lorem.words({ min: 1, max: 3 }),
        description: faker.lorem.sentence(),
        votesCount: faker.helpers.rangeToNumber({ min: 2, max: 25 }),
      });
    }
  }
  const _users = await db.select().from(users);

  for (let h = 0; h < acceptedSuggestions.length; h++) {
    const _choices = await db
      .select()
      .from(choices)
      .where(eq(choices.suggestionID, acceptedSuggestions[h].id));

    const votesCount = faker.helpers.rangeToNumber({ min: 2, max: 20 });
    const usersToVote = faker.helpers.arrayElements(_users, votesCount);

    for (let o = 0; o < votesCount; o++) {
      await db.insert(votes).values({
        choiceID: faker.helpers.arrayElement(_choices).id,
        suggestionID: acceptedSuggestions[h].id,
        userID: usersToVote[o].id,
      });
    }
  }
};

const clear = async () => {
  await db.delete(users);
  await db.delete(images);
  await db.delete(posts);
  await db.delete(comments);
  //   await db.delete(reaction);
  await db.delete(chats);
  await db.delete(chatMembers);
  await db.delete(messages);
  await db.delete(commentReactions);
  await db.delete(postReactions);
  await db.delete(tags);
  await db.delete(postsToTags);
  await db.delete(usersPrefs);
  await db.delete(suggestions);
  await db.delete(choices);
  await db.delete(votes);
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
  await seedChats();
  await seedChatsMembers();
  await seedMessages();
  await seedTags();
  await seedPostsToTags();
  await seedPrefs();
  await seedSuggestions();
};

const main = async () => {
  try {
    await clear();
    await seed();
    console.log('seed successfull');
    process.exit(0);
  } catch (e) {
    console.log('|||||||||||||||||||||||||||||||||||||||||||');
    console.log('some error happened || ', e);
    process.exit(1);
  }
};

main();
