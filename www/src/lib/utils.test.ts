import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("文字列クラスをスペース区切りで結合する", () => {
    expect(cn("foo", "bar", "baz")).toBe("foo bar baz");
  });

  it("falsy値や条件付きオブジェクトを無視して結合する", () => {
    expect(cn("foo", null, undefined, false, { bar: false, baz: true })).toBe(
      "foo baz",
    );
  });

  it("Tailwind CSS の競合クラスを後勝ちでマージする", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
