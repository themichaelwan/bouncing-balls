(function () {

  // Setup canvas
  const Base = function (circleCount) {

    let canvas = document.getElementById("bouncing");
    this.ctx = canvas.getContext("2d");
    this.canvasSize = { x: canvas.width, y: canvas.height };

    this.allCircle = [];

    let totalCircle = 0;

    while (totalCircle < circleCount) {
      let radius = getRandomInt(20, 50);
      let x = getRandomInt(0 + radius, this.canvasSize.x - radius);
      let y = getRandomInt(0 + radius, this.canvasSize.y - radius);
      let mass = 1;

      let circle = new Circle(this.ctx, x, y, radius, getRandomColor(), getRandomInt(-5, 5), getRandomInt(-5, 5), mass);

      this.allCircle.push(circle);
      this.allCircle.forEach(otherCircle => {
        if (isCollide(circle, otherCircle)) {
          this.allCircle.pop();
        }
      });
      totalCircle = this.allCircle.length;
    }

    const self = this;
    // Main tick function, loops forever, about 60 times per sec
    const tick = function () {

      // Update circles
      self.update();
      requestAnimationFrame(tick);
    };
    // Run the first tick, future call will be scheduled by tick() itself
    tick();
  };

  Base.prototype = {
    update: function () {
      this.ctx.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
      this.ctx.strokeRect(0, 0, this.canvasSize.x, this.canvasSize.y);
      this.allCircle.forEach(circle => {
        circle.draw();

        if (circle.x - circle.radius < 0 && circle.dx < 0) {
          circle.dx = - circle.dx;
        }
        if (circle.x + circle.radius > this.canvasSize.x && circle.dx > 0) {
          circle.dx = - circle.dx;
        }
        if (circle.y - circle.radius < 0 && circle.dy < 0) {
          circle.dy = - circle.dy;
        }
        if (circle.y + circle.radius > this.canvasSize.y && circle.dy > 0) {
          circle.dy = - circle.dy;
        }

        this.allCircle.forEach(otherCircle => {
          if (circle !== otherCircle) {
            if (isCollide(circle, otherCircle)) {
              resolveCollision(circle, otherCircle);
            }
          }
        });
      });
    }
  };

  const Circle = function (ctx, x, y, radius, color, dx, dy, mass) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = dx;
    this.dy = dy;
    this.mass = mass;
  };

  Circle.prototype = {
    draw: function () {
      this.ctx.beginPath();
      this.ctx.fillStyle = this.color;
      this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      this.ctx.fill();
      this.x += this.dx;
      this.y += this.dy;
    }
  };

  // Getting a random integer between two values, inclusive
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }

  // Generate random color
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function isCollide(circle, otherCircle) {
    if (circle == otherCircle) {
      return false;
    }
    const x = otherCircle.x - circle.x;
    const y = otherCircle.y - circle.y;

    return (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) < (otherCircle.radius + circle.radius));
  }

  function turn(dx, dy, angle) {
    const turnedVelocities = {
      x: dx * Math.cos(angle) - dy * Math.sin(angle),
      y: dx * Math.sin(angle) + dy * Math.cos(angle)
    };

    return turnedVelocities;
  }

  function resolveCollision(circle, otherCircle) {
    const xVelocityDiff = circle.dx - otherCircle.dx;
    const yVelocityDiff = circle.dy - otherCircle.dy;

    const xDist = otherCircle.x - circle.x;
    const yDist = otherCircle.y - circle.y;

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
      const angle = -Math.atan2(otherCircle.y - circle.y, otherCircle.x - circle.x);
      const m1 = circle.mass;
      const m2 = otherCircle.mass;

      const u1 = turn(circle.dx, circle.dy, angle);
      const u2 = turn(otherCircle.dx, otherCircle.dy, angle);

      // One-dimensional Newtonian equations from https://en.wikipedia.org/wiki/Elastic_collision
      const v1 = { x: ((m1 - m2) / (m1 + m2) * u1.x) + (2 * m2 / (m1 + m2) * u2.x), y: u1.y };
      const v2 = { x: (2 * m1 / (m1 + m2) * u1.x) + ((m2 - m1) / (m1 + m2) * u2.x), y: u1.y };

      const vFinal1 = turn(v1.x, v1.y, -angle);
      const vFinal2 = turn(v2.x, v2.y, -angle);

      circle.dx = vFinal1.x;
      circle.dy = vFinal1.y;

      otherCircle.dx = vFinal2.x;
      otherCircle.dy = vFinal2.y;
    }
  }

  function init() {
    let ballSlider = document.getElementById("ballSlider");
    let ballCount = document.getElementById("ballCount");

    ballCount.innerHTML = ballSlider.value;
    new Base(ballSlider.value);

    ballSlider.oninput = function () {
      ballCount.innerHTML = ballSlider.value;
      new Base(ballSlider.value);
    }
  }

  window.addEventListener("load", function () {
    init();
  });

})();