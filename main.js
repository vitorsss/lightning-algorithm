(function () {
  // const algorithmWorker = new Worker('worker.js');

  const canvas = document.getElementById('labyrinth');
  const ctx = canvas.getContext('2d');

  const algorithm = new BreadthFirstSearch({
    width: 50,
    height: 50,
    verticalProbability: 0.5,
    horizontalProbability: 0.5,
  });
  const solution = algorithm.findSolution();
  const labyrinthShape = algorithm.getLabyrinth();

  const squareSize = 20;

  for (let x = 0; x < labyrinthShape.width; x++) {
    for (let y = 0; y < labyrinthShape.height; y++) {
      const positionShape = labyrinthShape.matrix[x][y];
      ctx.beginPath();
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
      if (positionShape.step) {
        ctx.strokeText(
          positionShape.step,
          x * squareSize,
          (y + 1) * squareSize,
        );
      }
      ctx.closePath();
    }
  }
})();
