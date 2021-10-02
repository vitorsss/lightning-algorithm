(function () {
  // const algorithmWorker = new Worker('worker.js');
  const marging = 15;
  const height = window.innerHeight;
  const canvas = document.getElementById('labyrinth');
  canvas.width = height;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const squares = 50;
  const printStepNumber = false;
  let algorithm;
  let solution;
  let labyrinthShape;
  do {
    algorithm = new BreadthFirstSearch({
      width: squares,
      height: squares,
      verticalProbability: 0.5,
      horizontalProbability: 0.5,
    });
    solution = algorithm.findSolution();
    labyrinthShape = algorithm.getLabyrinth();
  } while (!solution || !solution.length);

  const squareSize = (height - marging * 2) / squares;

  const steps = algorithm.getSteps();

  let anim;
  let stepCount = 0;

  function printLabyrinth(labyrinthShape) {
    for (let x = 0; x < labyrinthShape.width; x++) {
      for (let y = 0; y < labyrinthShape.height; y++) {
        const positionShape = labyrinthShape.matrix[x][y];
        ctx.beginPath();
        ctx.strokeStyle = '#222222';
        if (positionShape.top) {
          ctx.moveTo(x * squareSize, y * squareSize);
          ctx.lineTo((x + 1) * squareSize, y * squareSize);
        }
        if (positionShape.bottom) {
          ctx.moveTo(x * squareSize, (y + 1) * squareSize);
          ctx.lineTo((x + 1) * squareSize, (y + 1) * squareSize);
        }
        if (positionShape.left) {
          ctx.moveTo(x * squareSize, y * squareSize);
          ctx.lineTo(x * squareSize, (y + 1) * squareSize);
        }
        if (positionShape.right) {
          ctx.moveTo((x + 1) * squareSize, y * squareSize);
          ctx.lineTo((x + 1) * squareSize, (y + 1) * squareSize);
        }
        ctx.stroke();
        if (printStepNumber && positionShape.step) {
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.strokeText(
            positionShape.step,
            x * squareSize + squareSize / 2,
            y * squareSize + squareSize / 2,
          );
        }
        ctx.closePath();
      }
    }
  }

  function printStep(step) {
    for (const { x, y } of step.getPositions()) {
      const probability = step.getProbability({ x, y });
      ctx.fillStyle = `rgb(255 248 117 / ${probability})`;
      ctx.fillRect(
        x * squareSize + ctx.lineWidth,
        y * squareSize + ctx.lineWidth,
        squareSize - ctx.lineWidth * 2,
        squareSize - ctx.lineWidth * 2,
      );
    }
  }

  function printSolution(solution) {
    for (const {x, y} of solution) {
      ctx.fillStyle = 'rgb(255 248 117)';
      ctx.fillRect(
        x * squareSize + ctx.lineWidth,
        y * squareSize + ctx.lineWidth,
        squareSize - ctx.lineWidth * 2,
        squareSize - ctx.lineWidth * 2,
      );
    }
  }

  function play() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(squareSize, squareSize);
    printLabyrinth(labyrinthShape);
    if (stepCount < steps.length) {
      printStep(steps[stepCount]);
    } else if (stepCount < steps.length + 20 && Math.random() < 0.5) {
      printSolution(solution);
    }
    ctx.translate(-squareSize, -squareSize);
    if (stepCount++ < steps.length + 21) {
      anim = window.requestAnimationFrame(play);
    }
  }

  anim = window.requestAnimationFrame(play);
})();
