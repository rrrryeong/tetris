const { getDropInterval } = require("../game-logic");

describe("getDropInterval(level) 레벨별 낙하 간격", () => {
  test("레벨이 오를수록 낙하 간격이 짧아져 블록이 빨라진다", () => {
    const intervals = Array.from({ length: 10 }, (_, index) => getDropInterval(index + 1));

    expect(intervals).toEqual([800, 704, 620, 545, 480, 422, 372, 327, 288, 253]);
    expect(intervals.every((interval, index) => index === 0 || interval < intervals[index - 1])).toBe(true);
  });

  test("낙하 간격은 최소 110밀리초보다 짧아지지 않는다", () => {
    expect(getDropInterval(18)).toBe(110);
    expect(getDropInterval(99)).toBe(110);
  });

  test("0 이하이거나 숫자가 아닌 레벨은 레벨 1의 간격을 사용한다", () => {
    expect(getDropInterval(0)).toBe(800);
    expect(getDropInterval(-3)).toBe(800);
    expect(getDropInterval("not a level")).toBe(800);
  });
});
