import { and, eq } from 'drizzle-orm';
import { db } from '~/.server/db';
import { postReactions, comments } from '~/.server/db/schema';

export const react = async (type, postID, userID) => {
  await new Promise((res) => setTimeout(res, 1000));

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

export const comment = async (
  content: string,
  postID: number,
  userID: number
) => {
  if (!content) {
    return { fail: true };
  }

  await db.insert(comments).values({ postID, userID, content });
  return { action: 'added' };
};

export const commentUpdate = async (
  content: string,
  commentID: number
  // userID: number
) => {
  await db.update(comments).set({ content }).where(eq(comments.id, commentID));

  return { action: 'updated' };
};

export const deleteComment = async (commentID: number) => {
  await db.delete(comments).where(eq(comments.id, commentID));
  return { action: 'deleted' };
};
