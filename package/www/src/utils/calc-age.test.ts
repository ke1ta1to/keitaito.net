import { calcAge } from "./calc-age";

describe("calcAge", () => {
  it("should calculate age correctly", () => {
    const birthday = new Date("2000-01-01");
    const currentDate = new Date("2023-01-01");
    const age = calcAge(birthday, currentDate);
    expect(age).toBe(23);
  });

  it("should handle leap years", () => {
    const birthday = new Date("2000-02-29");
    const currentDate = new Date("2023-02-28");
    const age = calcAge(birthday, currentDate);
    expect(age).toBe(22);
  });
});
