import ShapesCanvas from './shapesCanvas';
import ControlBar from './controlBar';
import setupImageUploader from './imageUploader';

const shapesCanvas = new ShapesCanvas();
const controlBar = new ControlBar(shapesCanvas.configCallback);
shapesCanvas.setSelectionControls(controlBar.setSelectedShape, controlBar.unsetSelectedShape);

const imageUploadedCallback = (imageUrl) => {
  shapesCanvas.setBackgroundImage(imageUrl);
  controlBar.show();
};

const imageEmptyCallback = () => {
  controlBar.hide();
};

setupImageUploader(imageUploadedCallback, imageEmptyCallback);
