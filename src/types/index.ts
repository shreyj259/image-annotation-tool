export interface Comment {
  id: string;
  x: number;
  y: number;
  text: string;
  createdAt: string;
  replies: Reply[];
}

export interface Reply {
  id: string;
  text: string;
  createdAt: string;
}

export interface AnnotatedImage {
  id: string;
  url: string;
  name: string;
  comments: Comment[];
}

export interface AppState {
  images: AnnotatedImage[];
  selectedImageId: string | null;
  activeCommentId: string | null;
} 