import { ERROR_MESSAGES } from "./error-messages";

describe("ERROR_MESSAGES", () => {
  it("should contain all required error message keys", () => {
    expect(ERROR_MESSAGES).toHaveProperty("DUPLICATE_URL");
    expect(ERROR_MESSAGES).toHaveProperty("TURNSTILE_VERIFICATION_FAILED");
    expect(ERROR_MESSAGES).toHaveProperty("UNEXPECTED_ERROR");
    expect(ERROR_MESSAGES).toHaveProperty("VALIDATION_ERROR");
    expect(ERROR_MESSAGES).toHaveProperty("GENERAL_ERROR");
  });

  it("should have correct Japanese error messages", () => {
    expect(ERROR_MESSAGES.DUPLICATE_URL).toBe("このURLは既に申請済みです。");
    expect(ERROR_MESSAGES.TURNSTILE_VERIFICATION_FAILED).toBe(
      "セキュリティ認証に失敗しました。",
    );
    expect(ERROR_MESSAGES.UNEXPECTED_ERROR).toBe(
      "予期しないエラーが発生しました。再度お試しください。",
    );
    expect(ERROR_MESSAGES.VALIDATION_ERROR).toBe(
      "入力データに問題があります。内容を確認してください。",
    );
    expect(ERROR_MESSAGES.GENERAL_ERROR).toBe(
      "申請の送信に失敗しました。しばらく時間をおいて再度お試しください。",
    );
  });

  it("should have string values for all messages", () => {
    Object.values(ERROR_MESSAGES).forEach((message) => {
      expect(typeof message).toBe("string");
      expect(message.length).toBeGreaterThan(0);
    });
  });
});
