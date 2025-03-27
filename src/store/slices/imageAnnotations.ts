import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { AppState, AnnotatedImage, Comment, Reply } from '../../types';

const loadState = (): AppState => {
  try {
    const savedState = localStorage.getItem('imageAnnotations');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
  }
  return {
    images: [],
    selectedImageId: null,
    activeCommentId: null
  };
};

const initialState: AppState = loadState();


const saveState = (state: AppState) => {
  try {
    localStorage.setItem('imageAnnotations', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};

const imageAnnotationsSlice = createSlice({
  name: 'imageAnnotations',
  initialState,
  reducers: {
  
    addImage: (state, action: PayloadAction<{ url: string, name: string }>) => {
      const newImage: AnnotatedImage = {
        id: uuidv4(),
        url: action.payload.url,
        name: action.payload.name,
        comments: []
      };
      state.images.push(newImage);
      
 
      if (state.images.length === 1) {
        state.selectedImageId = newImage.id;
      }
      
      saveState(state);
    },

   
    selectImage: (state, action: PayloadAction<string>) => {
      state.selectedImageId = action.payload;
      state.activeCommentId = null; 
      saveState(state);
    },

  
    addComment: (state, action: PayloadAction<{ x: number, y: number, text: string }>) => {
      const { x, y, text } = action.payload;
      if (!state.selectedImageId) return;

      const imageIndex = state.images.findIndex(img => img.id === state.selectedImageId);
      if (imageIndex === -1) return;

      const newComment: Comment = {
        id: uuidv4(),
        x,
        y,
        text,
        createdAt: new Date().toISOString(),
        replies: []
      };

      state.images[imageIndex].comments.push(newComment);
      state.activeCommentId = newComment.id;
      saveState(state);
    },

   
    editComment: (state, action: PayloadAction<{ commentId: string, text: string }>) => {
      const { commentId, text } = action.payload;
      if (!state.selectedImageId) return;

      const imageIndex = state.images.findIndex(img => img.id === state.selectedImageId);
      if (imageIndex === -1) return;

      const commentIndex = state.images[imageIndex].comments.findIndex(c => c.id === commentId);
      if (commentIndex === -1) return;

      state.images[imageIndex].comments[commentIndex].text = text;
      saveState(state);
    },

   
    deleteComment: (state, action: PayloadAction<string>) => {
      const commentId = action.payload;
      if (!state.selectedImageId) return;

      const imageIndex = state.images.findIndex(img => img.id === state.selectedImageId);
      if (imageIndex === -1) return;

      const newComments = state.images[imageIndex].comments.filter(c => c.id !== commentId);
      state.images[imageIndex].comments = newComments;

      if (state.activeCommentId === commentId) {
        state.activeCommentId = null;
      }
      
      saveState(state);
    },

 
    addReply: (state, action: PayloadAction<{ commentId: string, text: string }>) => {
      const { commentId, text } = action.payload;
      if (!state.selectedImageId) return;

      const imageIndex = state.images.findIndex(img => img.id === state.selectedImageId);
      if (imageIndex === -1) return;

      const commentIndex = state.images[imageIndex].comments.findIndex(c => c.id === commentId);
      if (commentIndex === -1) return;

      const newReply: Reply = {
        id: uuidv4(),
        text,
        createdAt: new Date().toISOString()
      };

   
      state.images[imageIndex].comments[commentIndex].replies.push(newReply);
      

      state.images[imageIndex].comments[commentIndex] = {
        ...state.images[imageIndex].comments[commentIndex]
      };
      

      saveState(state);
    },


    editReply: (state, action: PayloadAction<{ commentId: string, replyId: string, text: string }>) => {
      const { commentId, replyId, text } = action.payload;
      if (!state.selectedImageId) return;

      const imageIndex = state.images.findIndex(img => img.id === state.selectedImageId);
      if (imageIndex === -1) return;

      const commentIndex = state.images[imageIndex].comments.findIndex(c => c.id === commentId);
      if (commentIndex === -1) return;

      const replyIndex = state.images[imageIndex].comments[commentIndex].replies.findIndex(r => r.id === replyId);
      if (replyIndex === -1) return;


      state.images[imageIndex].comments[commentIndex].replies[replyIndex].text = text;
      

      state.images[imageIndex].comments[commentIndex] = {
        ...state.images[imageIndex].comments[commentIndex]
      };
      
      saveState(state);
    },


    deleteReply: (state, action: PayloadAction<{ commentId: string, replyId: string }>) => {
      const { commentId, replyId } = action.payload;
      if (!state.selectedImageId) return;

      const imageIndex = state.images.findIndex(img => img.id === state.selectedImageId);
      if (imageIndex === -1) return;

      const commentIndex = state.images[imageIndex].comments.findIndex(c => c.id === commentId);
      if (commentIndex === -1) return;


      const newReplies = state.images[imageIndex].comments[commentIndex].replies.filter(r => r.id !== replyId);
      
  
      state.images[imageIndex].comments[commentIndex] = {
        ...state.images[imageIndex].comments[commentIndex],
        replies: newReplies
      };
      
      saveState(state);
    },

 
    setActiveComment: (state, action: PayloadAction<string | null>) => {
      state.activeCommentId = action.payload;
      saveState(state);
    }
  }
});

export const {
  addImage,
  selectImage,
  addComment,
  editComment,
  deleteComment,
  addReply,
  editReply,
  deleteReply,
  setActiveComment
} = imageAnnotationsSlice.actions;

export default imageAnnotationsSlice.reducer; 