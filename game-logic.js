(function attachTetrisLogic(root) {
  'use strict';

  const START_DROP_INTERVAL = 800;
  const DROP_INTERVAL_MULTIPLIER = 0.88;
  const MIN_DROP_INTERVAL = 110;

  function rotate(piece, collides) {
    const matrix = piece.matrix;
    const rotated = matrix[0].map((_, x) => matrix.map(row => row[x]).reverse());

    for (const offset of [0, -1, 1, -2, 2]) {
      if (!collides(piece, offset, 0, rotated)) {
        piece.matrix = rotated;
        piece.x += offset;
        return true;
      }
    }

    return false;
  }

  function getDropInterval(level) {
    const safeLevel = Math.max(1, Math.floor(Number(level) || 1));
    return Math.max(
      MIN_DROP_INTERVAL,
      Math.round(START_DROP_INTERVAL * DROP_INTERVAL_MULTIPLIER ** (safeLevel - 1))
    );
  }

  const api = { rotate, getDropInterval };
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.TetrisLogic = api;
  }
})(globalThis);
