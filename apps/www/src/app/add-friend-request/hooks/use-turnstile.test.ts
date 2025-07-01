import { renderHook, act } from "@testing-library/react";

import { useTurnstile } from "./use-turnstile";

describe("useTurnstile", () => {
  it("should initialize with default state", () => {
    const { result } = renderHook(() => useTurnstile());

    expect(result.current.state).toEqual({
      token: null,
      isVerified: false,
      hasError: false,
      isLoading: false,
    });
  });

  it("should handle verify action", () => {
    const onVerified = jest.fn();
    const { result } = renderHook(() => useTurnstile({ onVerified }));

    act(() => {
      result.current.actions.handleVerify("test-token");
    });

    expect(result.current.state).toEqual({
      token: "test-token",
      isVerified: true,
      hasError: false,
      isLoading: false,
    });

    expect(onVerified).toHaveBeenCalledWith("test-token");
  });

  it("should handle error action", () => {
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useTurnstile({
        onError,
        autoResetErrorTypes: [], // 自動リセットを無効にしてエラー状態を保持
      }),
    );

    act(() => {
      result.current.actions.handleError();
    });

    expect(result.current.state.hasError).toBe(true);
    expect(result.current.state.isLoading).toBe(false);
    expect(onError).toHaveBeenCalledWith("verification");
  });

  it("should handle expire action", () => {
    const onError = jest.fn();
    const { result } = renderHook(() => useTurnstile({ onError }));

    // 最初にトークンを設定
    act(() => {
      result.current.actions.handleVerify("test-token");
    });

    // 期限切れを実行
    act(() => {
      result.current.actions.handleExpire();
    });

    expect(result.current.state).toEqual({
      token: null,
      isVerified: false,
      hasError: true,
      isLoading: false,
    });

    expect(onError).toHaveBeenCalledWith("general");
  });

  it("should reset state", () => {
    const { result } = renderHook(() =>
      useTurnstile({
        autoResetErrorTypes: [], // 自動リセットを無効にしてエラー状態を保持
      }),
    );

    // 最初にエラー状態を設定
    act(() => {
      result.current.actions.handleError();
    });

    expect(result.current.state.hasError).toBe(true);

    // リセット実行
    act(() => {
      result.current.actions.reset();
    });

    expect(result.current.state).toEqual({
      token: null,
      isVerified: false,
      hasError: false,
      isLoading: false,
    });
  });

  describe("shouldReset logic", () => {
    it("should return true for verification errors", () => {
      const { result } = renderHook(() => useTurnstile());

      const shouldReset = result.current.shouldReset("verification");
      expect(shouldReset).toBe(true);
    });

    it("should return false for network errors", () => {
      const { result } = renderHook(() => useTurnstile());

      const shouldReset = result.current.shouldReset("network");
      expect(shouldReset).toBe(false);
    });

    it("should return false for general errors", () => {
      const { result } = renderHook(() => useTurnstile());

      const shouldReset = result.current.shouldReset("general");
      expect(shouldReset).toBe(false);
    });
  });

  describe("auto reset functionality", () => {
    it("should auto reset on verification error when enabled", () => {
      const { result } = renderHook(() =>
        useTurnstile({
          autoResetErrorTypes: ["verification"],
        }),
      );

      // 最初にトークンを設定
      act(() => {
        result.current.actions.handleVerify("test-token");
      });

      expect(result.current.state.isVerified).toBe(true);

      // エラー発生（自動リセットが実行される）
      act(() => {
        result.current.actions.handleError();
      });

      expect(result.current.state).toEqual({
        token: null,
        isVerified: false,
        hasError: false,
        isLoading: false,
      });
    });

    it("should not auto reset when autoResetErrorTypes is empty", () => {
      const { result } = renderHook(() =>
        useTurnstile({
          autoResetErrorTypes: [],
        }),
      );

      // エラー発生
      act(() => {
        result.current.actions.handleError();
      });

      expect(result.current.state.hasError).toBe(true);
    });
  });

  describe("resetOnError option", () => {
    it("should reset on error when resetOnError is true", () => {
      const { result } = renderHook(() =>
        useTurnstile({
          resetOnError: true,
        }),
      );

      // 最初にトークンを設定
      act(() => {
        result.current.actions.handleVerify("test-token");
      });

      // エラー発生
      act(() => {
        result.current.actions.handleError();
      });

      expect(result.current.state).toEqual({
        token: null,
        isVerified: false,
        hasError: false,
        isLoading: false,
      });
    });

    it("should not reset on error when resetOnError is false", () => {
      const { result } = renderHook(() =>
        useTurnstile({
          resetOnError: false,
          autoResetErrorTypes: [],
        }),
      );

      // エラー発生
      act(() => {
        result.current.actions.handleError();
      });

      expect(result.current.state.hasError).toBe(true);
    });
  });
});
