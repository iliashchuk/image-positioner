const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const backgroundImage = new Image();
let circles = [];
const controlBar = document.getElementById("controlBar");

let selectedCircle = null;

document.getElementById("imageUpload").addEventListener("change", function (e) {
  if (e.target.files[0]) {
    const imageURL = URL.createObjectURL(e.target.files[0]);
    setBackgroundImage(imageURL);
    controlBar.style.display = "block";
  } else {
    clearCanvas();
    controlBar.style.display = "none";
  }
});

document.getElementById("circleSize").addEventListener("input", function (e) {
  const newSize = parseInt(e.target.value);
  circles.forEach((circle) => {
    circle.radius = newSize;
  });
  drawCircles();
});

document
  .getElementById("circleOpacity")
  .addEventListener("input", function (e) {
    const newOpacity = parseInt(e.target.value) / 100;
    circles.forEach((circle) => {
      circle.opacity = newOpacity;
    });
    drawCircles();
  });

backgroundImage.onload = function () {
  drawCircles();
};

canvas.addEventListener("mousedown", function (e) {
  const x = e.clientX - canvas.getBoundingClientRect().left;
  const y = e.clientY - canvas.getBoundingClientRect().top;
  selectedCircle = circles.find((circle) => isPointInCircle(circle, x, y));

  if (selectedCircle) {
    document.getElementById("circleSize").value = selectedCircle.radius;
    document.getElementById("circleOpacity").value =
      selectedCircle.opacity * 100;
    document.getElementById("circleName").value = selectedCircle.name;
  } else {
    addCircle(x, y);
  }
});

canvas.addEventListener("mousemove", function (e) {
  if (selectedCircle) {
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;
    selectedCircle.x = x;
    selectedCircle.y = y;
    drawCircles();
  }
});

canvas.addEventListener("mouseup", function () {
  selectedCircle = null;
});

canvas.addEventListener("dblclick", (e) => {
  const x = e.clientX - canvas.getBoundingClientRect().left;
  const y = e.clientY - canvas.getBoundingClientRect().top;
  const circleToDelete = circles.find((circle) =>
    isPointInCircle(circle, x, y)
  );

  if (circleToDelete) {
    circles = circles.filter((circle) => circle.id !== circleToDelete.id);
    drawCircles();
  }
});

function setBackgroundImage(imageURL) {
  const maxWidth = window.innerWidth;

  backgroundImage.onload = function () {
    const scaleFactor = maxWidth / backgroundImage.width;
    const scaledWidth = backgroundImage.width * scaleFactor;
    const scaledHeight = backgroundImage.height * scaleFactor;

    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
    drawCircles();
  };

  backgroundImage.src = imageURL;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function addCircle(x, y) {
  const radius = parseInt(document.getElementById("circleSize").value);
  const opacity =
    parseInt(document.getElementById("circleOpacity").value) / 100;
  const name = document.getElementById("circleName").value;

  circles.push({ x, y, radius, opacity, name, id: Math.random() });
  drawCircles();
  console.log(circles);
}

function isPointInCircle(circle, x, y) {
  const dx = x - circle.x;
  const dy = y - circle.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance <= circle.radius;
}

function drawCircles() {
  clearCanvas();
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  for (const circle of circles) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    ctx.globalAlpha = circle.opacity;
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.globalAlpha = 1;

    // Draw the circle name
    if (circle.name) {
      ctx.font = "16px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(
        circle.name,
        circle.x - ctx.measureText(circle.name).width / 2,
        circle.y + 8
      );
    }
  }
}
