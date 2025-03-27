import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { selectImage } from '../store/slices/imageAnnotations';
import { ImageAnnotator } from './ImageAnnotator';

const ImageGallery = () => {
  const { images, selectedImageId } = useAppSelector(state => state.imageAnnotations);
  const dispatch = useAppDispatch();
  const [isAnnotatorOpen, setIsAnnotatorOpen] = useState(false);
  
  const handleImageClick = (imageId: string) => {
    dispatch(selectImage(imageId));
    setIsAnnotatorOpen(true);
  };

  const closeAnnotator = () => {
    setIsAnnotatorOpen(false);
  };

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500 mb-2">No images available</p>
        <p className="text-sm text-gray-400">Upload images to get started</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image) => (
          <div 
            key={image.id} 
            className={`relative cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg 
              transition-all duration-200 border-2 border-transparent`}
            onClick={() => handleImageClick(image.id)}
          >
            <div className="aspect-square overflow-hidden">
              <img 
                src={image.url} 
                alt={image.name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>
            
            {image.comments.length > 0 && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {image.comments.length}
              </div>
            )}
            
            <div className="p-2 text-xs truncate">{image.name}</div>
          </div>
        ))}
      </div>

      {isAnnotatorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="font-semibold">
                {selectedImageId && images.find(img => img.id === selectedImageId)?.name}
              </h3>
              <button 
                onClick={closeAnnotator} 
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <ImageAnnotator />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;