(function () {
  // const algorithmWorker = new Worker('worker.js');
  const marging = 15;
  const height = window.innerHeight;
  const canvasLabyrinth = document.getElementById('labyrinth');
  const canvasSolution = document.getElementById('solution');
  canvasLabyrinth.width = height;
  canvasLabyrinth.height = height;
  canvasSolution.width = height;
  canvasSolution.height = height;
  const ctxLabyrinth = canvasLabyrinth.getContext('2d');
  const ctxSolution = canvasSolution.getContext('2d');
  const squares = 100;
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
        ctxLabyrinth.beginPath();
        ctxLabyrinth.strokeStyle = '#222222';
        if (positionShape.top) {
          ctxLabyrinth.moveTo(x * squareSize, y * squareSize);
          ctxLabyrinth.lineTo((x + 1) * squareSize, y * squareSize);
        }
        if (positionShape.bottom) {
          ctxLabyrinth.moveTo(x * squareSize, (y + 1) * squareSize);
          ctxLabyrinth.lineTo((x + 1) * squareSize, (y + 1) * squareSize);
        }
        if (positionShape.left) {
          ctxLabyrinth.moveTo(x * squareSize, y * squareSize);
          ctxLabyrinth.lineTo(x * squareSize, (y + 1) * squareSize);
        }
        if (positionShape.right) {
          ctxLabyrinth.moveTo((x + 1) * squareSize, y * squareSize);
          ctxLabyrinth.lineTo((x + 1) * squareSize, (y + 1) * squareSize);
        }
        ctxLabyrinth.stroke();
        if (printStepNumber && positionShape.step) {
          ctxLabyrinth.textAlign = 'center';
          ctxLabyrinth.textBaseline = 'middle';
          ctxLabyrinth.strokeText(
            positionShape.step,
            x * squareSize + squareSize / 2,
            y * squareSize + squareSize / 2,
          );
        }
        ctxLabyrinth.closePath();
      }
    }
  }

  function printStep(step) {
    for (const { x, y } of step.getPositions()) {
      const probability = step.getProbability({ x, y });
      ctxSolution.fillStyle = `rgb(255 248 117 / ${probability})`;
      ctxSolution.fillRect(
        x * squareSize + ctxSolution.lineWidth,
        y * squareSize + ctxSolution.lineWidth,
        squareSize - ctxSolution.lineWidth * 2,
        squareSize - ctxSolution.lineWidth * 2,
      );
    }
  }

  function printSolution(solution) {
    for (const {x, y} of solution) {
      ctxSolution.fillStyle = 'rgb(255 248 117)';
      ctxSolution.fillRect(
        x * squareSize + ctxSolution.lineWidth,
        y * squareSize + ctxSolution.lineWidth,
        squareSize - ctxSolution.lineWidth * 2,
        squareSize - ctxSolution.lineWidth * 2,
      );
    }
  }

  function play() {
    if (!stepCount) {
      ctxLabyrinth.clearRect(0, 0, canvasLabyrinth.width, canvasLabyrinth.height);
      ctxLabyrinth.translate(squareSize, squareSize);
      printLabyrinth(labyrinthShape);
      ctxLabyrinth.translate(-squareSize, -squareSize);
    }
    ctxSolution.clearRect(0, 0, canvasSolution.width, canvasSolution.height);
    ctxSolution.translate(squareSize, squareSize);
    if (stepCount < steps.length) {
      printStep(steps[stepCount]);
    } else if (stepCount < steps.length + 20 && Math.random() < 0.5) {
      printSolution(solution);
    }
    ctxSolution.translate(-squareSize, -squareSize);
    if (stepCount++ < steps.length + 21) {
      anim = window.requestAnimationFrame(play);
    }
  }

  anim = window.requestAnimationFrame(play);
})();
