import { configureStore } from '@reduxjs/toolkit';
import imageAnnotationsReducer from './slices/imageAnnotations';

export const store = configureStore({
  reducer: {
    imageAnnotations: imageAnnotationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 