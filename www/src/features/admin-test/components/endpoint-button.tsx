import { Button } from "@/components/ui/button";
import { ResponseDisplay } from "./response-display";

type Props = {
  label: string;
  onClick: () => void;
  isLoading: boolean;
  isError: boolean;
  data: unknown;
  error: Error | null;
  disabled?: boolean;
  successData?: unknown;
};

export function EndpointButton({
  label,
  onClick,
  isLoading,
  isError,
  data,
  error,
  disabled,
  successData,
}: Props) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onClick}
          disabled={disabled}
        >
          {label}
        </Button>
      </div>
      <ResponseDisplay
        isLoading={isLoading}
        isError={isError}
        data={successData !== undefined ? successData : data}
        error={error}
      />
    </div>
  );
}
