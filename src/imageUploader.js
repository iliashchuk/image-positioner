const setupImageUploader = (uploadCallback, emptyCallback) => {
  document.getElementById('imageUpload').addEventListener('change', (e) => {
    if (e.target.files[0]) {
      const imageURL = URL.createObjectURL(e.target.files[0]);
      uploadCallback(imageURL);
    } else {
      emptyCallback();
    }
  });
};

export default setupImageUploader;
