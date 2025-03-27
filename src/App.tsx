import { Provider } from 'react-redux';
import { store } from './store';
import { ImageUploader } from './components/ImageUploader';
import ImageGallery from './components/ImageGallery';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className='container mx-auto p-4 max-w-5xl'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Image Annotation Tool</h1>
        
        <div className='bg-white shadow-md rounded-lg p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Upload Images</h2>
          <ImageUploader />
        </div>
        
        <div className='bg-white shadow-md rounded-lg p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Image Gallery</h2>
          <ImageGallery />
        </div>
        
        <div className='text-center text-sm text-gray-500 mt-8'>
          <p>Click on thumbnails to open in annotation view</p>
          <p>In annotation view, click anywhere on the image to add a comment</p>
          <p>Click on numbered markers to view and reply to comments</p>
        </div>
      </div>
    </Provider>
  );
}

export default App;
