import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("単一のクラス名を返す", () => {
    expect(cn("text-red-500")).toBe("text-red-500");
  });

  it("複数のクラス名を結合する", () => {
    expect(cn("text-red-500", "bg-blue-500")).toBe("text-red-500 bg-blue-500");
  });

  it("競合するクラスは後のものが優先される", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("偽値は無視される", () => {
    expect(cn("text-red-500", false, null, undefined, 0, "")).toBe(
      "text-red-500",
    );
  });

  it("条件付きクラスを処理する", () => {
    expect(cn("base", true && "active", false && "hidden")).toBe("base active");
  });

  it("オブジェクト構文を処理する", () => {
    expect(cn({ "text-red-500": true, "bg-blue-500": false })).toBe(
      "text-red-500",
    );
  });

  it("配列構文を処理する", () => {
    expect(cn(["text-red-500", "bg-blue-500"])).toBe(
      "text-red-500 bg-blue-500",
    );
  });

  it("引数なしで空文字列を返す", () => {
    expect(cn()).toBe("");
  });
});
