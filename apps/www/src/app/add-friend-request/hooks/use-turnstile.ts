"use client";

import { useCallback, useRef, useState } from "react";

import type {
  TurnstileActions,
  TurnstileErrorType,
  TurnstileState,
  TurnstileWidgetRef,
} from "../types/turnstile";

interface UseTurnstileOptions {
  onVerified?: (token: string) => void;
  onError?: (errorType: TurnstileErrorType) => void;
  resetOnError?: boolean;
  autoResetErrorTypes?: TurnstileErrorType[];
}

interface UseTurnstileReturn {
  state: TurnstileState;
  actions: TurnstileActions;
  widgetRef: React.RefObject<TurnstileWidgetRef | null>;
  shouldReset: (errorType: TurnstileErrorType) => boolean;
}

export function useTurnstile({
  onVerified,
  onError,
  resetOnError = false,
  autoResetErrorTypes = ["verification"],
}: UseTurnstileOptions = {}): UseTurnstileReturn {
  const widgetRef = useRef<TurnstileWidgetRef>(null);

  const [state, setState] = useState<TurnstileState>({
    token: null,
    isVerified: false,
    hasError: false,
    isLoading: false,
  });

  const reset = useCallback(() => {
    if (widgetRef.current) {
      widgetRef.current.reset();
    }
    setState({
      token: null,
      isVerified: false,
      hasError: false,
      isLoading: false,
    });
  }, []);

  const handleVerify = useCallback(
    (token: string) => {
      setState({
        token,
        isVerified: true,
        hasError: false,
        isLoading: false,
      });
      onVerified?.(token);
    },
    [onVerified],
  );

  const handleError = useCallback(
    (errorType: TurnstileErrorType = "verification") => {
      setState((prev) => ({
        ...prev,
        hasError: true,
        isLoading: false,
      }));
      onError?.(errorType);
      if (resetOnError || autoResetErrorTypes.includes(errorType)) {
        reset();
      }
    },
    [onError, resetOnError, autoResetErrorTypes, reset],
  );

  const handleExpire = useCallback(() => {
    setState((prev) => ({
      ...prev,
      token: null,
      isVerified: false,
      hasError: true,
      isLoading: false,
    }));
    const errorType: TurnstileErrorType = "general";
    onError?.(errorType);
    if (resetOnError || autoResetErrorTypes.includes(errorType)) {
      reset();
    }
  }, [onError, resetOnError, autoResetErrorTypes, reset]);

  const shouldReset = useCallback((errorType: TurnstileErrorType): boolean => {
    switch (errorType) {
      case "verification":
        // Turnstile認証エラーの場合のみリセット
        return true;
      case "network":
      case "general":
        // 一般的なエラーではリセットしない（ユーザビリティ優先）
        return false;
      default:
        return false;
    }
  }, []);

  const actions: TurnstileActions = {
    reset,
    handleVerify,
    handleError: () => handleError("verification"),
    handleExpire,
  };

  return {
    state,
    actions,
    widgetRef,
    shouldReset,
  };
}
