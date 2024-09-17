export const ITEMS_PER_PAGE = 3;
export const HEADER_HEIGHT = 60;
export const MESSANGER_HEADER_HEIGHT = 50;
export const MESSANGER_FOOTER_HEIGHT = 50;
export const MAX_FILE_SIZE = 2000000;
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];
export const REACTIONS = [
  'wow',
  'haha',
  'like',
  'dislike',
  'angry',
  'sad',
  'love',
];
export const INTENTS = {
  fetchComments: 'FETCH_COMMENTS',
  updateComment: 'UPDATE_COMMENT',
  deleteComment: 'DELETE_COMMENT',
  react: 'REACT',
  fetchReactions: 'FETCH_REACTIONS',
  comment: 'COMMENT',
  sendMessage: 'SEND_MESSAGES',
  editMessage: 'EDIT_MESSAGE',
  deleteMessage: 'DELETE_MESSAGE',
  fetchUsers: 'FETCH_USERS',
  findChat: 'FIND_CHAT',
  editProfile: 'EDIT_PROFILE',
  editApp: 'EDIT_APP',
  post: 'POST',
};
