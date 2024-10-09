export const ITEMS_PER_PAGE = 8;
export const HEADER_HEIGHT = 60;
export const MESSENGER_HEADER_HEIGHT = 50;
export const MESSENGER_FOOTER_HEIGHT = 50;
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
] as const;
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
  editUserRole: 'EDIT_USER_ROLE',
  editUserIsFamily: 'EDIT_USER_IS_FAMILY',
  submitVote: 'SUBMIT_VOTE',
  cancelVote: 'CANCEL_VOTE',
  submitSuggestion: 'SUBMIT_SUGGESTION',
  syncProfileData: 'SYNC_PROFILE_DATA',
  findOrCreateChat: 'FIND_OR_CREATE_CHAT',
  createChatGroup: 'CREATE_CHAT_GROUP',
  editSuggestion: 'EDIT_SUGGESTION',
  changeSuggestionStatus: 'CHANGE_SUGGESTION_STATUS',
  deleteSuggestion: 'DELETE_SUGGESTION',
  exitChatGroup: 'EXIT_CHAT_GROUP',
  removeChatMember: 'REMOVE_CHAT_MEMBER',
  editChatGroup: 'EDIT_CHAT_GROUP',
  editPost: 'EDIT_POST',
  deletePost: 'DELETE_POST',
};
