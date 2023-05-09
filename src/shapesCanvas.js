export default class ShapesCanvas {
  constructor() {
    this.circles = [];
    this.movingCircle = null;
    this.backgroundImage = new Image();
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.config = {};
    this.setupListeners();

    this.configCallback = this.configCallback.bind(this);
  }

  configCallback(config) {
    this.config = { ...this.config, ...config };
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
    this.canvas.addEventListener('mousedown', (e) => {
      const { x, y } = this.extractEventCoordinates(e);
      this.movingCircle = this.circles.find((circle) => ShapesCanvas.isPointInCircle(circle, x, y));

      if (this.movingCircle) {
        document.getElementById('circleSize').value = this.movingCircle.radius;
        document.getElementById('circleOpacity').value = this.movingCircle.opacity * 100;
        document.getElementById('circleName').value = this.movingCircle.name;
      } else {
        this.addCircle(x, y);
      }
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.movingCircle) {
        const { x, y } = this.extractEventCoordinates(e);
        this.movingCircle.x = x;
        this.movingCircle.y = y;
        this.drawCircles();
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      this.movingCircle = null;
    });

    this.canvas.addEventListener('dblclick', (e) => {
      const { x, y } = this.extractEventCoordinates(e);
      const circleToDelete = this.circles.find(
        (circle) => ShapesCanvas.isPointInCircle(circle, x, y),
      );

      if (circleToDelete) {
        this.circles = this.circles.filter((circle) => circle.id !== circleToDelete.id);
        this.drawCircles();
      }
    });
  }

  addCircle(x, y) {
    const { size, opacity } = this.config;

    this.circles.push({
      x, y, radius: size, opacity, id: Math.random(),
    });

    this.drawCircles();
  }

  drawCircles() {
    this.clear();
    this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);

    this.circles.forEach((circle) => {
      this.ctx.beginPath();
      this.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
      this.ctx.globalAlpha = circle.opacity;
      this.ctx.fillStyle = 'black';
      this.ctx.fill();
      this.ctx.globalAlpha = 1;

      if (circle.name) {
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(
          circle.name,
          circle.x - this.ctx.measureText(circle.name).width / 2,
          circle.y + 8,
        );
      }
    });
  }

  static isPointInCircle(circle, x, y) {
    const dx = x - circle.x;
    const dy = y - circle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= circle.radius;
  }

  extractEventCoordinates(e) {
    const x = e.clientX - this.canvas.getBoundingClientRect().left;
    const y = e.clientY - this.canvas.getBoundingClientRect().top;

    return { x, y };
  }
}
