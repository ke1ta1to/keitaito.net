import { friendRequestFormSchema, friendRequestSchema } from "./validation";

describe("friendRequestFormSchema", () => {
  it("should validate correct form data", () => {
    const validData = {
      url: "https://example.com",
      title: "Example Site",
      description: "A great website",
      author: "John Doe",
      email: "john@example.com",
      submittedNote: "Please consider my site",
    };

    const result = friendRequestFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should require url field", () => {
    const invalidData = {
      title: "Example Site",
      email: "john@example.com",
    };

    const result = friendRequestFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("url");
    }
  });

  it("should validate url format", () => {
    const invalidData = {
      url: "not-a-url",
      title: "Example Site",
      email: "john@example.com",
    };

    const result = friendRequestFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "有効なURLを入力してください",
      );
    }
  });

  it("should require title field", () => {
    const invalidData = {
      url: "https://example.com",
      email: "john@example.com",
    };

    const result = friendRequestFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("title");
    }
  });

  it("should validate email format", () => {
    const invalidData = {
      url: "https://example.com",
      title: "Example Site",
      email: "not-an-email",
    };

    const result = friendRequestFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "有効なメールアドレスを入力してください",
      );
    }
  });

  it("should validate title length", () => {
    const invalidData = {
      url: "https://example.com",
      title: "a".repeat(101),
      email: "john@example.com",
    };

    const result = friendRequestFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "サイトタイトルは100文字以内で入力してください",
      );
    }
  });

  it("should validate description length", () => {
    const invalidData = {
      url: "https://example.com",
      title: "Example Site",
      email: "john@example.com",
      description: "a".repeat(201),
    };

    const result = friendRequestFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "サイト説明は200文字以内で入力してください",
      );
    }
  });

  it("should allow optional fields to be undefined", () => {
    const validData = {
      url: "https://example.com",
      title: "Example Site",
      email: "john@example.com",
    };

    const result = friendRequestFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

describe("friendRequestSchema", () => {
  it("should validate form data with turnstile token", () => {
    const validData = {
      url: "https://example.com",
      title: "Example Site",
      email: "john@example.com",
      turnstileToken: "valid-token",
    };

    const result = friendRequestSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should require turnstile token", () => {
    const invalidData = {
      url: "https://example.com",
      title: "Example Site",
      email: "john@example.com",
    };

    const result = friendRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("turnstileToken");
      // Zodのデフォルトメッセージでは"Required"になる
      expect(result.error.issues[0].message).toBe("Required");
    }
  });

  it("should not allow empty turnstile token", () => {
    const invalidData = {
      url: "https://example.com",
      title: "Example Site",
      email: "john@example.com",
      turnstileToken: "",
    };

    const result = friendRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      // 空文字の場合はカスタムメッセージが表示される
      expect(result.error.issues[0].message).toBe("セキュリティ認証が必要です");
    }
  });
});
