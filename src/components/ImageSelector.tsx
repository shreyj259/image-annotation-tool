import { useAppSelector, useAppDispatch } from '../hooks';
import { selectImage } from '../store/slices/imageAnnotations';

export const ImageSelector = () => {
  const dispatch = useAppDispatch();
  const { images, selectedImageId } = useAppSelector(state => state.imageAnnotations);

  if (images.length === 0) {
    return <div className="text-gray-500 text-sm italic">No images uploaded</div>;
  }

  return (
    <div className="mb-4 w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Image
      </label>
      <select
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedImageId || ''}
        onChange={(e) => dispatch(selectImage(e.target.value))}
      >
        <option value="" disabled>Select an image</option>
        {images.map((image) => (
          <option key={image.id} value={image.id}>
            {image.name}
          </option>
        ))}
      </select>
    </div>
  );
}; 