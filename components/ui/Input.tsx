import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  rows?: number;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-charcoal-light">
        {label}
        {props.required && <span className="ml-1 text-terracotta" aria-hidden>*</span>}
      </label>
      <input
        id={inputId}
        className={cn(
          "border border-cream-300 bg-cream px-4 py-3 text-sm text-charcoal placeholder-charcoal-muted/50 transition-colors focus:border-terracotta focus:outline-none",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, rows = 5, className, id, ...props }: TextareaProps) {
  const textareaId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={textareaId} className="text-xs font-semibold uppercase tracking-wider text-charcoal-light">
        {label}
        {props.required && <span className="ml-1 text-terracotta" aria-hidden>*</span>}
      </label>
      <textarea
        id={textareaId}
        rows={rows}
        className={cn(
          "resize-none border border-cream-300 bg-cream px-4 py-3 text-sm text-charcoal placeholder-charcoal-muted/50 transition-colors focus:border-terracotta focus:outline-none",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
