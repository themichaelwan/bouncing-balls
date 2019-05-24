(function () {

  // Setup canvas
  const Base = function (ballCount) {
    let canvas = document.getElementById("bouncing");
    this.ctx = canvas.getContext("2d");
    this.canvasSize = { x: canvas.width, y: canvas.height };

    this.allObj = [];

    for (let i = 0; i < ballCount; i++) {
      // let circle = new Circle(this.canvasSize, this.ctx, getRandomInt(0, this.canvasSize.x),
      //   getRandomInt(0, this.canvasSize.y), getRandomInt(5, 50), getRandomColor(), getRandomInt(-5, 5), getRandomInt(-5, 5))

      let circle = new Circle(this.canvasSize, this.ctx, this.canvasSize.x / 2,
        this.canvasSize.y / 2, getRandomInt(5, 50), getRandomColor(), getRandomInt(-5, 5), getRandomInt(-5, 5))
      this.allObj.push(circle);
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
      this.allObj.forEach(obj => obj.update());
    }
  };

  const Circle = function (canvasSize, ctx, x, y, diameter, color, dx, dy) {
    this.canvasSize = canvasSize;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.color = color;
    this.dx = dx;
    this.dy = dy;
  };

  Circle.prototype = {
    update: function () {
      this.ctx.beginPath();
      this.ctx.fillStyle = this.color;
      this.ctx.arc(this.x, this.y, this.diameter, 0, 2 * Math.PI);
      this.ctx.fill();
      this.x += this.dx;
      this.y += this.dy;

      if (this.x - this.diameter < 0 && this.dx < 0) {
        this.dx = -this.dx;
      }
      if (this.x + this.diameter > this.canvasSize.x && this.dx > 0) {
        this.dx = -this.dx;
      }
      if (this.y - this.diameter < 0 && this.dy < 0) {
        this.dy = -this.dy;
      }
      if (this.y + this.diameter > this.canvasSize.y && this.dy > 0) {
        this.dy = -this.dy;
      }

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