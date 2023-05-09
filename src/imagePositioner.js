import CircleCanvas from './circleCanvas';
import ControlBar from './controlBar';
import setupImageUploader from './imageUploader';

const circleCanvas = new CircleCanvas();
const controlBar = new ControlBar({
  configCallback: circleCanvas.configCallback,
  deleteCallback: circleCanvas.deleteCircle,
  deleteAllCallback: circleCanvas.deleteAllCircles,
});

circleCanvas.setSelectionControls(controlBar.setSelectedShape, controlBar.unsetSelectedShape);

const imageUploadedCallback = (imageUrl) => {
  circleCanvas.setBackgroundImage(imageUrl);
  controlBar.show();
};

const imageEmptyCallback = () => {
  controlBar.hide();
};

setupImageUploader(imageUploadedCallback, imageEmptyCallback);
