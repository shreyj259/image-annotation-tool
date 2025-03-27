import { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { addComment, setActiveComment } from '../store/slices/imageAnnotations';
import { Comment } from './Comment';
import type { Comment as CommentType } from '../types';

export const ImageAnnotator = () => {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const [commentPosition, setCommentPosition] = useState<{ x: number, y: number } | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [activeMarker, setActiveMarker] = useState<CommentType | null>(null);
  
  const { 
    images, 
    selectedImageId, 
    activeCommentId 
  } = useAppSelector(state => state.imageAnnotations);
  
  const selectedImage = images.find(img => img.id === selectedImageId);
  
  
  useEffect(() => {
    setCommentPosition(null);
    setNewCommentText('');
    setActiveMarker(null);
  }, [selectedImageId]);
  

  useEffect(() => {
    if (selectedImage && activeCommentId) {
      const comment = selectedImage.comments.find(c => c.id === activeCommentId);
      if (comment) {
        setActiveMarker(comment);
      }
    } else if (!activeCommentId) {
      setActiveMarker(null);
    }
  }, [selectedImage, activeCommentId, images]);
  
  
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedImage || !containerRef.current) return;
    

    if (activeMarker) {
      setActiveMarker(null);
      dispatch(setActiveComment(null));
      return;
    }
    

    if (commentPosition) {
      setCommentPosition(null);
      setNewCommentText('');
      return;
    }
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setCommentPosition({ x, y });
  };
  
  const handleAddComment = () => {
    if (!commentPosition || !newCommentText.trim() || !selectedImageId) return;
    
    dispatch(addComment({
      x: commentPosition.x,
      y: commentPosition.y,
      text: newCommentText
    }));
    
    setCommentPosition(null);
    setNewCommentText('');
  };
  

  const showComment = (comment: CommentType) => {
    setActiveMarker(comment);
    dispatch(setActiveComment(comment.id));
  };
  

  const handleCloseComment = () => {
    setActiveMarker(null);
    dispatch(setActiveComment(null));
  };
  
  if (!selectedImage) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No image selected</p>
      </div>
    );
  }
  
  return (
    <div className="relative w-full" ref={containerRef}>

      <div 
        className="relative w-full rounded-lg overflow-hidden cursor-crosshair"
        onClick={handleImageClick}
      >
        <img
          src={selectedImage.url}
          alt={selectedImage.name}
          className="w-full object-contain"
          style={{ maxHeight: '500px' }}
        />
        

        {selectedImage.comments.map((comment, index) => (
          <button
            key={comment.id}
            className={`absolute rounded-full flex items-center justify-center text-xs 
              h-6 w-6 bg-blue-500 text-white font-bold 
              ${activeCommentId === comment.id ? 'ring-2 ring-blue-300 z-10' : ''}
            `}
            style={{
              left: `${comment.x}%`,
              top: `${comment.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={(e) => {
              e.stopPropagation();
              showComment(comment);
            }}
          >
            {index + 1}
          </button>
        ))}
        

        {commentPosition && (
          <div 
            className="absolute z-10"
            style={{
              left: `${commentPosition.x}%`,
              top: `${commentPosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white p-3 rounded-lg shadow-lg w-64">
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-2 border border-gray-300 rounded"
                rows={3}
                autoFocus
              />
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  onClick={() => {
                    setCommentPosition(null);
                    setNewCommentText('');
                  }}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  disabled={!newCommentText.trim()}
                  className={`px-3 py-1 text-sm rounded ${
                    newCommentText.trim() 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
        
      
        {activeMarker && (
          <div 
            className="absolute z-10"
            style={{
              left: `${activeMarker.x}%`,
              top: `${activeMarker.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Comment 
              comment={activeMarker} 
              onClose={handleCloseComment} 
            />
          </div>
        )}
      </div>
    </div>
  );
}; 