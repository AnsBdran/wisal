import { parseWithZod } from '@conform-to/zod';
import { and, eq, inArray } from 'drizzle-orm';
import { jsonWithSuccess } from 'remix-toast';
import { db } from '~/.server/db';
import { postReactions, comments, posts, images } from '~/.server/db/schema';
import { postSchema } from '~/lib/schemas';

// ++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++
export const react = async (fd: FormData, userID: number) => {
  const postID = Number(fd.get('postID'));
  const type = fd.get('type');

  const isReacted = await db
    .selectDistinct()
    .from(postReactions)
    .where(
      and(eq(postReactions.postID, postID), eq(postReactions.userID, userID))
    );

  if (!isReacted.length) {
    await db.insert(postReactions).values({
      postID,
      type,
      userID,
    });
    return { action: 'added' };
  }

  if (isReacted[0].type === type) {
    await db
      .delete(postReactions)
      .where(
        and(eq(postReactions.postID, postID), eq(postReactions.userID, userID))
      );
    return { action: 'deleted' };
  }

  if (isReacted[0].type !== type) {
    await db
      .update(postReactions)
      .set({
        type,
      })
      .where(
        and(eq(postReactions.postID, postID), eq(postReactions.userID, userID))
      );
    return { action: 'updated' };
  }
};

// ++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++
export const comment = async (fd: FormData, userID: number) => {
  const content = fd.get('content') as string;
  const postID = Number(fd.get('postID'));

  if (!content) {
    return { fail: true };
  }

  await db.insert(comments).values({ postID, userID, content });
  return { action: 'added' };
};

// ++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++
export const commentUpdate = async (fd: FormData) => {
  const content = fd.get('content') as string;
  const commentID = Number(fd.get('commentID'));
  await db.update(comments).set({ content }).where(eq(comments.id, commentID));

  return { action: 'updated' };
};

// ++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++
export const deleteComment = async (fd: FormData) => {
  const commentID = Number(fd.get('commentID'));

  await db.delete(comments).where(eq(comments.id, commentID));
  return { action: 'deleted' };
};

// +++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++
export const post = async (formData: FormData, userID: number) => {
  const submission = parseWithZod(formData, { schema: postSchema });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  // extract submission values
  const { content, images: _images, title } = submission.value;

  const post = await db
    .insert(posts)
    .values({
      content,
      title: title ?? '',
      userID,
    })
    .returning();

  if (_images?.length) {
    await db.insert(images).values(
      _images.map((i) => ({
        format: i.format,
        height: i.height,
        postID: post[0].id,
        publicID: i.publicID,
        secureURL: i.secureURL,
        url: i.url,
        width: i.width,
      }))
    );
  }
  return { success: true };
};

// +++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++
export const editPost = async (fd: FormData) => {
  const postID = Number(fd.get('postID'));
  const imagesToDelete = JSON.parse(
    fd.get('imagesToDelete') as string
  ) as number[];
  const submission = parseWithZod(fd, { schema: postSchema });

  console.log('payload', submission.payload, submission.value);
  if (submission.status !== 'success') {
    return submission.reply();
  }
  console.log('payload', submission.payload, submission.value);
  const { content, title, images: _images } = submission.value;
  await db
    .update(posts)
    .set({
      content,
      title,
      updatedAt: new Date(),
      isEdited: true,
    })
    .where(eq(posts.id, postID));
  // set new images
  if (_images && _images?.length > 0) {
    await db.insert(images).values(
      _images.map((i) => ({
        format: i.format,
        height: i.height,
        postID: postID,
        publicID: i.publicID,
        secureURL: i.secureURL,
        url: i.url,
        width: i.width,
      }))
    );
  }

  // remove images if there is to remove
  if (imagesToDelete.length > 0) {
    await db.delete(images).where(inArray(images.id, imagesToDelete));
  }
  console.log('editing the post', postID);
  return { success: true };
};

export const deletePost = async (fd: FormData, request: Request) => {
  const postID = Number(fd.get('postID'));
  const t = (t) => t;

  await db.delete(posts).where(eq(posts.id, postID));
  return jsonWithSuccess(
    { success: true },
    {
      message: t('post_deleted_successfully'),
      description: t('post_deleted_successfully_description'),
    }
  );
};
