import CircleCanvas from './circleCanvas';
import ControlBar from './controlBar';
import setupImageUploader from './imageUploader';

const circleCanvas = new CircleCanvas();
const controlBar = new ControlBar({
    setConfigCallback: circleCanvas.setConfig,
    deleteCallback: circleCanvas.deleteCircle,
    deleteAllCallback: circleCanvas.deleteAllCircles,
    applyStyleCallback: circleCanvas.applyStyle,
    exportCallback: circleCanvas.exportCallback,
});

circleCanvas.setSelectionControls(
    controlBar.setSelectedShape,
    controlBar.unsetSelectedShape,
);

const imageUploadedCallback = (imageUrl) => {
    circleCanvas.setBackgroundImage(imageUrl);
    controlBar.show();
};

const imageEmptyCallback = () => {
    controlBar.hide();
};

setupImageUploader(imageUploadedCallback, imageEmptyCallback);
