export const ERROR_MESSAGES = {
  DUPLICATE_URL: "このURLは既に申請済みです。",
  DATA_SAVE_FAILED: "データの保存に失敗しました。",
  DATABASE_CONNECTION:
    "データベース接続に問題が発生しました。しばらく時間をおいて再度お試しください。",
  VALIDATION_ERROR: "入力データに問題があります。内容を確認してください。",
  GENERAL_ERROR:
    "申請の送信に失敗しました。しばらく時間をおいて再度お試しください。",
  UNEXPECTED_ERROR: "予期しないエラーが発生しました。再度お試しください。",
  TURNSTILE_VERIFICATION_FAILED: "セキュリティ認証に失敗しました。",
  TURNSTILE_SERVER_ERROR: "認証サーバーとの通信に失敗しました。",
  TURNSTILE_CONFIG_ERROR: "サーバー設定エラーが発生しました。",
} as const;
