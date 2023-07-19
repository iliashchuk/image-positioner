import store from "store2";

const STORAGE_KEYS = Object.freeze({
  circles: "circles",
  config: "config",
});

export default class CircleCanvas {
  constructor() {
    const storedCircles = store(STORAGE_KEYS.circles);
    const storedConfig = store(STORAGE_KEYS.config);

    this.circles = storedCircles ?? [];
    this.config = storedConfig ?? {};
    this.movingCircle = null;
    this.backgroundImage = new Image();
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.setupListeners();

    this.setConfig = this.setConfig.bind(this);
    this.applyStyle = this.applyStyle.bind(this);
    this.deleteCircle = this.deleteCircle.bind(this);
    this.deleteAllCircles = this.deleteAllCircles.bind(this);
  }

  updateStoredCircles() {
    const circlesToStore = this.circles.map((circle) => {
      // eslint-disable-next-line no-unused-vars
      const { selected, ...circleToSave } = circle;
      return circleToSave;
    });

    store(STORAGE_KEYS.circles, circlesToStore);
  }

  setConfig(config = {}) {
    this.config = { ...this.config, ...config };

    store(STORAGE_KEYS.config, this.config);

    this.drawCircles();
  }

  applyStyle(style) {
    this.setConfig(style);

    this.circles = this.circles.map((circle) => ({ ...circle, ...style }));

    this.updateStoredCircles();

    this.drawCircles();
  }

  setSelectionControls(setSelectedShape, unsetSelectedShape) {
    this.setSelectedShape = setSelectedShape;
    this.unsetSelectedShape = unsetSelectedShape;
  }

  setBackgroundImage(backgroundImageUrl) {
    this.backgroundImage.onload = () => {
      const maxWidth = window.innerWidth;
      const scaleFactor = maxWidth / this.backgroundImage.width;
      const scaledWidth = this.backgroundImage.width * scaleFactor;
      const scaledHeight = this.backgroundImage.height * scaleFactor;

      this.canvas.width = scaledWidth;
      this.canvas.height = scaledHeight;
      this.drawCircles();
    };

    this.backgroundImage.src = backgroundImageUrl;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setupListeners() {
    this.canvas.addEventListener("mousedown", (e) => {
      const { x, y } = this.extractEventCoordinates(e);
      this.movingCircle = this.circles.find((circle) =>
        CircleCanvas.isPointInCircle(circle, x, y)
      );

      if (this.movingCircle) {
        return;
      }

      if (this.unsetSelectedShape()) {
        this.drawCircles();

        return;
      }

      this.addCircle(x, y);
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.movingCircle) {
        const { x, y } = this.extractEventCoordinates(e);
        this.moveMovingCircle(x, y);
      }
    });

    this.canvas.addEventListener("mouseup", () => {
      this.movingCircle = null;
    });

    this.canvas.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      const { x, y } = this.extractEventCoordinates(e);
      const circleToSelect = this.circles.find((circle) =>
        CircleCanvas.isPointInCircle(circle, x, y)
      );

      if (circleToSelect) {
        circleToSelect.selected = true;
        this.setSelectedShape(circleToSelect);
        this.drawCircles();
      }
    });
  }

  addCircle(x, y) {
    const { size, opacity, fillColor } = this.config;

    this.circles.push({
      x,
      y,
      size,
      opacity,
      fillColor,
      id: Math.random(),
    });

    this.updateStoredCircles();
    this.drawCircles();
  }

  moveMovingCircle(x, y) {
    this.movingCircle.x = x;
    this.movingCircle.y = y;

    this.updateStoredCircles();
    this.drawCircles();
  }

  deleteCircle(circleToDelete) {
    this.circles = this.circles.filter(
      (circle) => circle.id !== circleToDelete.id
    );

    this.updateStoredCircles();
    this.drawCircles();
  }

  deleteAllCircles() {
    this.circles = [];

    this.updateStoredCircles();
    this.drawCircles();
  }

  drawCircles() {
    this.clear();
    this.ctx.drawImage(
      this.backgroundImage,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    this.circles.forEach((circle) => {
      const ajustedRadius = circle.selected
        ? circle.size - this.ctx.lineWidth / 2
        : circle.size;
      this.ctx.beginPath();
      this.ctx.arc(circle.x, circle.y, ajustedRadius, 0, 4 * Math.PI);
      this.ctx.globalAlpha = circle.opacity;
      this.ctx.fillStyle = circle.fillColor || "black";
      this.ctx.fill();
      this.ctx.globalAlpha = 1;

      if (circle.selected) {
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }

      if (circle.name) {
        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(
          circle.name,
          circle.x - this.ctx.measureText(circle.name).width / 2,
          circle.y + 8
        );
      }
    });
  }

  static isPointInCircle(circle, x, y) {
    const dx = x - circle.x;
    const dy = y - circle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= circle.size;
  }

  extractEventCoordinates(e) {
    const x = e.clientX - this.canvas.getBoundingClientRect().left;
    const y = e.clientY - this.canvas.getBoundingClientRect().top;

    return { x, y };
  }
}
