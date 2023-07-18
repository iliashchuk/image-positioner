import store from "store2";

const IMAGE_STORAGE_KEY = 'imageURL';

const setupImageUploader = (uploadCallback, emptyCallback) => {
  const storedImageURL = store(IMAGE_STORAGE_KEY);

  if(storedImageURL) {
    uploadCallback(storedImageURL);
  }

  document.getElementById('imageUpload').addEventListener('change', (e) => {
    if (e.target.files[0]) {
      const imageURL = URL.createObjectURL(e.target.files[0]);
      
      store(IMAGE_STORAGE_KEY, imageURL);
      uploadCallback(imageURL);
    } else {
      emptyCallback();
    }
  });
};

export default setupImageUploader;
