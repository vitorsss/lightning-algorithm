class Labyrinth {
  _width;
  _height;
  _matrix;
  _verticalLines;
  _horizontalLines;
  _lastStep;
  startPositions;

  constructor({ width, height, verticalProbability, horizontalProbability }) {
    if (width < 10) {
      throw Error('invalid width');
    }
    if (height < 10) {
      throw Error('invalid height');
    }
    this._width = width;
    this._height = height;
    this._lastStep = 1;

    this._matrix = [];
    for (let x = 0; x < width; x++) {
      this._matrix.push([]);
    }
    do {
      this._verticalLines = [];
      for (let x = 0; x < width - 1; x++) {
        const lines = [];
        for (let y = 0; y < height; y++) {
          lines.push(Math.random() < verticalProbability);
        }
        this._verticalLines.push(lines);
      }

      this._horizontalLines = [];
      this.startPositions = [];
      for (let x = 0; x < width; x++) {
        const lines = [];
        for (let y = 0; y < height + 1; y++) {
          lines.push(Math.random() < horizontalProbability);
        }
        if (!lines[0]) {
          this.startPositions.push({
            x,
            y: 0,
          });
        }
        this._horizontalLines.push(lines);
      }
    } while (this.startPositions.length < 1);
  }

  shape() {
    const matrix = [];
    for (let x = 0; x < this._width; x++) {
      const lines = [];
      for (let y = 0; y < this._height; y++) {
        lines.push({
          top: this._horizontalLines[x][y],
          bottom: this._horizontalLines[x][y + 1],
          left: x - 1 < 0 ? true : this._verticalLines[x - 1][y],
          right: x >= this._width - 1 ? true : this._verticalLines[x][y],
          step: this.checkVisited({ x, y }),
        });
      }
      matrix.push(lines);
    }
    return {
      matrix,
      width: this._width,
      height: this._height,
    };
  }

  visit({ x, y, step }) {
    if (step < this._lastStep) {
      throw Error('invalid step count');
    }
    if (!this.checkPosition({ x, y })) {
      throw Error('invalid {x,y} position');
    }
    if (this.checkVisited({ x, y })) {
      return false;
    }
    this._matrix[x][y] = step;
    return true;
  }

  getNextPositions({ x, y }) {
    if (!this.checkPosition({ x, y })) {
      throw Error('invalid {x,y} position');
    }
    return [
      { x: x - 1, y },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 },
    ]
      .filter((position) => {
        return (
          !this.checkVisited(position) &&
          this.canMoveTo({
            ...position,
            ox: x,
            oy: y,
          })
        );
      })
      .map((position) => ({
        ...position,
        bottom: this._horizontalLines[position.x][position.y + 1],
      }));
  }

  canMoveTo({ ox, oy, x, y }) {
    if (Math.abs(ox - x) + Math.abs(oy - y) > 1) {
      return false;
    }
    if (!this.checkPosition({ x, y })) {
      return false;
    }
    if (ox == x) {
      y = Math.max(oy, y);
      return !this._horizontalLines[x][y];
    } else {
      x = Math.min(ox, x);
      return !this._verticalLines[x][y];
    }
  }

  checkPosition({ x, y }) {
    if (x < 0 || x >= this._width) {
      return false;
    }
    if (y < 0 || y >= this._height) {
      return false;
    }
    return true;
  }

  checkVisited({ x, y }) {
    return (this._matrix[x] || [])[y];
  }
}
