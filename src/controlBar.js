class ControrBar {
  constructor(configCallback) {
    this.selectedShape = null;
    this.element = document.getElementById('controlBar');
    this.configCallback = configCallback;

    this.configCallback({ size: 50, opacity: 100 });
    this.setSelectedShapeCallback = this.setSelectedShapeCallback.bind(this);

    this.setupListeners();
  }

  setSelectedShapeCallback(shape) {
    this.selectedShape = shape;
  }

  hide() {
    this.element.style.display = 'hidden';
  }

  show() {
    this.element.style.display = 'block';
  }

  setupListeners() {
    document.getElementById('circleSize').addEventListener('input', (e) => {
      const size = parseInt(e.target.value, 10);

      if (this.selectedShape) {
        this.selectedShape.size = size;
      }

      this.configCallback({ size });
    });

    document
      .getElementById('circleOpacity')
      .addEventListener('input', (e) => {
        const opacity = parseInt(e.target.value, 10) / 100;

        if (this.selectedShape) {
          this.selectedShape.opacity = opacity;
        }

        this.configCallback({ opacity });
      });
  }
}

export default ControrBar;
