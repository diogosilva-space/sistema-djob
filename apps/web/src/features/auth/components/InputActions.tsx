import { Eye, EyeOff, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ClearInputButtonProps {
  disabled?: boolean;
  onClear: () => void;
}

interface PasswordVisibilityButtonProps {
  disabled?: boolean;
  isVisible: boolean;
  onToggle: () => void;
}

export function ClearInputButton({ disabled, onClear }: ClearInputButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClear}
      disabled={disabled}
      aria-label="Limpar campo"
      className="h-7 w-7 text-muted-foreground hover:text-foreground"
    >
      <X className="h-3.5 w-3.5" />
    </Button>
  );
}

export function PasswordVisibilityButton({
  disabled,
  isVisible,
  onToggle,
}: PasswordVisibilityButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onToggle}
      disabled={disabled}
      aria-label={isVisible ? 'Ocultar senha' : 'Mostrar senha'}
      aria-pressed={isVisible}
      className="h-7 w-7 text-muted-foreground hover:text-foreground"
    >
      {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
    </Button>
  );
}
