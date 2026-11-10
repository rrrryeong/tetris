const { rotate } = require("../game-logic");

describe("rotate(piece, collides) 회전 동작", () => {
  test("충돌이 없으면 T자 블록을 시계 방향으로 90도 회전하고 위치를 유지한다", () => {
    const piece = {
      matrix: [
        [0, 1, 0],
        [1, 1, 1],
      ],
      x: 3,
      y: 8,
    };
    const collides = jest.fn(() => false);

    const rotated = rotate(piece, collides);

    expect(rotated).toBe(true);
    expect(piece.matrix).toEqual([
      [1, 0],
      [1, 1],
      [1, 0],
    ]);
    expect(piece).toMatchObject({ x: 3, y: 8 });
    expect(collides).toHaveBeenCalledTimes(1);
    expect(collides.mock.calls[0][1]).toBe(0);
  });

  test("기본 위치가 충돌하면 왼쪽 한 칸 벽 밀기를 시도해 회전한다", () => {
    const piece = {
      matrix: [
        [1, 0],
        [1, 1],
      ],
      x: 4,
      y: 7,
    };
    // 기본 위치(0)는 막혀 있고 왼쪽 한 칸(-1) 위치는 비어 있는 상황을 만든다.
    const collides = jest.fn((_piece, offsetX) => offsetX === 0);

    const rotated = rotate(piece, collides);

    expect(rotated).toBe(true);
    expect(piece.x).toBe(3);
    expect(piece.y).toBe(7);
    expect(piece.matrix).toEqual([
      [1, 1],
      [1, 0],
    ]);
    expect(collides.mock.calls.map(([, offsetX]) => offsetX)).toEqual([0, -1]);
  });

  test("다섯 후보 위치가 모두 충돌하면 실패를 반환하고 블록 상태를 유지한다", () => {
    const originalMatrix = [
      [1, 0],
      [1, 1],
    ];
    const piece = { matrix: originalMatrix, x: 4, y: 7 };
    const collides = jest.fn(() => true);

    const rotated = rotate(piece, collides);

    expect(rotated).toBe(false);
    expect(piece.matrix).toBe(originalMatrix);
    expect(piece.matrix).toEqual([
      [1, 0],
      [1, 1],
    ]);
    expect(piece).toMatchObject({ x: 4, y: 7 });
    expect(collides.mock.calls.map(([, offsetX]) => offsetX)).toEqual([0, -1, 1, -2, 2]);
  });
});
