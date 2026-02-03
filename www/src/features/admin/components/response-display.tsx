export function ResponseDisplay({
  isLoading,
  isError,
  data,
  error,
}: {
  isLoading: boolean;
  isError: boolean;
  data: unknown;
  error: Error | null;
}) {
  if (!isLoading && !isError && !data) return null;

  const content: string = isError
    ? error instanceof Error
      ? error.message
      : "Unknown error"
    : (JSON.stringify(data, null, 2) ?? "");

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center gap-2">
        {isLoading && (
          <span className="text-xs text-muted-foreground">Loading...</span>
        )}
        {!isLoading && !isError && !!data && (
          <span className="text-xs text-green-600 dark:text-green-400">
            Success
          </span>
        )}
        {isError && (
          <span className="text-xs text-red-600 dark:text-red-400">Error</span>
        )}
      </div>
      <pre className="p-3 bg-muted rounded text-sm font-mono overflow-auto max-h-60">
        {content}
      </pre>
    </div>
  );
}
