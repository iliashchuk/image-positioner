const DB_NAME = 'imageDB';
const STORE_NAME = 'images';


class ImageUploader {
  constructor(uploadCallback, emptyCallback) {
    this.emptyCallback = emptyCallback;
    this.uploadCallback = uploadCallback;

    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = () => {
      console.log('Could not open IndexedDB');
    };
    
    request.onsuccess = (event) => {
      this.db = event.target.result;
      this.invokeUploadCallbackIfSavedImageExists();
    };
    
    request.onupgradeneeded = (event) => {
      this.db = event.target.result;
      this.db.createObjectStore(STORE_NAME);
    };

    document.getElementById('imageUpload').addEventListener('change', this.fileInputChangeListener);
  }
  
  fileInputChangeListener = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      const imageURL = URL.createObjectURL(e.target.files[0]);
      this.storeUploadedImage(imageFile)
      
      this.uploadCallback(imageURL);
    } else {
      this.emptyCallback();
    }
  }

  invokeUploadCallbackIfSavedImageExists = () => {
    const transaction = this.db.transaction([STORE_NAME]);
    const objectStore = transaction.objectStore(STORE_NAME);
    const imageRequest = objectStore.get('uploadedImage');
  
    imageRequest.onerror = () => {
      console.log('Could not retrieve image');
    };
  
    imageRequest.onsuccess = () => {
      // request.result is the Blob
      if (imageRequest.result) {
        const imageUrl = URL.createObjectURL(imageRequest.result);
        this.uploadCallback(imageUrl)
      }
    };
  }

  storeUploadedImage = (file) => {
    const transaction = this.db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    const imageRequest = objectStore.put(file, 'uploadedImage');

    imageRequest.onsuccess = () => {
      console.log('Image saved successfully');
    };

    imageRequest.onerror = () => {
      console.log('Image could not be saved');
    };
  }
};

export default ImageUploader;
