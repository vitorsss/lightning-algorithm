class Step {
  _matrix;
  _positions;
  constructor({positions}) {
    this._positions = positions;
    this._matrix = [];
    const {
      minDepth,
      maxDepth,
    } = positions.reduce(({minDepth, maxDepth}, {y}) => {
      return {
        minDepth: Math.min(minDepth, y),
        maxDepth: Math.max(maxDepth, y),
      };
    }, {
      minDepth: Infinity,
      maxDepth: -Infinity,
    });
    const probabilityPerIndex = 1/(maxDepth-minDepth);
    positions.forEach(({x,y}) => {
      this._matrix[x] = this._matrix[x] || [];
      this._matrix[x][y] = (y - minDepth) * probabilityPerIndex;
    });
  }

  getProbability({
    x,
    y,
  }) {
    return (this._matrix[x] || [])[y] || 0;
  }

  getPositions() {
    return this._positions;
  }
}
