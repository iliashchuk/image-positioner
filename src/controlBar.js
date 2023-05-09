class ControrBar {
  constructor(configCallback) {
    this.selectedShape = null;
    this.element = document.getElementById('controlBar');
    this.configCallback = configCallback;

    this.configCallback({ size: 50, opacity: 100, fillColor: '#000000' });
    this.setSelectedShape = this.setSelectedShape.bind(this);
    this.unsetSelectedShape = this.unsetSelectedShape.bind(this);

    this.setupListeners();
  }

  hide() {
    this.element.style.display = 'hidden';
  }

  show() {
    this.element.style.display = 'block';
  }

  setSelectedShape(shape) {
    this.unsetSelectedShape();

    this.selectedShape = shape;

    this.setConfigToShapeConfig(shape);
  }

  unsetSelectedShape() {
    if (this.selectedShape) {
      this.selectedShape.selected = false;
      this.selectedShape = null;

      return true;
    }

    return false;
  }

  setConfigToShapeConfig(shape) {
    document.getElementById('circleSize').value = shape.size;
    document.getElementById('circleFillColor').value = shape.fillColor;
    document.getElementById('circleOpacity').value = shape.opacity * 100;
    document.getElementById('circleName').value = shape.name ?? '';

    this.configCallback({ shape });
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

    document.getElementById('circleName').addEventListener('input', (e) => {
      const name = e.target.value;

      if (this.selectedShape) {
        this.selectedShape.name = name;
      }

      this.configCallback();
    });

    document
      .getElementById('circleFillColor')
      .addEventListener('input', (e) => {
        const fillColor = e.target.value;

        if (this.selectedShape) {
          this.selectedShape.fillColor = fillColor;
        }

        this.configCallback({ fillColor });
      });
  }
}

export default ControrBar;
