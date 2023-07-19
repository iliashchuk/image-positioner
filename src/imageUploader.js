const DB_NAME = "imageDB";
const STORE_NAME = "images";

const setupImageUploader = (uploadCallback, emptyCallback) => {
  let db;

  const storeUploadedImage = (file) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(STORE_NAME);
    const imageRequest = objectStore.put(file, "uploadedImage");

    imageRequest.onsuccess = () => {
      console.log("Image saved successfully");
    };

    imageRequest.onerror = () => {
      console.log("Image could not be saved");
    };
  };

  const fileInputChangeListener = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      const imageURL = URL.createObjectURL(e.target.files[0]);
      storeUploadedImage(imageFile);

      uploadCallback(imageURL);
    } else {
      emptyCallback();
    }
  };

  const invokeUploadCallbackIfSavedImageExists = () => {
    const transaction = db.transaction([STORE_NAME]);
    const objectStore = transaction.objectStore(STORE_NAME);
    const imageRequest = objectStore.get("uploadedImage");

    imageRequest.onerror = () => {
      console.log("Could not retrieve image");
    };

    imageRequest.onsuccess = () => {
      // request.result is the Blob
      if (imageRequest.result) {
        const imageUrl = URL.createObjectURL(imageRequest.result);
        uploadCallback(imageUrl);
      }
    };
  };

  const request = indexedDB.open(DB_NAME, 1);

  request.onerror = () => {
    console.log("Could not open IndexedDB");
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    invokeUploadCallbackIfSavedImageExists();
  };

  request.onupgradeneeded = (event) => {
    db = event.target.result;
    db.createObjectStore(STORE_NAME);
  };

  document
    .getElementById("imageUpload")
    .addEventListener("change", fileInputChangeListener);
};

export default setupImageUploader;
