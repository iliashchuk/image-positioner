const STORAGE_KEY = "imageURL";

const setupImageUploader = (uploadCallback, emptyCallback) => {
  const storedImageURL = localStorage.getItem(STORAGE_KEY);

  if (storedImageURL) {
    uploadCallback(storedImageURL);
  }

  document.getElementById("imageUpload").addEventListener("change", (e) => {
    if (e.target.files[0]) {
      const imageURL = URL.createObjectURL(e.target.files[0]);

      localStorage.setItem(STORAGE_KEY, imageURL);
      uploadCallback(imageURL);
    } else {
      emptyCallback();
    }
  });
};

export default setupImageUploader;
