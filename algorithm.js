class BreadthFirstSearch {
  _width;
  _height;
  _labyrinth;
  _solution;
  _steps;

  constructor({ width, height, verticalProbability, horizontalProbability }) {
    this._width = width;
    this._height = height;
    this._labyrinth = new Labyrinth({
      width,
      height,
      verticalProbability,
      horizontalProbability,
    });
  }

  getLabyrinth() {
    return this._labyrinth.shape();
  }

  findSolution() {
    if (this._solution) {
      return this._solution;
    }
    this._steps = [];
    let nextPositions = this._labyrinth.startPositions;
    let lastPosition;
    this._steps.push(nextPositions);
    while (nextPositions.length && !lastPosition) {
      nextPositions = Object.values(
        nextPositions.reduce((acc, position) => {
          acc[`${position.x}:${position.y}`] = position;
          return acc;
        }, {}),
      );
      const positions = nextPositions;
      nextPositions = [];
      for (const position of positions) {
        if (this._labyrinth.visit({ ...position, step: this._steps.length })) {
          nextPositions = nextPositions.concat(
            this._labyrinth.getNextPositions(position),
          );
        }
      }
      const maxDepth = nextPositions.reduce(
        (acc, position) => Math.max(acc, position.y),
        0,
      );
      if (maxDepth == this._height - 1) {
        lastPosition = nextPositions.find((position) => {
          return position.y == this._height - 1 && !position.bottom;
        });
      }
      this._steps.push(nextPositions);
    }
    nextPositions.forEach((position) =>
      this._labyrinth.visit({ ...position, step: this._steps.length }),
    );
    if (lastPosition) {
      const path = [];
      path[this._steps.length - 1] = lastPosition;
      for (let i = this._steps.length - 2; i >= 0; i--) {
        lastPosition = this._steps[i].find((position) =>
          this._labyrinth.canMoveTo({
            ...position,
            ox: lastPosition.x,
            oy: lastPosition.y,
          }),
        );
        path[i] = lastPosition;
      }
      this._solution = path;
    } else {
      this._solution = [];
    }
    return this._solution;
  }
}
