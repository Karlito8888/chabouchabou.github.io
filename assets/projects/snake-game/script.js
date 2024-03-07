window.onload = () => {
  const DIRECTIONS = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, SPACE: 32 };
  const DIRECTION_MAP = {
    [DIRECTIONS.LEFT]: "left",
    [DIRECTIONS.UP]: "up",
    [DIRECTIONS.RIGHT]: "right",
    [DIRECTIONS.DOWN]: "down",
  };

  class Game {
    constructor() {
      this.initCanvas();
        this.init();
        this.isCountdownInProgress = false;
      this.startCountdown();
    }

    initCanvas() {
      this.canvas = document.createElement("canvas");
      this.canvas.style.border = "5px solid rgba(128, 128, 128, 0.7)";
      this.canvas.style.display = "block";
      this.canvas.style.borderRadius = "10px";
      this.canvas.style.webkitBackdropFilter = "blur(3px)";
      this.canvas.style.backdropFilter = "blur(3px)";
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext("2d");
      window.addEventListener("resize", this.adjustCanvasSize.bind(this));
      this.adjustCanvasSize();
    }

    adjustCanvasSize() {
      const maxSize = 290;
      const size = Math.min(window.innerWidth, window.innerHeight, maxSize);
      this.canvas.width = size;
      this.canvas.height = size;
      if (!this.blockSize) {
        this.blockSize = 17;
      }
      this.widthInBlocks = this.canvas.width / this.blockSize;
      this.heightInBlocks = this.canvas.height / this.blockSize;
      this.centreX = this.canvas.width / 2;
      this.centreY = this.canvas.height / 2;
      if (this.snakee) {
        this.launch();
      }
    }

    init() {
      this.delay = 300;
      }
      
startCountdown() {
    if (this.isCountdownInProgress) {
        return; 
    }
    this.isCountdownInProgress = true;
    let countdownValue = 3;
    const countdownInterval = 1000;
    const drawCountdown = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
        this.ctx.font = "bold 6rem sans-serif";
        this.ctx.fillStyle = "#666";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(countdownValue.toString(), this.centreX, this.centreY);

        if (countdownValue > 0) {
            setTimeout(() => {
                countdownValue--;
                requestAnimationFrame(drawCountdown);
            }, countdownInterval);
        } else {
            this.isCountdownInProgress = false;
            this.launch();
        }
    };
    requestAnimationFrame(drawCountdown);
}

    launch() {
      this.snakee = new Snake("right", [6, 4], [5, 4], [4, 4], [3, 4], [2, 4]);
      this.applee = new Apple();
      this.score = 0;
      clearTimeout(this.timeOut);
      this.refreshCanvas();
    }

    refreshCanvas() {
      this.snakee.advance();
      if (this.snakee.checkCollision(this.widthInBlocks, this.heightInBlocks)) {
        Drawing.gameOver(this.ctx, this.centreX, this.centreY);
      } else {
        if (this.snakee.isEatingApple(this.applee)) {
          this.score++;
          this.snakee.ateApple = true;
          do {
            this.applee.setNewPosition(this.widthInBlocks, this.heightInBlocks);
          } while (this.applee.isOnSnake(this.snakee));

          if (this.score % 5 === 0) {
            this.speedUp();
          }
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        Drawing.drawScore(this.ctx, this.centreX, this.centreY, this.score);
        Drawing.drawSnake(this.ctx, this.blockSize, this.snakee);
        Drawing.drawApple(this.ctx, this.blockSize, this.applee);
        this.timeOut = setTimeout(this.refreshCanvas.bind(this), this.delay);
      }
    }

    speedUp() {
      this.delay /= 2;
    }
  }

  class Snake {
    constructor(direction, ...body) {
      this.body = body;
      this.direction = direction;
      this.ateApple = false;
    }

    advance() {
      const nextPosition = this.body[0].slice();
      switch (this.direction) {
        case "left":
          nextPosition[0] -= 1;
          break;
        case "right":
          nextPosition[0] += 1;
          break;
        case "down":
          nextPosition[1] += 1;
          break;
        case "up":
          nextPosition[1] -= 1;
          break;
        default:
          throw "invalid direction";
      }
      this.body.unshift(nextPosition);
      if (!this.ateApple) this.body.pop();
      else this.ateApple = false;
    }

    setDirection(newDirection) {
      let allowedDirections;
      switch (this.direction) {
        case "left":
        case "right":
          allowedDirections = ["up", "down"];
          break;
        case "down":
        case "up":
          allowedDirections = ["left", "right"];
          break;
        default:
          throw "invalid direction";
      }
      if (allowedDirections.includes(newDirection)) {
        this.direction = newDirection;
      }
    }

    checkCollision(widthInBlocks, heightInBlocks) {
      const [head, ...rest] = this.body;
      const [snakeX, snakeY] = head;
      const minX = 0;
      const minY = 0;
      const maxX = widthInBlocks - 1;
      const maxY = heightInBlocks - 1;
      const isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
      const isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

      return (
        isNotBetweenHorizontalWalls ||
        isNotBetweenVerticalWalls ||
        rest.some((block) => snakeX === block[0] && snakeY === block[1])
      );
    }

    isEatingApple(appleToEat) {
      const head = this.body[0];
      return (
        head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]
      );
    }
  }

  class Apple {
    constructor(position = [10, 10]) {
      this.position = position;
    }

    setNewPosition(widthInBlocks, heightInBlocks) {
      const newX = Math.round(Math.random() * (widthInBlocks - 1));
      const newY = Math.round(Math.random() * (heightInBlocks - 1));
      this.position = [newX, newY];
    }

    isOnSnake(snakeToCheck) {
      return snakeToCheck.body.some(
        (block) =>
          this.position[0] === block[0] && this.position[1] === block[1]
      );
    }
  }

  class Drawing {
    static gameOver(ctx, centreX, centreY) {
      ctx.save();
      ctx.font = "bold 3rem sans-serif";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeStyle = "white";
      ctx.lineWidth = 5;
      ctx.strokeText("Game Over", centreX, centreY + 120);
      ctx.fillText("Game Over", centreX, centreY + 120);

        ctx.font = "bold 1.2rem sans-serif";
      let text = "Appuyer sur la touche Espace";
      ctx.strokeText(text, centreX, centreY - 120);
      ctx.fillText(text, centreX, centreY - 120);
      
      ctx.restore();
    }

    static drawScore(ctx, centreX, centreY, score) {
      ctx.save();
      ctx.font = "bold 100px sans-serif";
      ctx.fillStyle = "gray";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(score.toString(), centreX, centreY);
      ctx.restore();
    }

    static drawSnake(ctx, blockSize, snake) {
      ctx.save();

      const head = snake.body[0];
      ctx.fillStyle = "#800080";
      ctx.beginPath();
      ctx.arc(
        head[0] * blockSize + blockSize / 2,
        head[1] * blockSize + blockSize / 2,
        blockSize / 2,
        0,
        2 * Math.PI
      );
      ctx.fill();

      // Dessiner le corps du serpent
      for (let i = 1; i < snake.body.length; i++) {
        const block = snake.body[i];
        const x = block[0] * blockSize;
        const y = block[1] * blockSize;
        const radius = blockSize / 4;
        ctx.fillStyle = "#ff0000"; // Couleur rouge pour le corps
        ctx.beginPath();
        ctx.arc(x + blockSize / 2, y + blockSize / 2, radius, 0, 2 * Math.PI);
        ctx.fill();
        if (i > 0) {
          const prevBlock = snake.body[i - 1];
          const prevX = prevBlock[0] * blockSize;
          const prevY = prevBlock[1] * blockSize;

          if (prevX === x) {
            // Vertical
            ctx.fillRect(
              x + blockSize / 4,
              Math.min(y, prevY) + blockSize / 4,
              blockSize / 2,
              blockSize + blockSize / 2
            );
          } else if (prevY === y) {
            // Horizontal
            ctx.fillRect(
              Math.min(x, prevX) + blockSize / 4,
              y + blockSize / 4,
              blockSize + blockSize / 2,
              blockSize / 2
            );
          }
        }
      }

      ctx.restore();
    }

    static drawApple(ctx, blockSize, apple) {
      const radius = blockSize / 2;
      const x = apple.position[0] * blockSize + radius;
      const y = apple.position[1] * blockSize + radius;
      ctx.save();
      ctx.fillStyle = "#33cc33";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.restore();
    }

    static drawBlock(ctx, position, blockSize) {
      const [x, y] = position;
      ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    }
  }

  const myGame = new Game();

    document.onkeydown = (e) => {
      if (e.keyCode in DIRECTION_MAP) {
        if (!myGame.isCountdownInProgress) {
          const newDirection = DIRECTION_MAP[e.keyCode];
          myGame.snakee.setDirection(newDirection);
        }
      } else if (e.keyCode === DIRECTIONS.SPACE) {
        if (!myGame.isCountdownInProgress) {
          myGame.startCountdown(); 
        }
      }
    }; 
};
