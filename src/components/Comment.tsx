import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { 
  editComment, 
  deleteComment, 
  addReply, 
  editReply, 
  deleteReply 
} from '../store/slices/imageAnnotations';
import type { Comment as CommentType, Reply as ReplyType } from '../types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface CommentProps {
  comment: CommentType;
  onClose: () => void;
}

export const Comment = ({ comment, onClose }: CommentProps) => {
  const dispatch = useAppDispatch();
  const { images, selectedImageId } = useAppSelector(state => state.imageAnnotations);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [replyText, setReplyText] = useState('');
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyText, setEditReplyText] = useState('');
  
  const currentComment = selectedImageId
    ? images
        .find(img => img.id === selectedImageId)
        ?.comments.find(c => c.id === comment.id)
    : null;
    

  useEffect(() => {
    if (currentComment) {
      setEditText(currentComment.text);
    }
  }, [currentComment]);

  const handleSaveEdit = () => {
    if (editText.trim()) {
      dispatch(editComment({ commentId: comment.id, text: editText }));
      setIsEditing(false);
    }
  };

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      dispatch(addReply({ commentId: comment.id, text: replyText }));
      setReplyText('');
    }
  };

  const handleEditReply = (reply: ReplyType) => {
    setEditingReplyId(reply.id);
    setEditReplyText(reply.text);
  };

  const handleSaveReplyEdit = (replyId: string) => {
    if (editReplyText.trim()) {
      dispatch(editReply({
        commentId: comment.id,
        replyId,
        text: editReplyText
      }));
      setEditingReplyId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!currentComment) {
    onClose();
    return null;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-80 max-h-[400px] z-50 overflow-y-auto">
      <div className="flex justify-between items-center mb-2 border-b pb-2">
        <h3 className="font-bold">Comment</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          ✕
        </button>
      </div>
      
      {isEditing ? (
        <div className="mb-4">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows={3}
          />
          <div className="flex justify-end mt-2 space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4">
           <div className="mt-1 flex justify-between items-center">
            <div className='flex gap-2 text-xs items-center py-1'>
              <div className='bg-cyan-600 leading-tight text-white rounded-full w-5 h-5 flex justify-center items-center'>
                S
              </div>
              <span className='text-gray-800 text-sm font-semibold'>
              Shrey Jain
              </span>
            </div>
            <span >
              <span className="text-xs text-gray-500 mr-2">
              {formatDate(currentComment.createdAt)}
              </span>
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                  ⋮
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => dispatch(deleteComment(currentComment.id))}
                  className="text-red-500"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </span>
            
          </div>
          <div className='flex justify-between' >
          <p className="text-left pl-7 text-xs">{currentComment.text}</p>
          <div className="relative">
            
          </div>
          </div>
         
        </div>
      )}

      <div className=" mb-3">
        
        {currentComment.replies.length > 0 ? (
          <div className="space-y-3 border-t border-gray-200 pt-3">
            {currentComment.replies.map((reply) => (
              <div key={reply.id} className="pl-3 border-l-2 border-gray-200">
                {editingReplyId === reply.id ? (
                  <div>
                    <textarea
                      value={editReplyText}
                      onChange={(e) => setEditReplyText(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      rows={2}
                    />
                    <div className="flex justify-end mt-1 space-x-2">
                      <button
                        onClick={() => setEditingReplyId(null)}
                        className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveReplyEdit(reply.id)}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center">
                    <div className='flex gap-2 text-xs items-center py-1'>
              <div className='bg-cyan-600 leading-tight text-white rounded-full w-5 h-5 flex justify-center items-center'>
                S
              </div>
              <span className='text-gray-800 text-sm font-semibold'>
              Shrey Jain
              </span>
            </div>
                      <span>
                      <span className="text-xs text-gray-500 mr-2">
                        {formatDate(reply.createdAt)}
                      </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                          ⋮
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => handleEditReply(reply)}
                              className="text-blue-500"
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => dispatch(deleteReply({ commentId: currentComment.id, replyId: reply.id }))}
                              className="text-red-500"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-left pl-7 text-xs">{reply.text}</p>
                      <div className="relative"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-3">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Add a reply..."
          className="w-full p-2 text-sm border border-gray-300 rounded"
          rows={2}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSubmitReply}
            disabled={!replyText.trim()}
            className={`px-3 py-1 text-sm rounded ${
              replyText.trim() 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}; 