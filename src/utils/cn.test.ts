import { cn } from "./cn";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    const result = cn("bg-red-500", "text-white", "hover:bg-blue-500");
    expect(result).toBe("bg-red-500 text-white hover:bg-blue-500");
  });

  describe("cn utility function", () => {
    it("should merge class names correctly", () => {
      const result = cn("bg-red-500", "text-white", "hover:bg-blue-500");
      expect(result).toBe("bg-red-500 text-white hover:bg-blue-500");
    });

    it("should handle empty inputs", () => {
      const result = cn();
      expect(result).toBe("");
    });

    it("should handle conditional class names", () => {
      const result = cn(
        "bg-red-500",
        false && "text-white",
        "hover:bg-blue-500",
      );
      expect(result).toBe("bg-red-500 hover:bg-blue-500");
    });

    it("should merge conflicting Tailwind classes", () => {
      const result = cn("bg-red-500", "bg-blue-500", "hover:bg-green-500");
      expect(result).toBe("bg-blue-500 hover:bg-green-500");
    });

    it("should handle complex inputs with arrays and undefined values", () => {
      const result = cn(
        "bg-red-500",
        ["text-white", undefined, "hover:bg-blue-500"],
        null,
        "p-4",
      );
      expect(result).toBe("bg-red-500 text-white hover:bg-blue-500 p-4");
    });
  });
});
