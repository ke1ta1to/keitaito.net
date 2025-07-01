import { handlePrismaError } from "./error-handler";

// Prismaエラーのモック（PrismaClientKnownRequestErrorの構造を模倣）
const createMockPrismaError = (code: string, message = "Mock error") => ({
  code,
  message,
  clientVersion: "5.0.0",
  meta: {},
});

describe("handlePrismaError", () => {
  // console.errorをモックしてテスト出力を抑制
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  it("should handle P2002 unique constraint error", () => {
    const error = createMockPrismaError("P2002");
    const result = handlePrismaError(error);

    expect(result).toEqual({
      success: false,
      error: "このURLは既に申請済みです。",
      field: "url",
    });
  });

  it("should handle database connection error", () => {
    const error = new Error("database connection failed");
    const result = handlePrismaError(error);

    expect(result).toEqual({
      success: false,
      error:
        "データベース接続に問題が発生しました。しばらく時間をおいて再度お試しください。",
    });
  });

  it("should handle P2025 record not found error", () => {
    const error = createMockPrismaError("P2025");
    const result = handlePrismaError(error);

    expect(result).toEqual({
      success: false,
      error: "データの保存に失敗しました。",
    });
  });

  it("should handle unknown Prisma error codes", () => {
    const error = createMockPrismaError("P9999");
    const result = handlePrismaError(error);

    expect(result).toEqual({
      success: false,
      error:
        "申請の送信に失敗しました。しばらく時間をおいて再度お試しください。",
    });
  });

  it("should handle non-Prisma errors", () => {
    const error = new Error("Generic error");
    const result = handlePrismaError(error);

    expect(result).toEqual({
      success: false,
      error:
        "申請の送信に失敗しました。しばらく時間をおいて再度お試しください。",
    });
  });

  it("should handle errors without code property", () => {
    const error = { message: "Some error without code" };
    const result = handlePrismaError(error);

    expect(result).toEqual({
      success: false,
      error:
        "申請の送信に失敗しました。しばらく時間をおいて再度お試しください。",
    });
  });

  it("should handle null/undefined errors", () => {
    const result1 = handlePrismaError(null);
    const result2 = handlePrismaError(undefined);

    expect(result1).toEqual({
      success: false,
      error:
        "申請の送信に失敗しました。しばらく時間をおいて再度お試しください。",
    });

    expect(result2).toEqual({
      success: false,
      error:
        "申請の送信に失敗しました。しばらく時間をおいて再度お試しください。",
    });
  });
});
