// Turnstile関連の型定義を統合

export interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
  "error-callback": () => void;
  "expired-callback": () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact";
}

export interface TurnstileWidgetRef {
  reset: () => void;
  remove: () => void;
}

export interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact";
}

export interface TurnstileState {
  token: string | null;
  isVerified: boolean;
  hasError: boolean;
  isLoading: boolean;
}

export interface TurnstileActions {
  reset: () => void;
  handleVerify: (token: string) => void;
  handleError: (errorType?: TurnstileErrorType) => void;
  handleExpire: () => void;
}

export type TurnstileErrorType = "verification" | "network" | "general";

declare global {
  interface Window {
    turnstile: {
      render: (
        element: HTMLElement | string,
        options: TurnstileRenderOptions,
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}
